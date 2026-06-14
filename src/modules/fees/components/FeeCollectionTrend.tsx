import { useMemo } from 'react';
import { useFeeStore } from '../store/useFeeStore';

export function FeeCollectionTrend() {
  const { monthlyData } = useFeeStore();

  const maxCollection = useMemo(() => Math.max(...monthlyData.map(m => m.totalCollected), 1), [monthlyData]);
  const maxPending = useMemo(() => Math.max(...monthlyData.map(m => m.totalPending), 1), [monthlyData]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📈 Fee Collection Trend</h3>
            <p className="text-sm text-gray-500 mt-0.5">Monthly collection vs pending analysis</p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {monthlyData.length} months
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-emerald-400 to-green-500" />
                <span className="text-gray-600">Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-amber-400 to-orange-500" />
                <span className="text-gray-600">Pending</span>
              </div>
            </div>

            {/* Chart bars */}
            <div className="space-y-3">
              {monthlyData.map((month) => {
                const collectedPct = (month.totalCollected / maxCollection) * 100;
                const pendingPct = (month.totalPending / maxPending) * 100;
                return (
                  <div key={month.month} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 w-12">{month.monthLabel}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-emerald-600 font-medium">₹{(month.totalCollected / 1000).toFixed(0)}k</span>
                        <span className="text-amber-600 font-medium">₹{(month.totalPending / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                    <div className="flex gap-1 h-6">
                      <div className="flex-1 bg-gray-50 rounded-l-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-l-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${Math.min(collectedPct, 100)}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-r-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-r-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${Math.min(pendingPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Collected</p>
                <p className="text-lg font-bold text-emerald-600">
                  ₹{(monthlyData.reduce((s, m) => s + m.totalCollected, 0) / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Pending</p>
                <p className="text-lg font-bold text-amber-600">
                  ₹{(monthlyData.reduce((s, m) => s + m.totalPending, 0) / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Avg Collection/Month</p>
                <p className="text-lg font-bold text-blue-600">
                  ₹{(monthlyData.reduce((s, m) => s + m.totalCollected, 0) / Math.max(monthlyData.length, 1) / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}