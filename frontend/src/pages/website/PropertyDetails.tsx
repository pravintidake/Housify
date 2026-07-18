import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Maximize, Phone, Send, ChevronLeft, Check } from 'lucide-react'
import api from '../../services/api.ts'
import { toast } from 'sonner'

interface Property {
  id: string
  title: string
  slug: string
  description: string
  price: number
  type: string
  status: string
  address: string
  city: string
  area: string
  bedrooms: number
  bathrooms: number
  sqft: number
  images: string[]
  amenities: string[]
  ownerName: string | null
  ownerPhone: string | null
  brokerName: string | null
  brokerPhone: string | null
  googleMapsUrl: string | null
}

const PropertyDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  // Inquiry form state
  const [inquiryName, setInquiryName] = useState('')
  const [inquiryEmail, setInquiryEmail] = useState('')
  const [inquiryPhone, setInquiryPhone] = useState('')
  const [inquiryBudget, setInquiryBudget] = useState('')
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [inquiryDate, setInquiryDate] = useState('')
  const [inquiryTime, setInquiryTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true)
      try {
        const res = await api.get(`/api/properties/${slug}`)
        setProperty(res.data)
      } catch (err) {
        console.error('Error fetching property:', err)
        toast.error('Property not found')
      } finally {
        setIsLoading(false)
      }
    }
    if (slug) fetchProperty()
  }, [slug])

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inquiryName || !inquiryEmail || !inquiryPhone) {
      toast.error('Name, email, and phone are required.')
      return
    }
    setIsSubmitting(true)
    try {
      await api.post('/api/inquiries', {
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        budget: inquiryBudget || null,
        message: inquiryMessage,
        preferredDate: inquiryDate,
        preferredTime: inquiryTime,
        source: 'Website',
        propertyId: property?.id,
      })
      toast.success('Inquiry submitted successfully! An agent will contact you soon.')
      setInquiryName('')
      setInquiryEmail('')
      setInquiryPhone('')
      setInquiryBudget('')
      setInquiryMessage('')
      setInquiryDate('')
      setInquiryTime('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit inquiry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number, type: string) => {
    const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
    return type === 'RENTAL' ? `${formattedPrice}/month` : formattedPrice
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-accent-dark"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
        <p className="text-sm text-slate-500">The listing you're looking for doesn't exist or has been removed.</p>
        <Link to="/properties" className="premium-btn-primary inline-block px-6 py-2.5 text-sm mt-4">Browse Properties</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/properties" className="hover:text-slate-700 flex items-center gap-1">
          <ChevronLeft className="h-3 w-3" /> Properties
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{property.title}</span>
      </div>

      {/* Image Gallery */}
      <div className="space-y-3">
        <div className="relative h-[420px] rounded-[24px] overflow-hidden shadow-lg">
          <img src={property.images[activeImage] || ''} alt={property.title} className="h-full w-full object-cover" />
          <span className="absolute left-4 top-4 text-[10px] uppercase font-bold bg-slate-900 text-white px-3 py-1 rounded-[8px]">{property.type}</span>
          <span className="absolute right-4 top-4 text-[10px] uppercase font-bold bg-accent text-slate-900 px-3 py-1 rounded-[8px]">{property.status}</span>
        </div>
        {property.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`shrink-0 h-20 w-28 rounded-[12px] overflow-hidden border-2 cursor-pointer transition-all ${activeImage === idx ? 'border-accent ring-2 ring-accent/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Grid: Details + Sticky Inquiry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Property Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Price */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{property.title}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{property.address}, {property.area}, {property.city}</span>
            </div>
            <span className="inline-block text-2xl font-bold text-slate-900">{formatPrice(property.price, property.type)}</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {property.bedrooms > 0 && (
              <div className="premium-card p-4 text-center space-y-1">
                <Bed className="h-5 w-5 mx-auto text-slate-400" />
                <p className="text-sm font-bold text-slate-800">{property.bedrooms}</p>
                <p className="text-[10px] text-slate-400">Bedrooms</p>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="premium-card p-4 text-center space-y-1">
                <Bath className="h-5 w-5 mx-auto text-slate-400" />
                <p className="text-sm font-bold text-slate-800">{property.bathrooms}</p>
                <p className="text-[10px] text-slate-400">Bathrooms</p>
              </div>
            )}
            {property.sqft > 0 && (
              <div className="premium-card p-4 text-center space-y-1">
                <Maximize className="h-5 w-5 mx-auto text-slate-400" />
                <p className="text-sm font-bold text-slate-800">{property.sqft.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">sq. ft.</p>
              </div>
            )}
            <div className="premium-card p-4 text-center space-y-1">
              <span className="text-lg mx-auto">🏷️</span>
              <p className="text-sm font-bold text-slate-800">{property.type}</p>
              <p className="text-[10px] text-slate-400">Category</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About This Property</h2>
            <p className="text-sm text-slate-600 font-light leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Amenities & Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-[12px] px-4 py-2.5 border border-slate-100">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent / Broker */}
          {(property.brokerName || property.ownerName) && (
            <div className="premium-card p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Agent Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.brokerName && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                      {property.brokerName[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{property.brokerName}</p>
                      <p className="text-[10px] text-slate-400">Broker • {property.brokerPhone}</p>
                    </div>
                  </div>
                )}
                {property.ownerName && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm">
                      {property.ownerName[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{property.ownerName}</p>
                      <p className="text-[10px] text-slate-400">Owner • {property.ownerPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Sticky Inquiry Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 premium-card p-6 space-y-5">
            <div className="text-center space-y-1 border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Interested in this property?</h3>
              <p className="text-[10px] text-slate-400">Fill out the form and an agent will reach out to you.</p>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-3">
              <input type="text" required value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} placeholder="Full Name *" className="premium-input w-full px-4 py-2.5 text-xs" />
              <input type="tel" required value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)} placeholder="Mobile Number *" className="premium-input w-full px-4 py-2.5 text-xs" />
              <input type="email" required value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} placeholder="Email Address *" className="premium-input w-full px-4 py-2.5 text-xs" />
              <input type="text" value={inquiryBudget} onChange={(e) => setInquiryBudget(e.target.value)} placeholder="Budget in ₹ (optional)" className="premium-input w-full px-4 py-2.5 text-xs" />
              <textarea value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} placeholder="Message (optional)" rows={3} className="premium-input w-full px-4 py-2.5 text-xs resize-none" />

              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={inquiryDate} onChange={(e) => setInquiryDate(e.target.value)} className="premium-input px-3 py-2.5 text-xs" />
                <input type="time" value={inquiryTime} onChange={(e) => setInquiryTime(e.target.value)} className="premium-input px-3 py-2.5 text-xs" />
              </div>

              <button type="submit" disabled={isSubmitting} className="premium-btn-primary w-full py-3 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Inquiry
                  </>
                )}
              </button>
            </form>

            <div className="text-center space-y-2 pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400">Or contact directly:</p>
              {property.brokerPhone && (
                <a href={`tel:${property.brokerPhone}`} className="premium-btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> Call Broker
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
