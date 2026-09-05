import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div>
          <p className="text-6xl font-bold text-gradient mb-2">404</p>
          <h1 className="text-2xl font-bold text-dark-text">Page Not Found</h1>
          <p className="text-dark-muted mt-2">The page you're looking for doesn't exist.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
