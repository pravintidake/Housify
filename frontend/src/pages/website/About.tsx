import React from 'react'
import { Target, Eye, Award, Users, Building2, Shield } from 'lucide-react'

const About: React.FC = () => {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Banner */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-6">
        <span className="inline-flex items-center space-x-1.5 rounded-full bg-accent/25 px-4 py-1.5 text-xs font-semibold text-emerald-800">
          <Award className="h-3.5 w-3.5" />
          <span>About Our Company</span>
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Transforming Real Estate Management
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-500 leading-relaxed font-light">
          Housify is a Maharashtra-focused real estate CRM and customer portal that brings property discovery, lead conversion and sales tracking into one integrated platform.
        </p>
      </section>

      {/* Image + Story */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-[24px] overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
            alt="Housify Office"
            className="w-full h-80 object-cover"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Our Story</h2>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            Founded in 2020, Housify was born from the realization that the real estate industry lacked a unified solution for managing the complete sales lifecycle. Our founders — a team of enterprise software architects and experienced real estate brokers — set out to build a platform that bridges the gap between property discovery, customer engagement, and deal closure.
          </p>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            Today, Housify supports property transactions across Pune, Mumbai, Nashik, Nagpur and Chhatrapati Sambhajinagar, serving brokers, developers and homebuyers with practical technology.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="premium-card p-8 space-y-4 bg-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-accent/20 text-slate-900">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              To empower real estate professionals with intelligent CRM tools that simplify property management, accelerate lead conversion, and deliver exceptional customer experiences — all while maintaining complete transparency and trust.
            </p>
          </div>
          <div className="premium-card p-8 space-y-4 bg-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-emerald-50 text-emerald-700">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              To become the most trusted and widely adopted real estate technology platform — where every property transaction is seamless, data-driven, and customer-centric, from the first inquiry to the final handshake.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Properties Listed', value: '12,000+' },
            { label: 'Happy Customers', value: '8,500+' },
            { label: 'Cities Covered', value: '45+' },
            { label: 'Deals Closed', value: '₹1,900 Cr+' },
          ].map((stat, idx) => (
            <div key={idx} className="premium-card p-6 space-y-1">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-[11px] text-slate-400 font-light">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why Choose Housify</h2>
          <p className="text-sm text-slate-500 font-light max-w-md mx-auto">Built for brokers, designed for customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Building2, title: 'Verified Listings', desc: 'Every property is broker-verified with real images, accurate pricing, and up-to-date availability status.' },
            { icon: Users, title: 'Dedicated Agents', desc: 'Each inquiry is routed to a trained sales agent who manages the entire lifecycle from first call to closing.' },
            { icon: Shield, title: 'Secure & Transparent', desc: 'Enterprise-grade security with JWT authentication, role-based access, and full audit trail on every transaction.' },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="premium-card p-6 space-y-4 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-[14px] bg-accent/15 text-slate-900">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default About
