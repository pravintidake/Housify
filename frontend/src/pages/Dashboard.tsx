import React, { useEffect, useState } from 'react'
import { Building2, Users2, UserCheck, Calendar, TrendingUp } from 'lucide-react'
import { useAppSelector } from '../store/index.ts'
import api from '../services/api.ts'

type DashboardData = { counts: { properties: number; projects: number; leads: number; customers: number }; recentLeads: any[]; tasks: any[] }

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => { api.get('/api/crm/dashboard').then(({ data }) => setData(data)).catch(console.error) }, [])
  const stats = [
    { name: 'Properties', value: data?.counts.properties ?? '–', icon: Building2 },
    { name: 'Leads', value: data?.counts.leads ?? '–', icon: Users2 },
    { name: 'Customers', value: data?.counts.customers ?? '–', icon: UserCheck },
    { name: 'Upcoming tasks', value: data?.tasks.filter(task => !task.completed).length ?? '–', icon: Calendar },
  ]

  return <div className="space-y-6">
    <div className="relative overflow-hidden rounded-[24px] bg-slate-900 p-8 text-white shadow-lg">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent opacity-10 blur-3xl" />
      <div className="relative z-10 space-y-2"><span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent"><TrendingUp className="h-3 w-3" /> Live CRM workspace</span><h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName || 'User'}!</h1><p className="max-w-md text-sm text-slate-400">Your dashboard shows the properties, enquiries and follow-ups available to your role.</p></div>
    </div>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{stats.map(stat => { const Icon = stat.icon; return <div key={stat.name} className="premium-card p-6"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-400">{stat.name}</span><Icon className="h-5 w-5 text-slate-600" /></div><p className="mt-4 text-2xl font-bold text-slate-950">{stat.value}</p></div> })}</div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2 premium-card p-6"><h2 className="border-b border-slate-100 pb-4 text-base font-bold text-slate-900">Recent enquiries</h2><div className="mt-3 space-y-3">{data?.recentLeads.length ? data.recentLeads.map(lead => <div key={lead.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><div><p className="text-sm font-semibold text-slate-800">{lead.name}</p><p className="text-xs text-slate-400">{lead.property?.title || 'General inquiry'} · {lead.phone}</p></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{lead.status}</span></div>) : <p className="py-6 text-sm text-slate-400">No leads are assigned to you yet.</p>}</div></section>
      <section className="premium-card p-6"><h2 className="border-b border-slate-100 pb-4 text-base font-bold text-slate-900">Upcoming tasks</h2><div className="mt-3 space-y-3">{data?.tasks.length ? data.tasks.map(task => <div key={task.id} className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-800">{task.title}</p><p className="mt-1 text-[10px] text-slate-500">{new Date(task.dueAt).toLocaleString('en-IN')} {task.lead?.name ? `· ${task.lead.name}` : ''}</p></div>) : <p className="py-6 text-sm text-slate-400">No upcoming tasks.</p>}</div></section>
    </div>
  </div>
}
export default Dashboard
