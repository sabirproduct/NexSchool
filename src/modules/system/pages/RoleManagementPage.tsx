import { useState, useEffect } from 'react';
import { SystemRole, SYSTEM_ROLES } from '../types';
import {
  fetchAllRoles,
  subscribeToRoles,
  updateRolePermissions,
  createCustomRole,
  deleteRole,
} from '../services/systemService';

interface RolePermission {
  module: string;
  label: string;
  description: string;
}

const ALL_PERMISSIONS: RolePermission[] = [
  { module: 'dashboard', label: 'Dashboard', description: 'Access to analytics dashboard' },
  { module: 'students', label: 'Students', description: 'Student management & records' },
  { module: 'admissions', label: 'Admissions', description: 'Admission process & inquiries' },
  { module: 'attendance', label: 'Attendance', description: 'Attendance tracking & reports' },
  { module: 'academics', label: 'Academics', description: 'Timetables, classes & curriculum' },
  { module: 'exams', label: 'Exams', description: 'Exam scheduling & results' },
  { module: 'fees', label: 'Fees', description: 'Fee collection & financials' },
  { module: 'hostel', label: 'Hostel', description: 'Hostel & dormitory management' },
  { module: 'notifications', label: 'Notifications', description: 'Send & manage notifications' },
  { module: 'parent', label: 'Parent Portal', description: 'Parent portal access' },
  { module: 'student', label: 'Student Portal', description: 'Student portal access' },
  { module: 'system', label: 'System Config', description: 'System configuration & user management' },
];

export function RoleManagementPage() {
  const [roles, setRoles] = useState<(SystemRole & { id: string })[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', key: '', description: '', permissions: [] as string[] });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await fetchAllRoles();
      setRoles(data);
    } catch (err) {
      console.error('Failed to load roles:', err);
      showToast('Failed to load roles', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectRole = (key: string) => {
    setSelectedRole(selectedRole === key ? null : key);
  };

  const handleTogglePermission = async (roleKey: string, module: string) => {
    const role = roles.find((r) => r.key === roleKey);
    if (!role) return;

    let newPermissions: string[];
    if (role.permissions.includes(module)) {
      // Don't allow removing 'dashboard' or removing if it's the only one left
      if (module === 'dashboard' && role.permissions.length === 1) return;
      newPermissions = role.permissions.filter((p) => p !== module);
    } else {
      newPermissions = [...role.permissions, module];
    }

    try {
      // Optimistic update
      setRoles((prev) =>
        prev.map((r) => (r.key === roleKey ? { ...r, permissions: newPermissions } : r))
      );
      await updateRolePermissions(roleKey, newPermissions);
      showToast(`Permission updated for ${role.name}`, 'success');
    } catch (err) {
      // Revert on error
      loadRoles();
      showToast('Failed to update permission', 'error');
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.key) return;
    setSaving(true);
    try {
      await createCustomRole({
        ...newRole,
        permissions: newRole.permissions.length > 0 ? newRole.permissions : ['dashboard'],
      });
      setShowAddModal(false);
      setNewRole({ name: '', key: '', description: '', permissions: [] });
      showToast(`Role "${newRole.name}" created`, 'success');
      loadRoles();
    } catch (err) {
      showToast('Failed to create role', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (roleKey: string) => {
    const role = roles.find((r) => r.key === roleKey);
    if (!role || role.isSystem) return;
    if (!confirm(`Delete role "${role.name}"? This cannot be undone.`)) return;

    try {
      await deleteRole(roleKey);
      setRoles((prev) => prev.filter((r) => r.key !== roleKey));
      if (selectedRole === roleKey) setSelectedRole(null);
      showToast(`Role "${role.name}" deleted`, 'success');
    } catch (err) {
      showToast('Failed to delete role', 'error');
    }
  };

  const selectedRoleData = roles.find((r) => r.key === selectedRole);

  const getRoleColor = (key: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-purple-600',
      school_admin: 'bg-blue-600',
      principal: 'bg-indigo-600',
      teacher: 'bg-green-600',
      accountant: 'bg-amber-600',
      hostel_warden: 'bg-orange-600',
      student: 'bg-cyan-600',
      parent: 'bg-pink-600',
    };
    return colors[key] || 'bg-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Role & Permission Management</h2>
            <p className="text-purple-100 mt-1">Define roles and configure granular permissions for each role</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors"
          >
            + Add Custom Role
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => {
          const isSelected = selectedRole === role.key;
          return (
            <button
              key={role.key}
              onClick={() => handleSelectRole(role.key)}
              className={`text-left bg-white rounded-2xl border-2 p-5 shadow-sm hover:shadow-md transition-all ${
                isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-bold ${getRoleColor(role.key)}`}>
                  {role.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{role.name}</p>
                  <p className="text-[10px] text-gray-400">{role.key.replace('_', ' ')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{role.description}</p>
              <div className="flex items-center gap-2 mt-3">
                {role.isSystem && (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full">System</span>
                )}
                <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-indigo-50 text-indigo-600 rounded-full">
                  {role.permissions.length} modules
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Permissions Panel */}
      {selectedRole && selectedRoleData && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Permissions: {selectedRoleData.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Toggle module access for this role</p>
            </div>
            {!selectedRoleData.isSystem && (
              <button
                onClick={() => handleDeleteRole(selectedRoleData.key)}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete Role
              </button>
            )}
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ALL_PERMISSIONS.map((perm) => {
                const isEnabled = selectedRoleData.permissions.includes(perm.module);
                const isOnlyDashboard = selectedRoleData.permissions.length === 1 && perm.module === 'dashboard';
                const canToggle = !isOnlyDashboard;

                return (
                  <label
                    key={perm.module}
                    onClick={() => canToggle && handleTogglePermission(selectedRoleData.key, perm.module)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                      isEnabled
                        ? 'border-indigo-200 bg-indigo-50/50'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    } ${!canToggle ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        readOnly
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{perm.label}</p>
                      <p className="text-xs text-gray-500">{perm.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Module Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Permission Matrix Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase">Module</th>
                {roles.map(role => (
                  <th key={role.key} className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-500 uppercase">{role.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ALL_PERMISSIONS.map((perm) => (
                <tr key={perm.module} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{perm.label}</td>
                  {roles.map((role) => {
                    const hasAccess = role.permissions.includes('all') || role.permissions.includes(perm.module);
                    return (
                      <td key={role.key} className="px-4 py-2.5 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          hasAccess ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-400'
                        }`}>
                          {hasAccess ? '✓' : '—'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Add Custom Role</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Role Name</label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Librarian"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Role Key</label>
                <input
                  type="text"
                  value={newRole.key}
                  onChange={(e) => setNewRole({ ...newRole, key: e.target.value.replace(/\s+/g, '_').toLowerCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., librarian"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <input
                  type="text"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief description of this role"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Initial Permissions</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label key={perm.module} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newRole.permissions.includes(perm.module)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRole({ ...newRole, permissions: [...newRole.permissions, perm.module] });
                          } else {
                            setNewRole({ ...newRole, permissions: newRole.permissions.filter((p) => p !== perm.module) });
                          }
                        }}
                        className="w-3.5 h-3.5 text-indigo-600 rounded border-gray-300"
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRole}
                  disabled={saving || !newRole.name || !newRole.key}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}