import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Student } from '../types';
import { useStudentsStore } from '../store/useStudentsStore';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

function titleCase(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ');
}

function studentQRPayload(student: Student): string {
  return JSON.stringify({
    id: student.id,
    admissionNo: student.academic?.admissionNo ?? '',
    rollNo: student.academic?.rollNo ?? '',
    name: student.fullName,
    class: student.academic?.classId ?? '',
    section: student.academic?.sectionId ?? '',
    mobile: student.mobile,
  });
}

export function StudentCard({ student }: { student: Student }) {
  const imageSrc = student.photoUrl || (student as any).photoBinary;
  const [qrReady, setQrReady] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const remove = useStudentsStore((s) => s.remove);

  useEffect(() => {
    setQrReady(true);
  }, []);

  const qrValue = studentQRPayload(student);

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-lg font-semibold">
            {imageSrc ? (
              <img src={imageSrc} alt={student.fullName} className="h-full w-full object-cover" />
            ) : (
              <span>{student.firstName[0]}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-slate-900 truncate">{titleCase(student.fullName)}</div>
            <div className="text-sm text-slate-500">
              {titleCase(student.academic?.classId ?? 'NA')}-{titleCase(student.academic?.sectionId ?? 'NA')} • {student.mobile}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {student.status === 'active' && (
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="rounded-2xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                title="Delete student"
              >
                Delete
              </button>
            )}
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
              student.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
            }`}>
              {titleCase(student.status)}
            </span>
          </div>
        </div>

        {/* QR Code row */}
        {qrReady && (
          <div className="mt-3 flex items-center justify-center border-t border-slate-100 pt-3">
            <div className="flex flex-col items-center gap-1">
              <QRCodeSVG
                value={qrValue}
                size={80}
                bgColor="#ffffff"
                fgColor="#1e293b"
              />
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Scan for attendance
              </span>
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={async () => {
          await remove(student.id);
          setShowDelete(false);
        }}
      />
    </>
  );
}
