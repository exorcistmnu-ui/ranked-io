import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { isValidEmail, isValidPassword, isValidUsername } from '@/lib/utils'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!isValidUsername(username)) {
      setError('Username must be 3-20 characters (alphanumeric, underscore, hyphen only)')
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // Check if username exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .single()

      if (existingUser) {
        setError('Username already taken')
        setLoading(false)
        return
      }

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      // Sign up
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message || 'Failed to sign up')
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError('Failed to create account')
        setLoading(false)
        return
      }

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        username: username.toLowerCase(),
        email,
        avatar_url: null,
        rank: 'Bronze-3',
        points: 0,
        wins: 0,
        losses: 0,
        is_online: false,
      })

      if (profileError) {
        setError('Failed to create profile')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card bg-green-500/10 border-green-500/30 p-6 text-center space-y-3">
        <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto" />
        <div>
          <p className="font-semibold text-green-400">Account Created!</p>
          <p className="text-sm text-dark-muted mt-1">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="card bg-red-500/10 border-red-500/30 p-4 flex items-gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-accent-primary transition-colors duration-250"
            disabled={loading}
          />
          <p className="text-xs text-dark-muted mt-1">3-20 characters, alphanumeric only</p>
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-accent-primary transition-colors duration-250"
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-accent-primary transition-colors duration-250"
            disabled={loading}
          />
          <p className="text-xs text-dark-muted mt-1">At least 8 characters</p>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-accent-primary transition-colors duration-250"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dark-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-dark-bg text-dark-muted">or</span>
        </div>
      </div>

      {/* Sign In Link */}
      <p className="text-center text-dark-muted text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-primary hover:text-accent-hover font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
