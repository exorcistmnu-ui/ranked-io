import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Ranked.io</h1>
          <p className="text-dark-muted">Competitive esports platform for EA Sports FC</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
