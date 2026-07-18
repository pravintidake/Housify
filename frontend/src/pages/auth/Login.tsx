import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch } from '../../store/index.ts'
import { authStart, authSuccess, authFailure } from '../../store/slices/authSlice.ts'
import api from '../../services/api.ts'
import { KeyRound, Mail, Sparkles } from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    dispatch(authStart())

    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { user, accessToken, refreshToken } = response.data

      dispatch(authSuccess({ user, accessToken, refreshToken }))
      toast.success(`Welcome back, ${user.firstName}!`)
      navigate('/dashboard')
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.'
      dispatch(authFailure(errMsg))
      toast.error(errMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail('admin@housify.com')
    setPassword('AdminPassword123')
    toast.success('Demo credentials loaded!')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md space-y-8 rounded-[24px] bg-white p-8 shadow-2xl border border-slate-100 transition-all duration-300">
        
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent opacity-20 blur-2xl"></div>

        <div>
          <div className="flex items-center justify-center space-x-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent font-bold text-slate-900 shadow-md">
              H
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Housify
            </span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Sign in to your CRM
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Or{' '}
            <Link to="/register" className="font-semibold text-slate-700 hover:text-slate-900 hover:underline">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="premium-input block w-full pl-10 pr-3 py-3 text-sm placeholder-slate-400 text-slate-900"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input block w-full pl-10 pr-3 py-3 text-sm placeholder-slate-400 text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="premium-btn-primary flex w-full items-center justify-center py-3 text-sm font-semibold tracking-wide shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials Box */}
        <div className="rounded-[18px] bg-slate-50 p-4 border border-slate-100 flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
            <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span>Need Demo Account?</span>
          </div>
          <p className="text-xs text-slate-500">
            Try with default Super Admin credentials to test the dashboard.
          </p>
          <button
            onClick={fillDemoCredentials}
            type="button"
            className="text-left w-full text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-[10px] p-2 transition-all flex justify-between items-center"
          >
            <div>
              <span className="font-semibold block text-slate-800">Email: admin@housify.com</span>
              <span className="block text-slate-500">Pass: AdminPassword123</span>
            </div>
            <span className="text-[10px] uppercase font-bold bg-accent px-1.5 py-0.5 rounded text-slate-900">
              Autofill
            </span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default Login
