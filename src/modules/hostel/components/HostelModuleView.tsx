import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useHostelStore } from '../store/useHostelStore';
import { ComplaintStatus, HostelBlock } from '../types';

// ── Colour Palette ─────────────────────────────────────────────
const COLORS = {
  primary: '#6366f1',
  primaryLight: '#eef2ff',
  secondary: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  gray: '#6b7280',
  grayBg: '#f8fafc',
  border: '#e2e8f0',
};

const CHART_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

// ── Tab Config ─────────────────────────────────────────────────
type TabId = 'dashboard' | 'occupancy' | 'rooms' | 'allocation' | 'complaints' | 'mess' | 'ai-report';

interface TabConfig { id: TabId; label: string; icon: string; }

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'occupancy', label: 'Block Occupancy', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'rooms', label: 'Room Explorer', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { id: 'allocation', label: 'Allocations', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'complaints', label: 'Complaints', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
  { id: 'mess', label: 'Mess Menu', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { id: 'ai-report', label: 'AI Report', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
];

// ── Helpers ────────────────────────────────────────────────────
function getStatusColor(status: string) {
  switch (status) {
    case 'Available': return COLORS.success;
    case 'Occupied': return COLORS.primary;
    case 'Maintenance': return COLORS.warning;
    case 'Open': return COLORS.danger;
    case 'In Progress': return COLORS.warning;
    case 'Resolved': return COLORS.success;
    case 'Closed': return COLORS.gray;
    default: return COLORS.gray;
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Occupied': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Open': return 'bg-red-100 text-red-700 border-red-200';
    case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Closed': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

function getComplaintPriorityColor(p: string) {
  switch (p) {
    case 'Critical': return 'bg-red-500';
    case 'High': return 'bg-orange-500';
    case 'Medium': return 'bg-yellow-500';
    case 'Low': return 'bg-green-500';
    default: return 'bg-gray-400';
  }
}

// ── Dashboard Tab ──────────────────────────────────────────────
function DashboardTab() {
  const { blocks, rooms, beds, allocations, complaints, monthlyOccupancy, blockOccupancy, totalBeds, occupiedBeds } = useHostelStore();
  const vacantBeds = totalBeds - occupiedBeds;
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const openComplaints = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
  const totalMonthlyRevenue = occupiedBeds * 5000;

  // Monthly occupancy trend
  const occupancyTrendData = monthlyOccupancy.map(m => ({
    month: m.monthLabel,
    occupancy: m.occupancyPct,
    vacant: 100 - m.occupancyPct,
  }));

  // Block occupancy pie data
  const blockPieData = blockOccupancy.map(b => ({
    name: b.blockName.split(' ')[0],
    value: b.currentOccupancy,
    color: CHART_COLORS[blocks.findIndex(bl => bl.id === b.blockId) % CHART_COLORS.length],
  }));

  const summaryCards = [
    { title: 'Total Blocks', value: blocks.length, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: COLORS.primary },
    { title: 'Total Rooms', value: rooms.length, icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', color: COLORS.secondary },
    { title: 'Total Beds', value: totalBeds, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: COLORS.success },
    { title: 'Occupied Beds', value: occupiedBeds, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: COLORS.info },
    { title: 'Vacant Beds', value: vacantBeds, icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4', color: COLORS.warning },
    { title: 'Occupancy Rate', value: `${occupancyPct}%`, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: COLORS.purple },
    { title: 'Allocations', value: allocations.length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: COLORS.pink },
    { title: 'Open Complaints', value: openComplaints, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z', color: COLORS.danger },
    { title: 'Est. Revenue/mo', value: `₹${(totalMonthlyRevenue / 1000).toFixed(0)}k`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: COLORS.success },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{card.title}</span>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <svg className="w-3.5 h-3.5" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Occupancy Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Occupancy percentage across the academic year</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={occupancyTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}
                  formatter={(value: number) => `${value}%`}
                />
                <Line type="monotone" dataKey="occupancy" name="Occupancy" stroke={COLORS.primary} strokeWidth={2.5} dot={{ fill: COLORS.primary, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Block Occupancy Pie */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Block Occupancy</h3>
          <p className="text-xs text-gray-500 mb-4">Current occupancy by hostel block</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={blockPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {blockPieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}
                  formatter={(value: number, name: string) => [`${value} students`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Hostel Overview</h3>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Boys Blocks</span>
              <span className="text-sm font-semibold text-gray-900">{blocks.filter(b => b.gender === 'Boys').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Girls Blocks</span>
              <span className="text-sm font-semibold text-gray-900">{blocks.filter(b => b.gender === 'Girls').length}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Single Rooms</span>
              <span className="text-sm font-semibold text-gray-900">{rooms.filter(r => r.roomType === 'Single').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Twin Sharing</span>
              <span className="text-sm font-semibold text-gray-900">{rooms.filter(r => r.roomType === 'Twin Sharing').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Triple Sharing</span>
              <span className="text-sm font-semibold text-gray-900">{rooms.filter(r => r.roomType === 'Triple Sharing').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dormitory Rooms</span>
              <span className="text-sm font-semibold text-gray-900">{rooms.filter(r => r.roomType === 'Dormitory').length}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Occupancy Rate</span>
              <span className="text-sm font-semibold" style={{ color: occupancyPct > 75 ? COLORS.success : occupancyPct > 50 ? COLORS.warning : COLORS.danger }}>
                {occupancyPct}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${occupancyPct}%`, backgroundColor: occupancyPct > 75 ? COLORS.success : occupancyPct > 50 ? COLORS.warning : COLORS.danger }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Block Occupancy Tab ────────────────────────────────────────
function OccupancyTab() {
  const { blocks, blockOccupancy } = useHostelStore();

  const blockBarData = blockOccupancy.map(b => ({
    name: b.blockName.split(' ')[0],
    blockName: b.blockName,
    occupancy: b.occupancyPct,
    vacant: 100 - b.occupancyPct,
    total: b.totalCapacity,
  }));

  const [selectedBlock, setSelectedBlock] = useState(blocks[0]?.id ?? '');

  return (
    <div className="space-y-6">
      {/* Block Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Block Wise Occupancy</h3>
        <p className="text-xs text-gray-500 mb-4">Occupancy vs capacity across hostel blocks</p>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={blockBarData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}
                formatter={(value: number, name: string) => [`${value}%`, name === 'occupancy' ? 'Occupied' : 'Vacant']}
                labelFormatter={(label) => blockBarData.find(b => b.name === label)?.blockName ?? label}
              />
              <Legend
                verticalAlign="top"
                height={30}
                iconType="circle"
                formatter={(value: string) => <span className="text-xs text-gray-600">{value === 'occupancy' ? 'Occupied' : 'Vacant'}</span>}
              />
              <Bar dataKey="occupancy" name="occupancy" stackId="a" fill={COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={60} />
              <Bar dataKey="vacant" name="vacant" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Block Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((block) => {
          const occupancy = blockOccupancy.find(b => b.blockId === block.id);
          const pct = occupancy?.occupancyPct ?? 0;
          return (
            <div key={block.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{block.blockName}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${block.gender === 'Boys' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                    {block.gender}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">
                  {block.gender === 'Boys' ? '👦' : '👧'}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-medium text-gray-900">{block.totalCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Occupied</span>
                  <span className="font-medium text-gray-900">{block.currentOccupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vacant</span>
                  <span className="font-medium text-gray-900">{block.totalCapacity - block.currentOccupancy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rooms</span>
                  <span className="font-medium text-gray-900">{block.totalRooms}</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Occupancy</span>
                  <span className="font-medium" style={{ color: pct > 75 ? COLORS.success : pct > 50 ? COLORS.warning : COLORS.danger }}>{pct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: pct > 75 ? COLORS.success : pct > 50 ? COLORS.warning : COLORS.danger }} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-1.5">
                  {block.amenities.map((amenity) => (
                    <span key={amenity} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                <span>Warden: {block.wardenName}</span>
                <span className="ml-2">Caretaker: {block.caretakerName}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Room Explorer Tab ──────────────────────────────────────────
function RoomsTab() {
  const { rooms, blocks } = useHostelStore();
  const [selectedBlock, setSelectedBlock] = useState(blocks[0]?.id ?? '');
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  const floors = ['Ground', 'First', 'Second', 'Third', 'Fourth'];
  const roomTypes = ['Single', 'Twin Sharing', 'Triple Sharing', 'Dormitory'];

  const filteredRooms = useMemo(() => {
    return rooms.filter(r =>
      r.blockId === selectedBlock &&
      (!selectedFloor || r.floor === selectedFloor) &&
      (!selectedType || r.roomType === selectedType)
    );
  }, [rooms, selectedBlock, selectedFloor, selectedType]);

  const currentBlock = blocks.find(b => b.id === selectedBlock);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Block</label>
          <select
            value={selectedBlock}
            onChange={(e) => { setSelectedBlock(e.target.value); setSelectedFloor(''); setSelectedType(''); }}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          >
            {blocks.map(b => (
              <option key={b.id} value={b.id}>{b.blockName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Floor</label>
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          >
            <option value="">All Floors</option>
            {floors.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Room Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          >
            <option value="">All Types</option>
            {roomTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {filteredRooms.length} rooms
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const pct = room.totalBeds > 0 ? Math.round((room.occupiedBeds / room.totalBeds) * 100) : 0;
          return (
            <div key={room.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">{room.roomNumber}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                  style={{
                    backgroundColor: room.isActive ? '#dcfce7' : '#fee2e2',
                    color: room.isActive ? '#166534' : '#991b1b',
                  }}
                >
                  {room.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                <p>{room.floor} Floor • {room.roomType}</p>
                <p>₹{room.rentPerBed.toLocaleString()}/bed</p>
                <p className="text-gray-400">{room.description}</p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? COLORS.success : pct > 50 ? COLORS.warning : COLORS.info }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{room.occupiedBeds}/{room.totalBeds} beds</span>
                <span className={pct === 100 ? 'text-emerald-600 font-medium' : ''}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm">No rooms match your filters.</p>
        </div>
      )}
    </div>
  );
}

// ── Allocations Tab ────────────────────────────────────────────
function AllocationsTab() {
  const { allocations, blocks, rooms } = useHostelStore();
  const [selectedBlock, setSelectedBlock] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const filteredAllocations = useMemo(() => {
    return allocations.filter(a =>
      (!showActiveOnly || a.isActive) &&
      (!selectedBlock || a.blockId === selectedBlock) &&
      (!searchTerm || a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || a.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allocations, selectedBlock, searchTerm, showActiveOnly]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Search</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Block</label>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          >
            <option value="">All Blocks</option>
            {blocks.map(b => (
              <option key={b.id} value={b.id}>{b.blockName}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 pt-5">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            <span className="ml-2 text-xs text-gray-500 font-medium">Active Only</span>
          </label>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">
          {filteredAllocations.length} allocations
        </div>
      </div>

      {/* Allocations Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Block</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bed</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Allocation Date</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Rent</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Deposit</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAllocations.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {a.studentName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{a.studentName}</span>
                        <span className="text-xs text-gray-400 block">{a.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{a.blockName}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{a.roomNumber}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">
                    <span className="font-mono text-xs">{a.bedId.split('-').pop()}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-700">{a.allocationDate}</td>
                  <td className="px-5 py-3 text-right text-sm font-medium text-gray-900">₹{a.monthlyRent.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-sm text-gray-700">₹{a.depositPaid.toLocaleString()}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${a.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAllocations.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm">No allocations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

// ── Complaints Tab ─────────────────────────────────────────────
function ComplaintsTab() {
  const { complaints, blocks } = useHostelStore();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [expandedComplaint, setExpandedComplaint] = useState<string | null>(null);

  const categories = ['Maintenance', 'Cleanliness', 'Food', 'Electricity', 'Plumbing', 'Furniture', 'Security', 'Other'];
  const statuses: ComplaintStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c =>
      (!selectedCategory || c.category === selectedCategory) &&
      (!selectedStatus || c.status === selectedStatus) &&
      (!selectedPriority || c.priority === selectedPriority) &&
      (!selectedBlock || c.blockName === selectedBlock)
    );
  }, [complaints, selectedCategory, selectedStatus, selectedPriority, selectedBlock]);

  // Stats
  const openCount = complaints.filter(c => c.status === 'Open').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const criticalCount = complaints.filter(c => c.priority === 'Critical' && c.status !== 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Open</span>
            <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="text-xs font-bold text-red-600">{openCount}</span>
            </div>
          </div>
          <span className="text-lg font-bold text-gray-900">{openCount}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">In Progress</span>
            <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-600">{inProgressCount}</span>
            </div>
          </div>
          <span className="text-lg font-bold text-gray-900">{inProgressCount}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Resolved</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-600">{resolvedCount}</span>
            </div>
          </div>
          <span className="text-lg font-bold text-gray-900">{resolvedCount}</span>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Critical</span>
            <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="text-xs font-bold text-red-600">{criticalCount}</span>
            </div>
          </div>
          <span className="text-lg font-bold text-gray-900">{criticalCount}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Priority</label>
          <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Priorities</option>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Block</label>
          <select value={selectedBlock} onChange={(e) => setSelectedBlock(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Blocks</option>
            {blocks.map(b => <option key={b.id} value={b.blockName}>{b.blockName}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">
          {filteredComplaints.length} complaints
        </div>
      </div>

      {/* Complaint List */}
      <div className="space-y-2.5">
        {filteredComplaints.map((complaint) => {
          const isExpanded = expandedComplaint === complaint.id;
          return (
            <div key={complaint.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
              <button
                type="button"
                onClick={() => setExpandedComplaint(isExpanded ? null : complaint.id)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${getComplaintPriorityColor(complaint.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">{complaint.subject}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeClass(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>{complaint.studentName}</span>
                      <span>•</span>
                      <span>{complaint.blockName} - {complaint.roomNumber}</span>
                      <span>•</span>
                      <span>{complaint.category}</span>
                      <span>•</span>
                      <span className="font-medium" style={{ color: complaint.priority === 'Critical' ? COLORS.danger : complaint.priority === 'High' ? COLORS.warning : COLORS.gray }}>
                        {complaint.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{complaint.filedDate}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-64' : 'max-h-0'}`}>
                <div className="px-5 pb-4 pt-0 border-t border-gray-100">
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <p>{complaint.description}</p>
                    {complaint.resolvedDate && (
                      <p className="text-xs text-emerald-600">Resolved on {complaint.resolvedDate} by {complaint.resolvedBy}</p>
                    )}
                    {complaint.remarks && (
                      <p className="text-xs text-gray-400 italic">Remarks: {complaint.remarks}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm">No complaints found matching your filters.</p>
        </div>
      )}
    </div>
  );
}

// ── Mess Menu Tab ──────────────────────────────────────────────
function MessTab() {
  const { messMenu } = useHostelStore();
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'] as const;

  const dayMenu = messMenu.filter(m => m.day === selectedDay);

  // Group by meal type
  const groupedMenu = mealTypes.map(meal => ({
    mealType: meal,
    items: dayMenu.filter(m => m.mealType === meal),
  }));

  const mealIcons: Record<string, string> = {
    Breakfast: '🌅',
    Lunch: '☀️',
    Snacks: '🍪',
    Dinner: '🌙',
  };

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex flex-wrap gap-2">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              selectedDay === day
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        Showing menu for <span className="font-semibold text-gray-900">{selectedDay}</span>
      </div>

      {/* Meal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groupedMenu.map(({ mealType, items }) => (
          <div key={mealType} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{mealIcons[mealType]}</span>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{mealType}</h4>
                {items.length > 0 && (
                  <p className="text-[10px] text-gray-400">{items[0].startTime} - {items[0].endTime}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              {items.length > 0 ? items.map((item) =>
                item.items.map((food, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {food}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No menu listed</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Overview Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Weekly Mess Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Meal</th>
                {days.map(day => (
                  <th key={day} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{day.slice(0, 3)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mealTypes.map((meal) => (
                <tr key={meal} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-medium text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <span>{mealIcons[meal]}</span>
                      <span>{meal}</span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const menuItem = messMenu.find(m => m.day === day && m.mealType === meal);
                    return (
                      <td key={`${day}-${meal}`} className="px-2 py-2 text-center text-xs text-gray-600">
                        {menuItem ? (
                          <div className="px-1.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100">
                            {menuItem.items.join(', ')}
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── AI Report Tab ──────────────────────────────────────────────
function AIReportTab() {
  const { aiReport, blocks, monthlyOccupancy, occupiedBeds, totalBeds } = useHostelStore();

  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metric */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-100">Hostel AI Report</p>
            <h3 className="text-xl font-bold mt-1">Occupancy Health: {occupancyPct}%</h3>
            <p className="text-sm text-indigo-100 mt-1">{blocks.length} Blocks • {totalBeds} Beds • {occupiedBeds} Occupied</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            🤖
          </div>
        </div>
        <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${Math.min(100, occupancyPct)}%` }} />
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📊</span>
            <h4 className="text-sm font-semibold text-gray-900">Overall Occupancy</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{aiReport.overallOccupancy}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📈</span>
            <h4 className="text-sm font-semibold text-gray-900">Occupancy Trend</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{aiReport.occupancyTrend}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚠️</span>
            <h4 className="text-sm font-semibold text-gray-900">Complaint Analysis</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{aiReport.complaintAnalysis}</p>
          {aiReport.topComplaints.length > 0 && (
            <div className="mt-3 space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase">Top Open Complaints</span>
              {aiReport.topComplaints.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💰</span>
            <h4 className="text-sm font-semibold text-gray-900">Revenue Analysis</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{aiReport.revenueAnalysis}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💡</span>
          <h4 className="text-sm font-semibold text-gray-900">AI Recommendations</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiReport.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
              <p className="text-sm text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔍</span>
          <h4 className="text-sm font-semibold text-gray-900">Key Insights</h4>
        </div>
        <div className="space-y-3">
          {aiReport.insights.map((insight, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                {idx + 1}
              </div>
              <p className="text-sm text-gray-600">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export function HostelModuleView() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { blocks, totalBeds, occupiedBeds } = useHostelStore();
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hostel Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage hostel blocks, room allocations, complaints, and mess operations</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: occupancyPct > 75 ? COLORS.success : occupancyPct > 50 ? COLORS.warning : COLORS.danger }} />
          <span className="font-medium text-gray-700">{blocks.length} Blocks • {occupancyPct}% Occupied</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'occupancy' && <OccupancyTab />}
        {activeTab === 'rooms' && <RoomsTab />}
        {activeTab === 'allocation' && <AllocationsTab />}
        {activeTab === 'complaints' && <ComplaintsTab />}
        {activeTab === 'mess' && <MessTab />}
        {activeTab === 'ai-report' && <AIReportTab />}
      </div>
    </div>
  );
}
