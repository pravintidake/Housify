import React from 'react'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    id: '1',
    slug: 'how-to-choose-your-first-investment-property',
    title: 'How to Choose Your First Investment Property in Maharashtra',
    excerpt: 'A practical guide for first-time investors covering location analysis, rental yield, home loans and registration costs.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    date: 'July 15, 2026',
    readTime: '8 min read',
    category: 'Investment',
  },
  {
    id: '2',
    slug: 'top-5-amenities-luxury-homebuyers-demand',
    title: 'Top 5 Amenities Luxury Homebuyers Demand in 2026',
    excerpt: 'From infinity pools to smart home integration — discover what high-net-worth buyers expect from premium residential listings.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    date: 'July 10, 2026',
    readTime: '5 min read',
    category: 'Lifestyle',
  },
  {
    id: '3',
    slug: 'understanding-real-estate-crm-systems',
    title: 'Understanding Real Estate CRM Systems',
    excerpt: 'How modern CRM platforms like Housify streamline lead management, automate follow-ups, and help agents close deals faster.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    date: 'July 5, 2026',
    readTime: '6 min read',
    category: 'Technology',
  },
]

const Blog: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Real Estate Insights</h1>
        <p className="text-sm text-slate-500 font-light max-w-lg mx-auto">
          Stay ahead with expert analysis, market trends, and practical guides from the Housify team.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map(post => (
          <article key={post.id} className="premium-card overflow-hidden group">
            <div className="h-52 overflow-hidden">
              <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {post.category}
              </span>
              <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-800 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-3">{post.excerpt}</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer">
                  Read More <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center py-8 premium-card p-8">
        <h3 className="text-base font-bold text-slate-900 mb-2">More Articles Coming Soon</h3>
        <p className="text-xs text-slate-500 font-light max-w-md mx-auto">
          The blog module will be fully integrated with a CMS backend in a future phase. Stay tuned for market reports, investment tips, and platform updates.
        </p>
      </div>
    </div>
  )
}

export default Blog
