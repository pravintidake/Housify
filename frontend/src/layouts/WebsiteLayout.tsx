import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, Mail, Phone, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'

const WebsiteLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) return
    toast.success('Thank you for subscribing to our newsletter!')
    setNewsletterEmail('')
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent font-bold text-slate-900 shadow-md">
              H
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Housify
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-semibold tracking-wide transition-all ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Header Action Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="premium-btn-secondary px-5 py-2 text-sm tracking-wide">
              Agent Portal
            </Link>
            <Link to="/contact" className="premium-btn-primary px-5 py-2 text-sm tracking-wide shadow-md">
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative w-full max-w-xs bg-white px-6 py-8 shadow-xl flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent font-bold text-slate-900">
                    H
                  </span>
                  <span className="text-xl font-bold tracking-tight text-slate-900">Housify</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-base font-semibold py-2 border-b border-slate-50 ${
                        isActive ? 'text-slate-900 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="space-y-4">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="premium-btn-secondary block w-full py-3 text-center text-sm font-semibold"
              >
                Agent Portal
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="premium-btn-primary block w-full py-3 text-center text-sm font-semibold"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Outlet Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-slate-100 bg-[#F8FAFC] py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo & Intro */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent font-bold text-slate-900 shadow-sm text-sm">
                H
              </span>
              <span className="text-lg font-bold text-slate-900">Housify</span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Housify connects property buyers, sellers and brokers across Maharashtra with a trusted, modern real estate experience.
            </p>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>+91 20 6767 8900</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>support@housify.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Baner Road, Pune, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-light">
              <li><Link to="/properties" className="hover:text-slate-900 transition-colors">Find Properties</Link></li>
              <li><Link to="/projects" className="hover:text-slate-900 transition-colors">Development Projects</Link></li>
              <li><Link to="/about" className="hover:text-slate-900 transition-colors">Our History / About</Link></li>
              <li><Link to="/blog" className="hover:text-slate-900 transition-colors">Real Estate Blog</Link></li>
            </ul>
          </div>

          {/* Terms & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">Company & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-500 font-light">
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Investor Relations</Link></li>
              <li><Link to="#" className="hover:text-slate-900 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">Newsletter</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Subscribe to get the latest luxury property listings and industry news.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="email@company.com"
                className="premium-input bg-white px-3.5 py-2 text-xs flex-1 focus:outline-none"
              />
              <button
                type="submit"
                className="premium-btn-primary p-2 flex.5 flex items-center justify-center cursor-pointer shadow-sm"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto max-w-7xl border-t border-slate-200/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400">
          <p>© 2026 Housify Technologies Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 font-light">
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">Twitter</a>
            <a href="#" className="hover:underline">LinkedIn</a>
            <a href="#" className="hover:underline">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default WebsiteLayout
