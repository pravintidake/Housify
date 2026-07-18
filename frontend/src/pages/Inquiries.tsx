import React, { useEffect, useState } from 'react'
import api from '../services/api'

const Inquiries: React.FC = () => {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => { api.get('/api/crm/inquiries').then(r => setItems(r.data)).catch(() => setItems([])) }, [])
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold text-slate-900">Website Inquiries</h1><p className="text-sm text-slate-500">Messages submitted through Contact Us and property enquiries.</p></div><div className="premium-card overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Contact</th><th className="p-4">Property</th><th className="p-4">Message</th><th className="p-4">Received</th></tr></thead><tbody>{items.map(i => <tr key={i.id} className="border-t border-slate-100"><td className="p-4"><div className="font-medium">{i.name}</div><div className="text-xs text-slate-500">{i.email} · {i.phone}</div></td><td className="p-4">{i.property?.title || 'General inquiry'}</td><td className="p-4 max-w-sm truncate">{i.message || '—'}</td><td className="p-4">{new Date(i.createdAt).toLocaleString('en-IN')}</td></tr>)}</tbody></table>{!items.length && <p className="p-6 text-sm text-slate-500">No inquiries found.</p>}</div></div>
}
export default Inquiries
