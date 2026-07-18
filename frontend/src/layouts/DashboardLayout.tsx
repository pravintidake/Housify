import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/index.ts'
import { logout } from '../store/slices/authSlice.ts'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Building2,
  Users2,
  UserCheck,
  Calendar,
  Video,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'

const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Successfully logged out.')
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT'] },
    { name: 'Properties', path: '/dashboard/properties', icon: Building2, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT'] },
    { name: 'Projects', path: '/dashboard/projects', icon: Building2, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'] },
    { name: 'Leads', path: '/dashboard/leads', icon: Users2, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT'] },
    { name: 'Inquiries', path: '/dashboard/inquiries', icon: ClipboardList, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'] },
    { name: 'Customers', path: '/dashboard/customers', icon: UserCheck, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT'] },
    { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT'] },
    { name: 'Meetings', path: '/dashboard/meetings', icon: Video, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT'] },
    { name: 'Follow Ups', path: '/dashboard/follow-ups', icon: ClipboardList, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT'] },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'] },
    { name: 'Team / Users', path: '/dashboard/users', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'] },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE', 'AGENT'] },
  ]

  // Filter routes based on user roles
  const allowedNavItems = navItems.filter(item => 
    !user || item.roles.includes(user.role)
  )

  const formatRole = (roleStr: string) => {
    return roleStr.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between border-r border-slate-100 bg-white px-4 py-6">
      <div className="space-y-6">
        {/* Logo Header */}
        <div className="flex items-center space-x-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent font-bold text-slate-900 shadow-sm">
            H
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Housify
          </span>
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-[6px]">
            v1.0
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {allowedNavItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center space-x-3 rounded-[12px] px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-50 text-slate-900 border-l-3 border-accent-dark'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-colors duration-200 ${
                  isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'
                }`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Session Info Card */}
      {user && (
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between rounded-[14px] bg-slate-50 p-3 border border-slate-100">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-sm">
                {user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {formatRole(user.role)}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-[8px] transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Desktop Sidebar (Left-anchored) */}
      <aside className="hidden w-64 md:block shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header Panel */}
        <header className="flex h-16 items-center justify-between border-b border-slate-100 px-6 bg-white/70 backdrop-blur-md">
          {/* Mobile Menu Trigger & Search */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Quick Search */}
            <div className="relative hidden sm:block">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search properties, leads..."
                className="w-64 rounded-[12px] border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs focus:border-slate-300 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Quick Action Button */}
            <button className="hidden sm:inline-flex premium-btn-primary px-3 py-1.5 text-xs tracking-wider cursor-pointer">
              + Quick Add
            </button>

            {/* Notifications */}
            <button className="relative rounded-[12px] p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors border border-slate-100 cursor-pointer">
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-dark opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-dark"></span>
              </span>
              <Bell className="h-4 w-4" />
            </button>

            {/* Profile Menu Trigger */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 rounded-[12px] p-1 pr-2 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                    {user.firstName[0].toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-[14px] bg-white p-1.5 shadow-xl border border-slate-100 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-slate-400">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false)
                        navigate('/dashboard/settings')
                      }}
                      className="flex w-full items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-[10px] text-left cursor-pointer"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false)
                        handleLogout()
                      }}
                      className="flex w-full items-center space-x-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-[10px] text-left cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Panel Content Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative flex w-full max-w-xs flex-col bg-white">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
