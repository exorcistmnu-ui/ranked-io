import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { supabase } from '@/lib/supabase'
import { getRankFromPoints, getProgressToNextRank } from '@/lib/ranking'
import { formatNumber, calculateWinRate } from '@/lib/utils'
import { Zap, Trophy, TrendingUp, Users } from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { profile, setProfile } = useProfileStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error: err } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (err) throw err

        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, setProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent-primary animate-spin mx-auto mb-4" />
          <p className="text-dark-text">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-dark-bg p-6 flex items-center justify-center">
        <div className="card text-center">
          <p className="text-accent-primary font-semibold mb-2">Error</p>
          <p className="text-dark-muted">{error || 'Failed to load profile'}</p>
        </div>
      </div>
    )
  }

  const rankInfo = getRankFromPoints(profile.points)
  const progressInfo = getProgressToNextRank(profile.points)
  const winRate = calculateWinRate(profile.wins, profile.losses)

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">Welcome back, {profile.username}</h1>
            <p className="text-dark-muted mt-1">Ready to climb the ranks?</p>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rank Card */}
          <div className="card border-accent-primary/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-dark-muted text-sm mb-1">Current Rank</p>
                <p className="text-3xl font-bold text-gradient">{rankInfo.displayName}</p>
              </div>
              <Trophy className="w-8 h-8 text-accent-primary" />
            </div>
            <div className="text-dark-muted text-sm">{formatNumber(profile.points)} points</div>
          </div>

          {/* Points Progress Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-dark-muted text-sm mb-1">Progress</p>
                <p className="text-2xl font-bold text-dark-text">{Math.round(progressInfo.progress)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent-primary" />
            </div>
            <div className="w-full bg-dark-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-accent-primary h-full transition-all duration-500"
                style={{ width: `${progressInfo.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Win Rate Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-dark-muted text-sm mb-1">Win Rate</p>
                <p className="text-3xl font-bold text-dark-text">{winRate}%</p>
              </div>
              <Zap className="w-8 h-8 text-accent-primary" />
            </div>
            <p className="text-dark-muted text-sm">{profile.wins}W - {profile.losses}L</p>
          </div>

          {/* Total Matches Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-dark-muted text-sm mb-1">Total Matches</p>
                <p className="text-3xl font-bold text-dark-text">{profile.wins + profile.losses}</p>
              </div>
              <Users className="w-8 h-8 text-accent-primary" />
            </div>
            <p className="text-dark-muted text-sm">Competitive matches played</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <button className="btn-primary h-20 flex flex-col items-center justify-center rounded-xl">
            <Zap className="w-6 h-6 mb-2" />
            <span className="text-sm">Find Ranked</span>
          </button>
          <button className="btn-secondary h-20 flex flex-col items-center justify-center rounded-xl">
            <Users className="w-6 h-6 mb-2" />
            <span className="text-sm">Private Match</span>
          </button>
          <button className="btn-secondary h-20 flex flex-col items-center justify-center rounded-xl">
            <Trophy className="w-6 h-6 mb-2" />
            <span className="text-sm">Tournaments</span>
          </button>
          <button className="btn-secondary h-20 flex flex-col items-center justify-center rounded-xl">
            <TrendingUp className="w-6 h-6 mb-2" />
            <span className="text-sm">Leaderboard</span>
          </button>
          <button className="btn-secondary h-20 flex flex-col items-center justify-center rounded-xl">
            <Users className="w-6 h-6 mb-2" />
            <span className="text-sm">Find Players</span>
          </button>
        </div>

        {/* Recent Matches Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card">
            <h2 className="text-xl font-bold text-dark-text mb-4">Recent Matches</h2>
            <div className="text-center py-8 text-dark-muted">
              <p>No matches yet. Play your first ranked match to get started!</p>
            </div>
          </div>

          {/* Notifications Placeholder */}
          <div className="card">
            <h2 className="text-xl font-bold text-dark-text mb-4">Notifications</h2>
            <div className="text-center py-8 text-dark-muted">
              <p>No new notifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
