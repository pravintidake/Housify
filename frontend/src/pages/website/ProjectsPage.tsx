import React, { useState, useEffect } from 'react'
import api from '../../services/api.ts'

interface Project {
  id: string
  title: string
  description: string
  status: string
  location: string
  image: string
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.get('/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error('Error fetching projects:', err))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredProjects = filter === 'ALL'
    ? projects
    : projects.filter(p => p.status === filter)

  const statusColor = (s: string) => {
    if (s === 'ONGOING') return 'bg-blue-50 text-blue-700 border-blue-100'
    if (s === 'UPCOMING') return 'bg-amber-50 text-amber-700 border-amber-100'
    return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Development Projects</h1>
        <p className="text-sm text-slate-500 font-light">Explore ongoing, upcoming, and completed real estate developments.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['ALL', 'ONGOING', 'UPCOMING', 'COMPLETED'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs font-semibold rounded-[12px] border cursor-pointer transition-all ${filter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
          >
            {s === 'ALL' ? 'All Projects' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-accent-dark"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-400">No projects found for this filter.</div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(proj => (
            <div key={proj.id} className="premium-card overflow-hidden group">
              <div className="h-52 overflow-hidden">
                <img src={proj.image} alt={proj.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-6 space-y-3">
                <span className={`inline-flex text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${statusColor(proj.status)}`}>
                  {proj.status}
                </span>
                <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-3">{proj.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-slate-50">
                  <span>📍</span>
                  <span>{proj.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectsPage
