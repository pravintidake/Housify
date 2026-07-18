import React, { useEffect, useState } from 'react'
import api from '../services/api'

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const load = async () => { try { setProjects((await api.get('/api/crm/projects')).data) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const add = async () => {
    const title = window.prompt('Project title')
    if (!title) return
    const location = window.prompt('Location', 'Pune, Maharashtra') || ''
    await api.post('/api/crm/projects', { title, location, description: '', status: 'UPCOMING' }); load()
  }
  const remove = async (id: string) => { if (window.confirm('Delete this project?')) { await api.delete(`/api/crm/projects/${id}`); load() } }
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-slate-900">Projects</h1><p className="text-sm text-slate-500">Manage the projects shown on the public website.</p></div><button onClick={add} className="premium-btn-primary px-4 py-2 text-sm">+ Add Project</button></div><div className="premium-card overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Project</th><th className="p-4">Location</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{loading ? <tr><td className="p-4" colSpan={4}>Loading…</td></tr> : projects.map(p => <tr key={p.id} className="border-t border-slate-100"><td className="p-4 font-medium">{p.title}</td><td className="p-4">{p.location}</td><td className="p-4">{p.status}</td><td className="p-4"><button onClick={() => remove(p.id)} className="text-red-600">Delete</button></td></tr>)}</tbody></table></div></div>
}
export default Projects
