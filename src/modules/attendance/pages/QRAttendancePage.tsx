import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../../../store/authStore';
import {
  markAttendance,
  getTodayAttendance,
  getTodayVisitors,
  lookupPersonById,
  visitorCheckIn,
  visitorCheckOut,
} from '../services/qrAttendanceService';
import {
  UnifiedAttendanceRecord,
  VisitorRecord,
  UserType,
  AttendanceDirection,
  VisitorReference,
} from '../types';

type QrStatus = 'idle' | 'scanning' | 'processing' | 'success' | 'error';
type ActiveTab = 'scan' | 'manual' | 'visitor';

const DIRECTION_OPTS: { value: AttendanceDirection; label: string; active: string; inactive: string }[] = [
  { value: 'IN', label: 'Check In', active: 'bg-green-600 text-white shadow-sm', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { value: 'OUT', label: 'Check Out', active: 'bg-red-600 text-white shadow-sm', inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
];

const VISITOR_REF_OPTS: { value: VisitorReference; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'employee', label: 'Employee' },
  { value: 'others', label: 'Others' },
];

export function QRAttendancePage() {
  const user = useAuthStore((s) => s.user);
  const schoolId = user?.schoolId || 'default-school';
  const markedBy = user?.uid || user?.email || 'unknown';

  const [activeTab, setActiveTab] = useState<ActiveTab>('scan');
  const [qrStatus, setQrStatus] = useState<QrStatus>('idle');
  const [qrMessage, setQrMessage] = useState('');
  const [direction, setDirection] = useState<AttendanceDirection>('IN');
  const [lastScan, setLastScan] = useState<UnifiedAttendanceRecord | null>(null);
  const [todayRecords, setTodayRecords] = useState<UnifiedAttendanceRecord[]>([]);
  const [todayVisitors, setTodayVisitors] = useState<VisitorRecord[]>([]);
  const qrCodeRef = useRef<any>(null);
  const directionRef = useRef<AttendanceDirection>('IN');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Manual entry
  const [manualId, setManualId] = useState('');
  const [manualResult, setManualResult] = useState<{ userId: string; userName: string; userType: UserType; metadata?: any } | null>(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState('');

  // Visitor
  const [vName, setVName] = useState('');
  const [vRef, setVRef] = useState<VisitorReference>('others');
  const [vRefName, setVRefName] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vPurpose, setVPurpose] = useState('');
  const [vResult, setVResult] = useState<{ success: boolean; message: string } | null>(null);
  const [visitorCheckoutId, setVisitorCheckoutId] = useState('');

  // ID card capture
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const loadData = useCallback(async () => {
    const [records, visitors] = await Promise.all([
      getTodayAttendance(schoolId),
      getTodayVisitors(schoolId),
    ]);
    setTodayRecords(records);
    setTodayVisitors(visitors);
  }, [schoolId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Cleanup scanner + camera on unmount
  useEffect(() => {
    return () => {
      stopQrCode();
      stopCamera();
    };
  }, []);

  // Keep directionRef in sync
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // ── Camera for ID card ──
  const startIdCamera = useCallback(async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setShowCamera(false);
      setVResult({ success: false, message: 'Camera access denied. Use file upload.' });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setIdCardImage(canvas.toDataURL('image/jpeg', 0.8));
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setIdCardImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ── QR scanner helpers ──
  const stopQrCode = useCallback(() => {
    if (qrCodeRef.current) {
      try { qrCodeRef.current.stop(); } catch (_) { /* ignore */ }
      qrCodeRef.current = null;
    }
  }, []);

  const handleQrScan = useCallback(async (raw: string) => {
    let scannedId = raw.trim();
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
      scannedId = parsed.userId || parsed.id || parsed.admissionNo || parsed.admissionId || scannedId;
    } catch {
      parsed = null;
    }

    const currentDirection = directionRef.current;

    const person = await lookupPersonById(scannedId, schoolId);
    if (!person || !person.found) {
      setLastScan(null);
      setQrStatus('error');
      setQrMessage(`No person found with ID: ${scannedId}`);
      setTimeout(() => { setQrStatus('idle'); setQrMessage(''); }, 3000);
      return;
    }

    const meta = { ...person.metadata };
    if (parsed) {
      if (parsed.classId) meta.classId = parsed.classId;
      if (parsed.sectionId) meta.sectionId = parsed.sectionId;
      if (parsed.department) meta.department = parsed.department;
      if (parsed.designation) meta.designation = parsed.designation;
    }

    const result = await markAttendance(
      person.userId, person.userName, person.userType, currentDirection, schoolId, markedBy,
      Object.keys(meta).length ? meta : undefined,
    );

    if (result.success && result.record) {
      setLastScan(result.record);
      setQrStatus('success');
      setQrMessage(result.message);
      await loadData();
    } else {
      setLastScan(null);
      setQrStatus('error');
      setQrMessage(result.message);
    }
    setTimeout(() => { setQrStatus('idle'); setQrMessage(''); setLastScan(null); }, 3000);
  }, [schoolId, markedBy, loadData]);

  // ── QR scanner via effect (triggered by startScanner) ──
  const startScanner = useCallback(() => {
    setQrStatus('scanning');
    setQrMessage('Starting camera…');
  }, []);

  const stopScanner = useCallback(() => {
    stopQrCode();
    setQrStatus('idle');
    setQrMessage('');
  }, [stopQrCode]);

  // Separate effect to init scanner when qrStatus becomes 'scanning'
  useEffect(() => {
    if (qrStatus !== 'scanning') return;
    let cancelled = false;

    async function initScanner() {
      // Wait for DOM to render the #qr-reader div
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (cancelled) return;

      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) return;

        stopQrCode(); // ensure clean state
        const code = new Html5Qrcode('qr-reader');
        if (cancelled) { try { code.stop(); } catch (_) {} return; }
        qrCodeRef.current = code;
        setQrMessage('Point camera at QR code');

        await code.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: { width: 280, height: 280 },
            aspectRatio: 1.0,
          },
          async (decodedText: string) => {
            try { await code.stop(); } catch (_) { /* ignore */ }
            qrCodeRef.current = null;
            if (cancelled) return;
            setQrStatus('processing');
            await handleQrScan(decodedText);
          },
          () => { /* ignore - qr code decode error callback */ },
        );
      } catch (err) {
        console.error('QR scanner init error:', err);
        if (!cancelled) {
          setQrStatus('error');
          setQrMessage('Camera access denied. Use "Enter ID" or "Visitor" tabs.');
        }
      }
    }

    initScanner();
    return () => { cancelled = true; stopQrCode(); };
  }, [qrStatus, handleQrScan, stopQrCode]);

  // ── Manual ──
  const handleManualLookup = async () => {
    const id = manualId.trim();
    if (!id) { setManualError('Enter an ID.'); return; }
    setManualLoading(true); setManualError(''); setManualResult(null);
    const res = await lookupPersonById(id, schoolId);
    if (res?.found) setManualResult(res);
    else setManualError(`No person found with ID: ${id}`);
    setManualLoading(false);
  };

  const handleManualMark = async () => {
    if (!manualResult) return;
    const res = await markAttendance(manualResult.userId, manualResult.userName, manualResult.userType, direction, schoolId, markedBy, manualResult.metadata);
    if (res.success) {
      setQrMessage(res.message); setQrStatus('success');
      setLastScan(res.record || null);
      await loadData();
      setManualId(''); setManualResult(null);
    } else {
      setQrMessage(res.message); setQrStatus('error');
    }
    setTimeout(() => { setQrStatus('idle'); setQrMessage(''); setLastScan(null); }, 3000);
  };

  // ── Visitor ──
  const handleVisitorCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim()) { setVResult({ success: false, message: 'Enter visitor name.' }); return; }
    setQrStatus('processing');
    setQrMessage('Checking in visitor…');
    const res = await visitorCheckIn(vName.trim(), vRef, schoolId, markedBy, {
      referenceName: vRefName.trim() || undefined,
      phone: vPhone.trim() || undefined,
      purpose: vPurpose.trim() || undefined,
      idCardUrl: idCardImage || undefined,
    });
    setVResult({ success: res.success, message: `${res.message}${res.record?.visitorId ? ` — ID: ${res.record.visitorId}` : ''}` });
    if (res.success) {
      await loadData();
      setVName(''); setVRef('others'); setVRefName(''); setVPhone(''); setVPurpose(''); setIdCardImage(null);
    }
    setTimeout(() => setVResult(null), 5000);
  };

  const handleVisitorCheckOut = async () => {
    const id = visitorCheckoutId.trim();
    if (!id) { setVResult({ success: false, message: 'Enter a visitor ID.' }); return; }
    const res = await visitorCheckOut(id, schoolId, markedBy);
    setVResult({ success: res.success, message: res.message });
    if (res.success) { await loadData(); setVisitorCheckoutId(''); }
    setTimeout(() => setVResult(null), 5000);
  };

  const fmtTime = (ts: string) => {
    try { return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }); } catch { return ts; }
  };
  const typeBadge = (t: string) =>
    ({ student: 'bg-blue-100 text-blue-800', teacher: 'bg-purple-100 text-purple-800', employee: 'bg-orange-100 text-orange-800', others: 'bg-gray-100 text-gray-800' }[t] || 'bg-gray-100 text-gray-800');
  const dirBadge = (d: AttendanceDirection) => d === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const allToday = [
    ...todayRecords.map((r) => ({ ...r, _tag: 'attendance' as const, _displayName: r.userName })),
    ...todayVisitors.map((r) => ({ ...r, _tag: 'visitor' as const, _displayName: r.visitorName })),
  ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-5 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">QR Attendance</h2>
            <p className="text-amber-100 mt-0.5 text-xs">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={loadData} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5 w-fit">
        {(['scan', 'manual', 'visitor'] as ActiveTab[]).map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setQrMessage(''); setQrStatus('idle'); stopScanner(); }}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab === 'scan' ? '📷 Scan' : tab === 'manual' ? '⌨️ Enter ID' : '🚪 Visitor'}
          </button>
        ))}
      </div>

      {/* Direction */}
      {activeTab !== 'visitor' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Direction:</span>
          {DIRECTION_OPTS.map((opt) => (
            <button key={opt.value} onClick={() => setDirection(opt.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${direction === opt.value ? opt.active : opt.inactive}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Status */}
      {(qrMessage || vResult) && (
        <div className={`p-3 rounded-lg border text-sm ${qrStatus === 'success' || (vResult?.success) ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {qrMessage || vResult?.message}
        </div>
      )}

      {/* ── Scan Tab ── */}
      {activeTab === 'scan' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex flex-col items-center">
            {qrStatus === 'idle' && (
              <div className="w-full max-w-sm">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="mt-3 text-sm text-gray-400">Camera off</p>
                  <button onClick={startScanner} className="mt-3 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Start Scanner</button>
                </div>
              </div>
            )}
            {qrStatus === 'scanning' && (
              <div className="w-full max-w-sm">
                <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
                  Scanning…
                  <button onClick={stopScanner} className="ml-auto text-red-500 hover:text-red-700">Stop</button>
                </div>
              </div>
            )}
            {qrStatus === 'processing' && (
              <div className="py-6"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" /></div>
            )}
            {qrStatus === 'success' && lastScan && (
              <div className="w-full max-w-sm bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="mt-2 font-semibold text-green-800">{lastScan.userName}</p>
                <div className="mt-1 flex justify-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeBadge(lastScan.userType)}`}>{lastScan.userType}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${dirBadge(lastScan.direction)}`}>{lastScan.direction}</span>
                </div>
              </div>
            )}
            {qrStatus === 'error' && (
              <div className="w-full max-w-sm bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-sm text-red-700">{qrMessage}</p>
                <button onClick={() => { setQrStatus('idle'); setQrMessage(''); }} className="mt-2 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200">Try Again</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Manual Tab ── */}
      {activeTab === 'manual' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex gap-2">
            <input type="text" value={manualId} onChange={(e) => { setManualId(e.target.value); setManualResult(null); setManualError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleManualLookup(); } }}
              placeholder="Enter admission no, UID, or email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <button onClick={handleManualLookup} disabled={manualLoading || !manualId.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {manualLoading ? '…' : 'Look Up'}
            </button>
          </div>
          {manualError && <p className="mt-2 text-xs text-red-600">{manualError}</p>}
          {manualResult && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{manualResult.userName}</p>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-medium ${typeBadge(manualResult.userType)}`}>{manualResult.userType}</span>
                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {manualResult.userId}</p>
              </div>
              <button onClick={handleManualMark}
                className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${direction === 'IN' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {direction === 'IN' ? 'Check In' : 'Check Out'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Visitor Tab ── */}
      {activeTab === 'visitor' && (
        <div className="space-y-4">
          {/* Check In */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Check In</h3>
            <form onSubmit={handleVisitorCheckIn} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Name *</label>
                <input type="text" value={vName} onChange={(e) => setVName(e.target.value)} placeholder="Visitor name"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Reference</label>
                <select value={vRef} onChange={(e) => setVRef(e.target.value as VisitorReference)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  {VISITOR_REF_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Reference Name</label>
                <input type="text" value={vRefName} onChange={(e) => setVRefName(e.target.value)} placeholder="Who they're visiting"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Phone</label>
                <input type="tel" value={vPhone} onChange={(e) => setVPhone(e.target.value)} placeholder="Phone number"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Purpose</label>
                <input type="text" value={vPurpose} onChange={(e) => setVPurpose(e.target.value)} placeholder="Purpose of visit"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              {/* ID Card Upload / Capture */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">ID Card</label>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />

                {!showCamera && !idCardImage && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Upload Photo
                    </button>
                    <button type="button" onClick={startIdCamera}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Open Camera
                    </button>
                  </div>
                )}

                {showCamera && (
                  <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-black">
                    <video ref={videoRef} className="w-full h-48 object-cover" autoPlay playsInline muted />
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3">
                      <button type="button" onClick={capturePhoto} className="px-4 py-1.5 bg-white text-gray-800 text-xs font-medium rounded-lg shadow-md hover:bg-gray-100">📸 Capture</button>
                      <button type="button" onClick={stopCamera} className="px-4 py-1.5 bg-gray-800/80 text-white text-xs font-medium rounded-lg hover:bg-gray-800">Cancel</button>
                    </div>
                  </div>
                )}

                {idCardImage && (
                  <div className="mt-2 relative inline-block">
                    <img src={idCardImage} alt="ID Card" className="h-20 rounded-lg border object-cover" />
                    <button type="button" onClick={() => setIdCardImage(null)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 shadow-sm">×</button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={!vName.trim()} className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">Check In</button>
              </div>
            </form>
          </div>

          {/* Check Out */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Check Out</h3>
            <div className="flex gap-2">
              <input type="text" value={visitorCheckoutId} onChange={(e) => setVisitorCheckoutId(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleVisitorCheckOut(); } }}
                placeholder="Enter Visitor ID" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none" />
              <button onClick={handleVisitorCheckOut} disabled={!visitorCheckoutId.trim()} className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50">Check Out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Today's Feed ── */}
      {allToday.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today ({allToday.length})</span>
            <button onClick={loadData} className="text-gray-400 hover:text-gray-600" title="Refresh">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {allToday.map((rec, idx) => (
              <div key={idx} className="px-4 py-2 flex items-center gap-3 text-sm hover:bg-gray-50 transition-colors">
                <span className="text-xs text-gray-400 w-14 flex-shrink-0">{fmtTime(rec.timestamp)}</span>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: rec._tag === 'visitor' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                  {(rec._displayName).charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 font-medium text-gray-900 truncate">{rec._displayName}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${typeBadge(rec._tag === 'visitor' ? (rec as any).reference : (rec as UnifiedAttendanceRecord).userType)}`}>
                  {rec._tag === 'visitor' ? `visitor/${(rec as any).reference}` : (rec as UnifiedAttendanceRecord).userType}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${dirBadge(rec.direction)}`}>{rec.direction}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}