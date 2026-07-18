import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Building, Landmark, Compass, Key, Sparkles, Star, ArrowRight } from 'lucide-react'
import api from '../../services/api.ts'

interface Property {
  id: string
  title: string
  slug: string
  price: number
  type: string
  status: string
  city: string
  area: string
  bedrooms: number
  bathrooms: number
  sqft: number
  images: string[]
}

interface Project {
  id: string
  title: string
  description: string
  status: string
  location: string
  image: string
}

const Home: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('ALL')
  const [searchCity, setSearchCity] = useState('ALL')
  
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch properties
    api.get('/api/properties')
      .then(res => {
        setFeaturedProperties(res.data.slice(0, 3)) // Take top 3 for featured section
      })
      .catch(err => {
        console.error('Error fetching featured properties:', err)
      })

    // Fetch projects
    api.get('/api/projects')
      .then(res => {
        setProjects(res.data.slice(0, 3))
      })
      .catch(err => {
        console.error('Error fetching projects:', err)
      })
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let url = `/properties?search=${encodeURIComponent(searchQuery)}`
    if (searchType !== 'ALL') url += `&type=${searchType}`
    if (searchCity !== 'ALL') url += `&city=${searchCity}`
    navigate(url)
  }

  const formatPrice = (price: number, type: string) => {
    if (type === 'RENTAL') {
      return `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)}/month`
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
  }

  const categories = [
    { name: 'Residential', type: 'RESIDENTIAL', icon: Building, desc: 'Homes, apartments, villas' },
    { name: 'Commercial', type: 'COMMERCIAL', icon: Landmark, desc: 'Offices, shops, warehouse spaces' },
    { name: 'Rentals', type: 'RENTAL', icon: Key, desc: 'Apartments and villas for lease' },
    { name: 'Plots / Land', type: 'PLOT', icon: Compass, desc: 'Ready residential/commercial plots' },
  ]

  const faqs = [
    { q: 'How do I schedule a physical site visit?', a: 'You can navigate to any property listing page, and use the right-side inquiry panel to submit your preferred date and time. An agent will contact you shortly to confirm.' },
    { q: 'What is the role of an agent in the CRM?', a: 'Agents assist with document verification, site tours, price negotiations, and complete all documentation until the booking is closed.' },
    { q: 'Can I request a virtual tour?', a: 'Yes! Select the "Schedule Virtual Tour" option in the property details panel, specify your details, and we will send you a secure meeting link.' }
  ]

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative bg-slate-50 py-24 md:py-32 px-6 lg:px-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-emerald-300 opacity-15 blur-3xl"></div>

        <div className="mx-auto max-w-5xl text-center space-y-8 relative z-10">
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-accent/25 px-4 py-1.5 text-xs font-semibold text-emerald-800 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover Maharashtra's Premium Properties</span>
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl font-sans">
            Find Your Dream Space with <span className="underline decoration-accent decoration-wavy">Housify</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-500 leading-relaxed font-light">
            Find verified homes, commercial spaces, rentals and plots across Maharashtra. Send an inquiry and arrange a site visit with a local property expert.
          </p>

          {/* Premium Search Box */}
          <form onSubmit={handleSearchSubmit} className="mx-auto max-w-4xl rounded-[24px] bg-white p-4 shadow-xl border border-slate-100/80 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, area, title..."
                className="w-full pl-10 pr-4 py-3.5 text-sm rounded-[14px] bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-300"
              />
            </div>

            <div className="w-full md:w-48">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-4 py-3.5 text-sm rounded-[14px] bg-slate-50 border border-slate-200 text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="RENTAL">Rental</option>
                <option value="PLOT">Plot</option>
              </select>
            </div>

            <div className="w-full md:w-48">
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full px-4 py-3.5 text-sm rounded-[14px] bg-slate-50 border border-slate-200 text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Cities</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nashik">Nashik</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
              </select>
            </div>

            <button type="submit" className="premium-btn-primary px-8 py-3.5 text-sm cursor-pointer shadow-lg">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* 2. Property Categories */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Browse by Category</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto font-light">Explore properties mapped by investment portfolio types.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.name}
                to={`/properties?type=${cat.type}`}
                className="premium-card p-6 flex flex-col items-center text-center space-y-4 hover:border-slate-300 transition-all duration-300"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-accent/20 text-slate-900 border border-accent/10">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{cat.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-light leading-relaxed">{cat.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 3. Featured Properties Grid */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Listings</h2>
            <p className="text-sm text-slate-500 font-light">Handpicked luxury residences and spaces from our top brokers.</p>
          </div>
          <Link to="/properties" className="mt-4 sm:mt-0 inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900">
            <span>View all properties</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.length > 0 ? (
            featuredProperties.map((prop) => (
              <div key={prop.id} className="premium-card overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 text-[10px] uppercase font-bold bg-slate-900 text-white px-2.5 py-1 rounded-[6px]">
                    {prop.type}
                  </span>
                  <span className="absolute right-4 top-4 text-[10px] uppercase font-bold bg-accent text-slate-900 px-2.5 py-1 rounded-[6px] shadow-sm">
                    {prop.status}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">{prop.area}, {prop.city}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                      <Link to={`/properties/${prop.slug}`}>{prop.title}</Link>
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-y border-slate-50 py-3 font-light">
                    {prop.bedrooms > 0 && <span>{prop.bedrooms} Beds</span>}
                    {prop.bathrooms > 0 && <span>{prop.bathrooms} Baths</span>}
                    {prop.sqft > 0 && <span>{prop.sqft.toLocaleString('en-IN')} sq. ft.</span>}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-bold text-slate-900">{formatPrice(prop.price, prop.type)}</span>
                    <Link to={`/properties/${prop.slug}`} className="text-xs font-semibold text-slate-700 hover:underline">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-sm text-slate-400">
              No featured properties found. Run DB Seed script to populate listings.
            </div>
          )}
        </div>
      </section>

      {/* 4. Latest Projects Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">New Construction Projects</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto font-light">Explore premium townships, residential towers and commercial developments across Maharashtra.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((proj) => (
            <div key={proj.id} className="premium-card overflow-hidden flex flex-col justify-between">
              <div>
                <img src={proj.image} alt={proj.title} className="h-48 w-full object-cover" />
                <div className="p-6 space-y-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
                    {proj.status}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{proj.title}</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-3">{proj.description}</p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 mt-4">
                <span>📍 {proj.location}</span>
                <Link to="/projects" className="text-xs font-semibold text-slate-800 hover:underline">Explore</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="bg-slate-50 py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Complete Sales Lifecycle Integration under One Hood
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              Unlike traditional portals, Housify is built directly on top of an enterprise-grade Lead Management CRM. When you submit inquiries, schedules or requests:
            </p>
            <ul className="space-y-3">
              {[
                'Your inquiries instantly populate into our agent CRM dashboard',
                'Your scheduled site visits automatically hook into broker calendars',
                'Deduplication algorithms verify matching mobile contacts',
                'Activity log tracks every step from virtual tours to negotiations'
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3 text-xs text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-slate-900 font-bold">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-video w-full rounded-[24px] overflow-hidden shadow-2xl border border-white">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                alt="CRM Panel demo"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Float Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-[18px] shadow-xl border border-slate-100 flex items-center space-x-3 max-w-xs">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
                ★
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-800">5-Star Integration</h4>
                <p className="text-[10px] text-slate-400">Website and CRM seamlessly synced</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">What Our Clients Say</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto font-light">Trusted by thousands of apartment buyers, land investors, and corporate firms.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { name: 'Ananya Kulkarni', role: 'Homebuyer, Pune', text: 'Scheduling a site visit was effortless. The agent confirmed my preferred time quickly and helped us shortlist the right apartment.' },
            { name: 'Rohan Mehta', role: 'Commercial Investor, Mumbai', text: 'The commercial listings were clear and the documentation process was well coordinated from inquiry to final agreement.' },
            { name: 'Vikram Patil', role: 'Plot Owner, Nashik', text: 'My plot received qualified inquiries directly through the portal, making it easier for the sales team to follow up.' }
          ].map((test, index) => (
            <div key={index} className="premium-card p-6 space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed italic">"{test.text}"</p>
              <div className="border-t border-slate-50 pt-3">
                <h4 className="text-xs font-bold text-slate-800">{test.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQs */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 font-light">Everything you need to know about Housify portal procedures.</p>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="premium-card p-5 space-y-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <span className="text-emerald-600">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home
