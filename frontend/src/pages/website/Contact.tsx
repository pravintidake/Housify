import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import api from '../../services/api.ts'
import { toast } from 'sonner'

const Contact: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) {
      toast.error('Name, email, and phone are required.')
      return
    }
    setIsSubmitting(true)
    try {
      await api.post('/api/inquiries', {
        name,
        email,
        phone,
        message,
        source: 'Contact Page',
      })
      toast.success('Message sent successfully! We will get back to you shortly.')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Get in Touch</h1>
        <p className="text-sm text-slate-500 font-light max-w-lg mx-auto">
          Have questions about a property, need broker assistance, or want to list your development? We'd love to hear from you.
        </p>
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Office Info + Map */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="premium-card p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent/20 text-slate-900">
                <MapPin className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Office Address</h4>
              <p className="text-xs text-slate-500 font-light leading-relaxed">Baner Road, Pune<br />Maharashtra 411045, India</p>
            </div>
            <div className="premium-card p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-emerald-50 text-emerald-700">
                <Phone className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Phone</h4>
              <p className="text-xs text-slate-500 font-light">+91 20 6767 8900<br />+91 98765 43210</p>
            </div>
            <div className="premium-card p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-blue-50 text-blue-700">
                <Mail className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Email</h4>
              <p className="text-xs text-slate-500 font-light">support@housify.com<br />sales@housify.com</p>
            </div>
            <div className="premium-card p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-amber-50 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Office Hours</h4>
              <p className="text-xs text-slate-500 font-light">Mon – Fri: 9AM – 6PM<br />Sat: 10AM – 2PM</p>
            </div>
          </div>

          {/* Map Embed */}
          <div className="rounded-[18px] overflow-hidden border border-slate-100 shadow-sm h-64">
            <iframe
              title="Housify Office Location"
              src="https://www.google.com/maps?q=Baner%20Road%2C%20Pune%2C%20Maharashtra&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="premium-card p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>
            <p className="text-xs text-slate-400 font-light">Your message will be logged as an inquiry in our CRM and an agent will respond promptly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Sharma" className="premium-input w-full px-4 py-3 text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="priya@example.com" className="premium-input w-full px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone *</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="premium-input w-full px-4 py-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Tell us how we can help..." className="premium-input w-full px-4 py-3 text-sm resize-none" />
            </div>

            <button type="submit" disabled={isSubmitting} className="premium-btn-primary w-full py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
