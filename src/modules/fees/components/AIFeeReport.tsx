import { useState } from 'react';
import { useFeeStore } from '../store/useFeeStore';

export function AIFeeReport() {
  const { aiReport, monthlyData } = useFeeStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'recommendations'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'AI Overview', icon: '🤖' },
    { id: 'insights' as const, label: 'Smart Insights', icon: '💡' },
    { id: 'recommendations' as const, label: 'Recommendations', icon: '🎯' },
  ];

  const currentCollection = monthlyData.reduce((s, m) => s + m.totalCollected, 0);
  const currentPending = monthlyData.reduce((s, m) => s + m.totalPending, 0);
  const collectionPct = (currentCollection / (currentCollection + currentPending)) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">🤖 AI-Powered Fee Intelligence</h3>
            <p className="text-sm text-gray-500 mt-0.5">Smart analysis and recommendations for fee management</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-500">AI Active</span>
          </div>
        </div>

        {/* AI Score Card */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/80 font-medium uppercase tracking-wider">Collection Health Score</p>
              <p className="text-3xl font-bold mt-1">{Math.round(collectionPct)}%</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
              {collectionPct >= 80 ? '🌟' : collectionPct >= 60 ? '👍' : '⚠️'}
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div
              className="bg-white rounded-full h-2 transition-all duration-1000"
              style={{ width: `${Math.min(collectionPct, 100)}%` }}
            />
          </div>
          <p className="text-sm text-white/90">{aiReport.overallHealth}</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 mb-6 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💰</span>
                  <h4 className="font-bold text-gray-900">Collection Efficiency</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{aiReport.collectionEfficiency}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⚠️</span>
                  <h4 className="font-bold text-gray-900">Risk Assessment</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{aiReport.riskAssessment}</p>
              </div>
            </div>

            {/* Top Delinquents */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔴</span>
                <h4 className="font-bold text-gray-900">Top Delinquents</h4>
              </div>
              <div className="space-y-2">
                {aiReport.topDelinquents.map((delinquent, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{delinquent}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Predicted Collection */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔮</span>
                <h4 className="font-bold text-gray-900">AI Prediction</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{aiReport.predictedCollection}</p>
            </div>

            {/* Fee Utilization */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📊</span>
                <h4 className="font-bold text-gray-900">Fee Utilization Breakdown</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{aiReport.feeUtilization}</p>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Academic Programs', pct: 40, color: 'bg-blue-500' },
                  { label: 'Infrastructure', pct: 25, color: 'bg-indigo-500' },
                  { label: 'Staff Salaries', pct: 20, color: 'bg-purple-500' },
                  { label: 'Co-curricular', pct: 10, color: 'bg-pink-500' },
                  { label: 'Reserves', pct: 5, color: 'bg-gray-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-28">{item.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 mb-4">💡 Smart Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiReport.insights.map((insight, idx) => {
                const icons = ['📈', '🏆', '📉', '💳', '📅', '🎯'];
                const gradients = [
                  'from-emerald-50 to-green-50 border-emerald-100',
                  'from-blue-50 to-indigo-50 border-blue-100',
                  'from-amber-50 to-orange-50 border-amber-100',
                  'from-purple-50 to-violet-50 border-purple-100',
                  'from-cyan-50 to-teal-50 border-cyan-100',
                  'from-rose-50 to-pink-50 border-rose-100',
                ];
                return (
                  <div key={idx} className={`bg-gradient-to-br ${gradients[idx % gradients.length]} rounded-xl p-4 border`}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{icons[idx % icons.length]}</span>
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 mb-4">🎯 AI Recommendations</h4>
            <div className="space-y-3">
              {aiReport.recommendations.map((rec, idx) => {
                const gradients = [
                  'from-indigo-50 to-blue-50 border-indigo-100',
                  'from-emerald-50 to-green-50 border-emerald-100',
                  'from-purple-50 to-violet-50 border-purple-100',
                  'from-amber-50 to-orange-50 border-amber-100',
                  'from-cyan-50 to-teal-50 border-cyan-100',
                  'from-rose-50 to-pink-50 border-rose-100',
                ];
                return (
                  <div key={idx} className={`bg-gradient-to-br ${gradients[idx % gradients.length]} rounded-xl p-4 border flex items-start gap-3`}>
                    <span className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm text-gray-700 font-medium">{rec}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Summary Footer */}
            <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✨</span>
                <h4 className="font-bold text-gray-900">AI Summary</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Based on comprehensive analysis of fee collection data across {monthlyData.length} months,
                the system recommends immediate action on top defaulters while maintaining current strategies
                for well-performing classes. Implementing online payment gateways and automated reminders
                could improve collection efficiency by an estimated 8-12%.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            AI analysis generated by NexSchool Intelligence • {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Analysis based on real-time fee collection data and historical trends
          </p>
        </div>
      </div>
    </div>
  );
}