import { useState } from 'react'
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react'

interface LoginProps {
  onLogin: (role: 'doctor' | 'patient' | 'admin') => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('sarah.mitchell@medai.demo')
  const [password, setPassword] = useState('demo123')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (email.includes('admin')) {
      onLogin('admin')
    } else if (email.includes('patient')) {
      onLogin('patient')
    } else {
      onLogin('doctor')
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center px-6 relative overflow-hidden">
      
      <div className="absolute inset-0">
        <div className="absolute top-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/20 mb-5">
            <Activity className="text-cyan-400" size={28} />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            MedAI Intelligence
          </h1>

          <p className="text-gray-400 mt-2">
            Multimodal Clinical Screening Platform
          </p>
        </div>

        <div className="bg-[#0d1320] border border-white/10 rounded-2xl p-7 shadow-2xl">
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Welcome back
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Sign in to access the clinical intelligence platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-[#080d17] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-[#080d17] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 transition"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl py-3 transition"
            >
              Sign In
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={15} className="text-cyan-400" />
              Demo environment — clinical data is simulated
            </div>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-gray-600">
          ELO-04 Clinical AI Prototype
        </div>
      </div>
    </div>
  )
}
