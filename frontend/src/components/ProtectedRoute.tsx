import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/index.ts'

interface ProtectedRouteProps {
  allowedRoles?: Array<'SUPER_ADMIN' | 'ADMIN' | 'SALES_MANAGER' | 'SALES_EXECUTIVE' | 'AGENT'>
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-accent-dark"></div>
          <p className="text-sm font-medium text-slate-500">Securing session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-white px-6 text-center">
        <div className="max-w-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 font-sans tracking-tight">Access Restricted</h1>
          <p className="mt-2 text-slate-500 text-sm">
            You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="premium-btn-secondary px-6 py-2.5 text-sm cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <Outlet />
}

export default ProtectedRoute
