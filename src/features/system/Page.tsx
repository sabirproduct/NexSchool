import { useState } from 'react';
import { UserManagementPage } from '../../modules/system/pages/UserManagementPage';
import { RoleManagementPage } from '../../modules/system/pages/RoleManagementPage';

type Tab = 'users' | 'roles';

export function SystemPage() {
  const [activeTab, setActiveTab] = useState<Tab>('users');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm inline-flex">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          👥 User Management
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'roles'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          🔐 Role & Permissions
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'users' ? <UserManagementPage /> : <RoleManagementPage />}
    </div>
  );
}