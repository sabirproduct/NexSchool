import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

const COLORS = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', teal: '#14b8a6' };

const HOSTEL_STATS = {
  totalCapacity: 200, totalOccupied: 178, available: 22, maleStudents: 95, femaleStudents: 83,
  wardens: 8, avgRating: 4.2, incidentsThisMonth: 3,
};

const BLOCK_WISE = [
  { block: 'A - Boys', capacity: 80, occupied: 72, warden: 'Mr. Sharma', cleanliness: 92 },
  { block: 'B - Boys', capacity: 60, occupied: 55, warden: 'Mr. Verma', cleanliness: 88 },
  { block: 'C - Girls', capacity: 70, occupied: 65, warden: 'Ms. Gupta', cleanliness: 95 },
  { block: 'D - Girls', capacity: 50, occupied: 48, warden: 'Ms. Patel', cleanliness: 90 },
];

const MONTHLY_OCCUPANCY = [
  { month: 'Jan', occupancy: 85 }, { month: 'Feb', occupancy: 88 },
  { month: 'Mar', occupancy: 90 }, { month: 'Apr', occupancy: 92 },
  { month: 'May', occupancy: 78 }, { month: 'Jun', occupancy: 82 },
];

const RECENT_ACTIVITY = [
  { action: 'New check-in: Room 201 - Aarav Sharma', type: 'checkin', time: '2 hours ago' },
  { action: 'Maintenance request: Room 105 - Fan repair', type: 'maintenance', time: '4 hours ago' },
  { action: 'Check-out: Room 304 - Rohan Kumar (Graduated)', type: 'checkout', time: '1 day ago' },
  { action: 'Complaint registered: Water issue Block C', type: 'complaint', time: '1 day ago' },
  { action: 'Room inspection completed: Block A & B', type: 'inspection', time: '2 days ago' },
  { action: 'New warden assigned: Block C night shift', type: 'staff', time: '3 days ago' },
];

const ROOM_AVAILABILITY = [
  { type: 'Single Room', total: 40, occupied: 32, price: '₹8,000/mo' },
  { type: 'Double Sharing', total: 80, occupied: 74, price: '₹5,000/mo' },
  { type: 'Triple Sharing', total: 60, occupied: 55, price: '₹3,500/mo' },
  { type: 'Dormitory', total: 20, occupied: 17, price: '₹2,500/mo' },
];

export function HostelWardenDashboard() {
  const occupancyRate = Math.round((HOSTEL_STATS.totalOccupied / HOSTEL_STATS.totalCapacity) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-rose-600 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Hostel Management Dashboard</h2>
            <p className="text-orange-100 mt-1">Track occupancy, maintenance, student welfare & block-wise operations</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium">{occupancyRate}% Occupied</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {[
          { label: 'Total Capacity', value: HOSTEL_STATS.totalCapacity, icon: '🏛️', color: COLORS.primary, sub: `${HOSTEL_STATS.available} available` },
          { label: 'Occupied', value: HOSTEL_STATS.totalOccupied, icon: '🛏️', color: COLORS.success, sub: `${occupancyRate}% occupancy` },
          { label: 'Boys', value: HOSTEL_STATS.maleStudents, icon: '👨', color: COLORS.info, sub: 'In all blocks' },
          { label: 'Girls', value: HOSTEL_STATS.femaleStudents, icon: '👩', color: COLORS.pink, sub: 'In all blocks' },
          { label: 'Wardens', value: HOSTEL_STATS.wardens, icon: '🛡️', color: COLORS.purple, sub: 'On duty' },
          { label: 'Rating', value: `${HOSTEL_STATS.avgRating}⭐`, icon: '🌟', color: COLORS.warning, sub: 'Student rated' },
          { label: 'Incidents', value: HOSTEL_STATS.incidentsThisMonth, icon: '⚠️', color: COLORS.danger, sub: 'This month' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{kpi.icon}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
            <p className="text-[10px] text-gray-600">{kpi.label}</p>
            <p className="text-[8px] text-gray-400">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Block-wise */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Block-wise Occupancy</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {BLOCK_WISE.map((block) => (
              <div key={block.block} className="px-5 py-4 hover:bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{block.block}</p>
                    <p className="text-[10px] text-gray-500">Warden: {block.warden}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{block.occupied}/{block.capacity}</p>
                    <p className="text-[10px] text-gray-500">{Math.round((block.occupied / block.capacity) * 100)}% full</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${(block.occupied / block.capacity) * 100}%` }} />
                  </div>
                  <span className={`text-[10px] font-medium ${block.cleanliness >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    Clean: {block.cleanliness}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Availability */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Room Type Availability</h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {ROOM_AVAILABILITY.map((room) => {
                const availPct = Math.round(((room.total - room.occupied) / room.total) * 100);
                return (
                  <div key={room.type} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{room.type}</span>
                        <span className="text-xs text-gray-500">{room.price}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(room.occupied / room.total) * 100}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-400">{room.occupied}/{room.total} occupied</span>
                        <span className="text-[10px] text-emerald-600 font-medium">{room.total - room.occupied} left</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Occupancy Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Hostel occupancy rate over the year</p>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={MONTHLY_OCCUPANCY} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="occupancy" name="Occupancy %" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 5, fill: COLORS.primary, strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-[280px] overflow-y-auto">
            {RECENT_ACTIVITY.map((act, idx) => (
              <div key={idx} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50/50">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                  act.type === 'checkin' ? 'bg-emerald-100' : act.type === 'checkout' ? 'bg-blue-100' :
                  act.type === 'maintenance' ? 'bg-amber-100' : act.type === 'complaint' ? 'bg-red-100' : 'bg-purple-100'
                }`}>
                  {act.type === 'checkin' ? '✅' : act.type === 'checkout' ? '🚪' : act.type === 'maintenance' ? '🔧' : act.type === 'complaint' ? '📢' : '📋'}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-900">{act.action}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}