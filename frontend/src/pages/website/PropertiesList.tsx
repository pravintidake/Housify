import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Grid3X3, List } from 'lucide-react'
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
  amenities: string[]
}

const PropertiesList: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [type, setType] = useState(searchParams.get('type') || 'ALL')
  const [city, setCity] = useState(searchParams.get('city') || 'ALL')
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'ALL')
  const [sort, setSort] = useState(searchParams.get('sort') || '')

  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (type !== 'ALL') params.type = type
      if (city !== 'ALL') params.city = city
      if (bedrooms !== 'ALL') params.bedrooms = bedrooms
      if (sort) params.sort = sort

      const res = await api.get('/api/properties', { params })
      setProperties(res.data)
    } catch (err) {
      console.error('Error fetching properties:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [type, city, bedrooms, sort])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProperties()
  }

  const formatPrice = (price: number, propType: string) => {
    const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
    return propType === 'RENTAL' ? `${formattedPrice}/month` : formattedPrice
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Explore Properties</h1>
        <p className="text-sm text-slate-500 font-light">Browse residential, commercial, rental properties and plots from verified brokers.</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="premium-card p-4 flex flex-col md:flex-row gap-3 items-stretch">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><Search className="h-4 w-4" /></span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, city, area..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-[12px] bg-slate-50 border border-slate-200 focus:outline-none focus:border-slate-300"
          />
        </form>

        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2.5 text-sm rounded-[12px] bg-slate-50 border border-slate-200 cursor-pointer focus:outline-none">
          <option value="ALL">All Types</option>
          <option value="RESIDENTIAL">Residential</option>
          <option value="COMMERCIAL">Commercial</option>
          <option value="RENTAL">Rental</option>
          <option value="PLOT">Plot</option>
        </select>

        <select value={city} onChange={(e) => setCity(e.target.value)} className="px-3 py-2.5 text-sm rounded-[12px] bg-slate-50 border border-slate-200 cursor-pointer focus:outline-none">
          <option value="ALL">All Cities</option>
          <option value="Pune">Pune</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Nashik">Nashik</option>
          <option value="Nagpur">Nagpur</option>
          <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
        </select>

        <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="px-3 py-2.5 text-sm rounded-[12px] bg-slate-50 border border-slate-200 cursor-pointer focus:outline-none">
          <option value="ALL">Any Beds</option>
          <option value="1">1 Bed</option>
          <option value="2">2 Beds</option>
          <option value="3">3 Beds</option>
          <option value="4">4+ Beds</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2.5 text-sm rounded-[12px] bg-slate-50 border border-slate-200 cursor-pointer focus:outline-none">
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="title_asc">Name: A → Z</option>
        </select>

        <div className="hidden md:flex items-center gap-1 border border-slate-200 rounded-[12px] p-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-[8px] cursor-pointer ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-[8px] cursor-pointer ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-500">
        Showing <span className="font-bold text-slate-800">{properties.length}</span> properties
      </div>

      {/* Property Grid / List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-accent-dark"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-400">No properties found matching your filters.</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((prop) => (
            <Link key={prop.id} to={`/properties/${prop.slug}`} className="premium-card overflow-hidden group block">
              <div className="relative h-52 overflow-hidden">
                <img src={prop.images[0]} alt={prop.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute left-3 top-3 text-[10px] uppercase font-bold bg-slate-900 text-white px-2 py-0.5 rounded-[6px]">{prop.type}</span>
                <span className="absolute right-3 top-3 text-[10px] uppercase font-bold bg-accent text-slate-900 px-2 py-0.5 rounded-[6px]">{prop.status}</span>
              </div>
              <div className="p-5 space-y-3">
                <span className="text-[10px] font-semibold text-slate-400">{prop.area}, {prop.city}</span>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{prop.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-light">
                  {prop.bedrooms > 0 && <span>{prop.bedrooms} Beds</span>}
                  {prop.bathrooms > 0 && <span>{prop.bathrooms} Baths</span>}
                  {prop.sqft > 0 && <span>{prop.sqft.toLocaleString('en-IN')} sq. ft.</span>}
                </div>
                <div className="pt-2 border-t border-slate-50">
                  <span className="text-base font-bold text-slate-900">{formatPrice(prop.price, prop.type)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((prop) => (
            <Link key={prop.id} to={`/properties/${prop.slug}`} className="premium-card flex overflow-hidden group block">
              <div className="w-64 h-44 shrink-0 overflow-hidden">
                <img src={prop.images[0]} alt={prop.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{prop.type}</span>
                    <span className="text-[10px] uppercase font-bold bg-accent/25 text-emerald-800 px-2 py-0.5 rounded">{prop.status}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{prop.title}</h3>
                  <p className="text-xs text-slate-400 font-light">{prop.area}, {prop.city}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-light">
                    {prop.bedrooms > 0 && <span>{prop.bedrooms} Beds</span>}
                    {prop.bathrooms > 0 && <span>{prop.bathrooms} Baths</span>}
                    {prop.sqft > 0 && <span>{prop.sqft.toLocaleString('en-IN')} sq. ft.</span>}
                  </div>
                  <span className="text-lg font-bold text-slate-900">{formatPrice(prop.price, prop.type)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertiesList
