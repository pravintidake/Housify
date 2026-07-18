import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch } from '../../store/index.ts'
import { authStart, authSuccess, authFailure } from '../../store/slices/authSlice.ts'
import api from '../../services/api.ts'
import { KeyRound, Mail, User as UserIcon, Shield } from 'lucide-react'

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('AGENT')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !lastName || !email || !password) {
      toast.error('All fields are required.')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    dispatch(authStart())

    try {
      const response = await api.post('/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        role,
      })

      const { user, accessToken, refreshToken } = response.data
      dispatch(authSuccess({ user, accessToken, refreshToken }))
      toast.success(`Account created successfully! Welcome, ${user.firstName}!`)
      navigate('/dashboard')
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.'
      dispatch(authFailure(errMsg))
      toast.error(errMsg)
    } finally {
      setIsLoading(false)
    }
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-slate-700 hover:text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                First Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="first-name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="premium-input block w-full pl-10 pr-3 py-2.5 text-sm placeholder-slate-400 text-slate-900"
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <label htmlFor="last-name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="premium-input block w-full pl-10 pr-3 py-2.5 text-sm placeholder-slate-400 text-slate-900"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

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
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input block w-full pl-10 pr-3 py-2.5 text-sm placeholder-slate-400 text-slate-900"
                placeholder="john.doe@company.com"
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="premium-input block w-full pl-10 pr-3 py-2.5 text-sm placeholder-slate-400 text-slate-900"
                placeholder="•••••••• (Min 6 characters)"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Role Profile
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Shield className="h-4 w-4" />
              </div>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="premium-input block w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 bg-white cursor-pointer"
              >
                <option value="AGENT">Agent (Default)</option>
                <option value="SALES_EXECUTIVE">Sales Executive</option>
                <option value="SALES_MANAGER">Sales Manager</option>
                <option value="ADMIN">Administrator</option>
                <option value="SUPER_ADMIN">Super Administrator</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="premium-btn-primary flex w-full items-center justify-center py-3 text-sm font-semibold tracking-wide shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
