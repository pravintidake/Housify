import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '../services/api.ts'
import { useAppSelector } from '../store/index.ts'

const statuses = ['New Inquiry', 'Contacted', 'Site Visit', 'Negotiation', 'Converted', 'Lost']
const Leads: React.FC = () => {
  const { user } = useAppSelector(state => state.auth)
  const [leads, setLeads] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])
  const privileged = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'].includes(user?.role || '')
  const load = async () => { try { const { data } = await api.get('/api/crm/leads'); setLeads(data) } catch { toast.error('Unable to load leads.') } if (privileged) { try { const { data } = await api.get('/api/crm/users'); setTeam(data) } catch {} } }
  useEffect(() => { void load() }, [])
  const update = async (id: string, payload: object) => { try { await api.put(`/api/crm/leads/${id}`, payload); load(); toast.success('Lead updated.'); } catch (error: any) { toast.error(error.response?.data?.message || 'Unable to update lead.'); } }
  const convert = async (id: string) => { try { await api.post(`/api/crm/leads/${id}/convert`, {}); toast.success('Lead converted to a customer.'); load(); } catch (error: any) { toast.error(error.response?.data?.message || 'Unable to convert lead.'); } }
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold text-slate-900">Leads Pipeline</h1><p className="mt-1 text-sm text-slate-500">Website enquiries appear here automatically. Update their progress and assign work to the appropriate agent.</p></div><div className="premium-card overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500"><tr><th className="p-4">Lead</th><th className="p-4">Property</th><th className="p-4">Source</th><th className="p-4">Status</th><th className="p-4">Assigned to</th><th className="p-4">Actions</th></tr></thead><tbody>{leads.map(lead => <tr key={lead.id} className="border-b border-slate-50"><td className="p-4"><p className="font-semibold text-slate-800">{lead.name}</p><p className="text-xs text-slate-400">{lead.phone} · {lead.email}</p></td><td className="p-4 text-slate-600">{lead.property?.title || 'General enquiry'}</td><td className="p-4 text-slate-500">{lead.source}</td><td className="p-4"><select value={lead.status} onChange={e => update(lead.id, { status: e.target.value })} className="rounded-lg border border-slate-200 bg-white p-2 text-xs">{statuses.map(status => <option key={status}>{status}</option>)}</select></td><td className="p-4">{privileged ? <select value={lead.assignedAgentId || ''} onChange={e => update(lead.id, { assignedAgentId: e.target.value })} className="rounded-lg border border-slate-200 bg-white p-2 text-xs"><option value="">Unassigned</option>{team.map(member => <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>)}</select> : <span className="text-slate-500">{lead.assignedAgent ? `${lead.assignedAgent.firstName} ${lead.assignedAgent.lastName}` : 'Unassigned'}</span>}</td><td className="p-4"><button disabled={lead.status === 'Converted'} onClick={() => convert(lead.id)} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">Convert</button></td></tr>)}{!leads.length && <tr><td colSpan={6} className="p-10 text-center text-slate-400">No leads are available for your account.</td></tr>}</tbody></table></div></div>
}
export default Leads
