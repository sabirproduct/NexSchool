import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { mockHealthRecords, mockVaccinations, mockAllergies, mockMenstrualHealthRecords } from '../mocks/seed';

const COLORS = {
  primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
  info: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', gray: '#6b7280',
};

type TabId = 'dashboard' | 'records' | 'vaccinations' | 'allergies' | 'menstrual';
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Health Dashboard', icon: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'records', label: 'Medical Records', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'vaccinations', label: 'Vaccinations', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'allergies', label: 'Allergies', icon: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'menstrual', label: 'Menstrual Health', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
];

function getSeverityColor(s: string) {
  const map: Record<string, string> = { Mild: 'bg-emerald-100 text-emerald-700', Moderate: 'bg-amber-100 text-amber-700', Severe: 'bg-orange-100 text-orange-700', Emergency: 'bg-red-100 text-red-700' };
  return map[s] || 'bg-gray-100 text-gray-600';
}

function DashboardTab() {
  const records = mockHealthRecords;
  const vaccinations = mockVaccinations;
  const allergies = mockAllergies;

  const clinicVisits = records.filter(r => r.clinicVisit).length;
  const emergencies = records.filter(r => r.severity === 'Emergency').length;
  const pendingVax = vaccinations.filter(v => v.status === 'Pending').length;
  const menstrualCount = mockMenstrualHealthRecords.length;

  const severityDist = [
    { name: 'Mild', value: records.filter(r => r.severity === 'Mild').length, color: COLORS.success },
    { name: 'Moderate', value: records.filter(r => r.severity === 'Moderate').length, color: COLORS.warning },
    { name: 'Severe', value: records.filter(r => r.severity === 'Severe').length, color: COLORS.danger },
    { name: 'Emergency', value: records.filter(r => r.severity === 'Emergency').length, color: COLORS.purple },
  ];

  const monthlyTrend = [
    { month: 'Jan', visits: 3, emergencies: 0 }, { month: 'Feb', visits: 5, emergencies: 1 },
    { month: 'Mar', visits: 2, emergencies: 0 }, { month: 'Apr', visits: 6, emergencies: 0 },
    { month: 'May', visits: 4, emergencies: 1 }, { month: 'Jun', visits: 4, emergencies: 0 },
  ];

  const summaryCards = [
    { title: 'Total Records', value: records.length, color: COLORS.primary },
    { title: 'Clinic Visits', value: clinicVisits, color: COLORS.info },
    { title: 'Emergency Cases', value: emergencies, color: emergencies > 0 ? COLORS.danger : COLORS.success },
    { title: 'Pending Vaccinations', value: pendingVax, color: COLORS.warning },
    { title: 'Active Allergies', value: allergies.length, color: COLORS.purple },
    { title: 'M. Health Records', value: menstrualCount, color: COLORS.pink },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 shadow-lg text-white flex items-center gap-3">
        <span className="text-2xl">⭐</span>
        <div>
          <p className="text-sm font-semibold text-emerald-100 uppercase tracking-wider">Premium Feature</p>
          <p className="text-lg font-bold">Health & Wellness Tracking — Better student welfare and compliance records</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{card.title}</span>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <svg className="w-3.5 h-3.5" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">{card.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Clinic Visits</h3>
          <p className="text-xs text-gray-500 mb-4">Health center visits & emergencies by month</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
                <Legend verticalAlign="top" height={30} iconType="circle" formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>} />
                <Bar dataKey="visits" name="Clinic Visits" fill={COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="emergencies" name="Emergencies" fill={COLORS.danger} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Severity Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">By medical case severity</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={severityDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {severityDist.map((entry, idx) => (<Cell key={`cell-${idx}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
                <Legend verticalAlign="bottom" height={36} formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecordsTab() {
  const [filterCategory, setFilterCategory] = useState('');
  const categories = ['General Checkup', 'Illness', 'Injury', 'Vaccination', 'Dental', 'Menstrual Health', 'Emergency'];
  const filtered = mockHealthRecords.filter(r => !filterCategory || r.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">{filtered.length} records</div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Diagnosis</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">{r.studentName.charAt(0)}</div>
                      <span className="text-sm font-medium text-gray-900">{r.studentName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{new Date(r.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.category}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{r.diagnosis || '—'}</td>
                  <td className="px-5 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getSeverityColor(r.severity)}`}>{r.severity}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-500">{r.doctorName || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VaccinationsTab() {
  const filtered = mockVaccinations;
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vaccination</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Administered</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{v.studentName}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{v.vaccinationName}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{new Date(v.scheduledDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{v.administeredDate ? new Date(v.administeredDate).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${v.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : v.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{v.batchNo || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AllergiesTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAllergies.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">{a.studentName}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getSeverityColor(a.severity)}`}>{a.severity}</span>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Allergen:</span> <span className="font-medium text-gray-900">{a.allergen}</span></p>
              <p><span className="text-gray-500">Reaction:</span> <span className="text-gray-700">{a.reaction}</span></p>
              {a.medication && <p><span className="text-gray-500">Medication:</span> <span className="text-gray-700">{a.medication}</span></p>}
              {a.notes && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{a.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenstrualHealthTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-4 shadow-lg text-white">
        <p className="text-sm font-semibold text-pink-100 uppercase tracking-wider">Privacy Protected</p>
        <p className="text-lg font-bold">Menstrual Health Awareness & Tracking — Handled sensitively with privacy controls</p>
        <p className="text-sm text-pink-100 mt-1">Access restricted to authorized medical staff and warden only</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phase</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Wellness Score</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Symptoms</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Privacy</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockMenstrualHealthRecords.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{m.studentName}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{new Date(m.recordDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{m.cyclePhase}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= m.wellnessScore ? 'bg-pink-500' : 'bg-gray-200'}`} />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{m.wellnessScore}/10</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{m.symptoms.join(', ')}</td>
                  <td className="px-5 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.privacyLevel === 'confidential' ? 'bg-red-100 text-red-700' : m.privacyLevel === 'medical_only' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{m.privacyLevel}</span></td>
                  <td className="px-5 py-3">{m.requiresFollowUp ? <span className="text-amber-600 text-sm font-medium">Required</span> : <span className="text-gray-400 text-sm">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function HealthModuleView() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'records': return <RecordsTab />;
      case 'vaccinations': return <VaccinationsTab />;
      case 'allergies': return <AllergiesTab />;
      case 'menstrual': return <MenstrualHealthTab />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Health & Wellness</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">⭐ Premium</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Medical records, vaccinations, allergies, and menstrual health tracking</p>
        </div>
      </div>

      <div className="flex flex-wrap bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}