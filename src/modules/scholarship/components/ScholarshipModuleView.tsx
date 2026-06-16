import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { mockScholarshipSchemes, mockScholarshipApplications, mockDocumentVaultItems, mockGovernmentAidRecords } from '../mocks/seed';

const COLORS = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6', pink: '#ec4899', gray: '#6b7280' };

type TabId = 'dashboard' | 'schemes' | 'applications' | 'subsidies' | 'documents';
const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'schemes', label: 'Scholarship Schemes' },
  { id: 'applications', label: 'Applications' },
  { id: 'subsidies', label: 'Govt Subsidies' },
  { id: 'documents', label: 'Document Vault' },
];

function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
    'Approved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Disbursed': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Rejected': 'bg-red-100 text-red-700 border-red-200',
    'Pending Documents': 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return map[status] || 'bg-gray-100 text-gray-600 border-gray-200';
}

function DashboardTab() {
  const schemes = mockScholarshipSchemes;
  const applications = mockScholarshipApplications;
  const docs = mockDocumentVaultItems;
  const aid = mockGovernmentAidRecords;

  const activeSchemes = schemes.filter(s => s.isActive).length;
  const approved = applications.filter(a => a.status === 'Approved' || a.status === 'Disbursed').length;
  const totalDisbursed = applications.filter(a => a.status === 'Disbursed').reduce((sum, a) => sum + a.amount, 0);
  const pendingDocs = applications.filter(a => a.status === 'Pending Documents').length;
  const unverifiedDocs = docs.filter(d => !d.verified).length;

  const schemeDist = [
    { name: 'Central Govt', value: schemes.filter(s => s.schemeType === 'Central Government').length, color: COLORS.primary },
    { name: 'State Govt', value: schemes.filter(s => s.schemeType === 'State Government').length, color: COLORS.success },
    { name: 'School Fund', value: schemes.filter(s => s.schemeType === 'School Fund').length, color: COLORS.info },
  ];

  const monthlyDisbursement = [
    { month: 'Apr', amount: 15000, count: 1 }, { month: 'May', amount: 10000, count: 1 },
    { month: 'Jun', amount: 0, count: 0 }, { month: 'Jul', amount: 0, count: 0 },
  ];

  const summaryCards = [
    { title: 'Active Schemes', value: activeSchemes, color: COLORS.primary },
    { title: 'Approved Applications', value: approved, color: COLORS.success },
    { title: 'Total Disbursed', value: `₹${(totalDisbursed / 1000).toFixed(0)}k`, color: COLORS.purple },
    { title: 'Pending Docs', value: pendingDocs, color: COLORS.warning },
    { title: 'Doc Vault Items', value: docs.length, color: COLORS.info },
    { title: 'Unverified Docs', value: unverifiedDocs, color: COLORS.danger },
    { title: 'Govt Aids Tracked', value: aid.length, color: COLORS.pink },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 shadow-lg text-white flex items-center gap-3">
        <span className="text-2xl">⭐</span>
        <div>
          <p className="text-sm font-semibold text-blue-100 uppercase tracking-wider">Premium Feature</p>
          <p className="text-lg font-bold">Scholarship & Govt Scheme Management — Reduce paperwork for government audits</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {summaryCards.map(card => (
          <div key={card.title} className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{card.title}</span>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}15` }}>
                <svg className="w-3.5 h-3.5" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">{card.value}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Disbursement</h3>
          <p className="text-xs text-gray-500 mb-4">Scholarship & aid amounts disbursed</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyDisbursement} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} formatter={(value: number, name: string) => [name === 'amount' ? `₹${value.toLocaleString()}` : value, name === 'amount' ? 'Amount' : 'Count']} />
                <Legend verticalAlign="top" height={30} iconType="circle" formatter={(value: string) => <span className="text-xs text-gray-600">{value === 'amount' ? 'Amount' : 'Count'}</span>} />
                <Bar dataKey="amount" name="amount" fill={COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="count" name="count" fill={COLORS.success} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Scheme Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">By scheme type</p>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={schemeDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {schemeDist.map((e, i) => (<Cell key={i} fill={e.color} />))}
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

function SchemesTab() {
  const [filterType, setFilterType] = useState('');
  const filtered = mockScholarshipSchemes.filter(s => !filterType || s.schemeType === filterType);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Types</option>
            {['Central Government', 'State Government', 'School Fund'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">{filtered.length} schemes</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{s.schemeName}</h4>
                <span className="text-[10px] font-medium text-gray-500">{s.schemeType}</span>
              </div>
              <span className="text-lg font-bold text-indigo-600">₹{s.amount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{s.description}</p>
            <div className="space-y-1.5 text-xs">
              <p><span className="text-gray-500">Provider:</span> <span className="text-gray-700">{s.provider}</span></p>
              <p><span className="text-gray-500">Deadline:</span> <span className="text-gray-700">{new Date(s.applicationDeadline).toLocaleDateString('en-IN')}</span></p>
              <p><span className="text-gray-500">Session:</span> <span className="text-gray-700">{s.academicSession}</span></p>
            </div>
            {s.requiredDocuments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1.5">Required Docs</p>
                <div className="flex flex-wrap gap-1">
                  {s.requiredDocuments.map(d => (
                    <span key={d} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">{d}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>{s.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApplicationsTab() {
  const [filterStatus, setFilterStatus] = useState('');
  const filtered = mockScholarshipApplications.filter(a => !filterStatus || a.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Status</option>
            {['Applied', 'Approved', 'Disbursed', 'Rejected', 'Pending Documents'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">{filtered.length} applications</div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scheme</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{a.studentName}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{a.schemeName}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">₹{a.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{new Date(a.applicationDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-500 max-w-[150px] truncate">{a.rejectionReason || a.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SubsidiesTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900">Government Aid & Subsidies</h3>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aid Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scheme</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fiscal Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockGovernmentAidRecords.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{a.studentName}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{a.aidType}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{a.schemeName}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{a.provider}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">₹{a.amount.toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-500">{a.fiscalYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DocumentVaultTab() {
  const [filterType, setFilterType] = useState('');
  const filtered = mockDocumentVaultItems.filter(d => !filterType || d.documentType === filterType);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Document Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
            <option value="">All Types</option>
            {['Birth Certificate', 'Aadhaar Card', 'Transfer Certificate', 'Scholarship Doc', 'Income Certificate', 'Caste Certificate', 'Medical Report'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-medium">{filtered.length} documents</div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{d.studentName}</td>
                  <td className="px-5 py-3 text-sm text-gray-700">{d.documentName}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{d.documentType}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{new Date(d.uploadedDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3 text-center">
                    {d.verified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Verified</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500 max-w-[150px] truncate">{d.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ScholarshipModuleView() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'schemes': return <SchemesTab />;
      case 'applications': return <ApplicationsTab />;
      case 'subsidies': return <SubsidiesTab />;
      case 'documents': return <DocumentVaultTab />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">Scholarships & Govt Schemes</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">⭐ Premium</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Scholarship tracking, government aid management, and document vault</p>
        </div>
      </div>
      <div className="flex flex-wrap bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {TABS.map(tab => (
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