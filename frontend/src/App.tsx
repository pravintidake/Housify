import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login.tsx'
import Register from './pages/auth/Register.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import DashboardLayout from './layouts/DashboardLayout.tsx'
import WebsiteLayout from './layouts/WebsiteLayout.tsx'

// Dashboard Pages (kept as direct imports for admin CRM)
import Dashboard from './pages/Dashboard.tsx'
import Properties from './pages/Properties.tsx'
import Leads from './pages/Leads.tsx'
import Customers from './pages/Customers.tsx'
import CalendarPage from './pages/CalendarPage.tsx'
import Meetings from './pages/Meetings.tsx'
import FollowUps from './pages/FollowUps.tsx'
import Analytics from './pages/Analytics.tsx'
import Users from './pages/Users.tsx'
import Settings from './pages/Settings.tsx'
import Projects from './pages/Projects.tsx'
import Inquiries from './pages/Inquiries.tsx'

// Website Pages (lazy-loaded for performance)
const Home = lazy(() => import('./pages/website/Home.tsx'))
const PropertiesList = lazy(() => import('./pages/website/PropertiesList.tsx'))
const PropertyDetails = lazy(() => import('./pages/website/PropertyDetails.tsx'))
const ProjectsPage = lazy(() => import('./pages/website/ProjectsPage.tsx'))
const About = lazy(() => import('./pages/website/About.tsx'))
const Contact = lazy(() => import('./pages/website/Contact.tsx'))
const Blog = lazy(() => import('./pages/website/Blog.tsx'))

const PageLoader = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-accent-dark"></div>
      <p className="text-xs text-slate-400 font-light">Loading page...</p>
    </div>
  </div>
)

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ========================================== */}
          {/* Public Customer Website Routes             */}
          {/* ========================================== */}
          <Route element={<WebsiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertiesList />} />
            <Route path="/properties/:slug" element={<PropertyDetails />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
          </Route>

          {/* ========================================== */}
          {/* Protected Admin CRM Dashboard Routes       */}
          {/* ========================================== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/properties" element={<Properties />} />
              <Route path="/dashboard/projects" element={<Projects />} />
              <Route path="/dashboard/leads" element={<Leads />} />
              <Route path="/dashboard/inquiries" element={<Inquiries />} />
              <Route path="/dashboard/customers" element={<Customers />} />
              <Route path="/dashboard/calendar" element={<CalendarPage />} />
              <Route path="/dashboard/meetings" element={<Meetings />} />
              <Route path="/dashboard/follow-ups" element={<FollowUps />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Role Protected Admin/Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/users" element={<Users />} />
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
