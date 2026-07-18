import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '../services/api.ts'
import { useAppSelector } from '../store/index.ts'

const roles = ['ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT']
const Users: React.FC = () => {
  const { user } = useAppSelector(state => state.auth)
  const [users, setUsers] = useState<any[]>([])
  const load = async () => { try { const { data } = await api.get('/api/crm/users'); setUsers(data) } catch { toast.error('Unable to load users.') } }
  useEffect(() => { void load() }, [])
  const add = async () => { const firstName = window.prompt('First name'); if (!firstName) return; const lastName = window.prompt('Last name') || ''; const email = window.prompt('Email address'); if (!email) return; const role = window.prompt(`Role: ${user?.role === 'SUPER_ADMIN' ? ['SUPER_ADMIN', ...roles].join(', ') : roles.join(', ')}`, 'AGENT') || 'AGENT'; try { await api.post('/api/crm/users', { firstName, lastName, email, role }); toast.success('User created with temporary password Welcome@123.'); load() } catch (error: any) { toast.error(error.response?.data?.message || 'Unable to add user.') } }
  const toggle = async (member: any) => { try { await api.put(`/api/crm/users/${member.id}`, { isActive: !member.isActive }); toast.success('User status updated.'); load() } catch (error: any) { toast.error(error.response?.data?.message || 'Unable to update user.') } }
  return <div className="space-y-6"><div className="flex items-start justify-between"><div><h1 className="text-2xl font-bold text-slate-900">Team & Users</h1><p className="mt-1 text-sm text-slate-500">Create users and manage their access. Admins can add sales roles; only Super Admin can create Admin accounts.</p></div><button onClick={add} className="premium-btn-primary px-4 py-2 text-sm">Add user</button></div><div className="premium-card overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{users.map(member => <tr key={member.id} className="border-b border-slate-50"><td className="p-4"><p className="font-semibold text-slate-800">{member.firstName} {member.lastName}</p><p className="text-xs text-slate-400">{member.email}</p></td><td className="p-4"><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{member.role.replace('_', ' ')}</span></td><td className="p-4 text-slate-600">{member.isActive ? 'Active' : 'Inactive'}</td><td className="p-4">{member.id !== user?.id && <button onClick={() => toggle(member)} className="text-xs font-semibold text-slate-700">{member.isActive ? 'Deactivate' : 'Activate'}</button>}</td></tr>)}{!users.length && <tr><td colSpan={4} className="p-10 text-center text-slate-400">No users found.</td></tr>}</tbody></table></div></div>
}
export default Users
