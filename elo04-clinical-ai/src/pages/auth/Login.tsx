import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Shield,
} from 'lucide-react'

type Role = 'doctor' | 'patient' | 'admin'

interface LoginProps {
  onLogin: (role: Role) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('sarah.mitchell@medai.demo')
  const [password, setPassword] = useState('demo123')

  const login = () => {
    const value = email.toLowerCase()

    if (value.includes('admin')) {
      onLogin('admin')
    } else if (value.includes('patient')) {
      onLogin('patient')
    } else {
      onLogin('doctor')
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-gray-200">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
              <Activity className="h-8 w-8 text-cyan-400" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold text-white">
              MedAI Clinical Intelligence
            </h1>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-400">
              ELO-04 Multimodal Screening Platform
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-white/10 bg-[#0b1120] p-6 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Sign in
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Access your clinical intelligence workspace.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Email
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-500/50"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
                  placeholder="Enter password"
                />
              </div>

              <button
                onClick={login}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* DEMO ACCESS */}
            <div className="mt-7 border-t border-white/5 pt-6">
              <div className="mb-4 text-center">
                <p className="text-xs font-semibold text-white">
                  Demo Access
                </p>

                <p className="mt-1 text-[10px] text-gray-600">
                  Choose a role to enter the prototype instantly
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Doctor */}
                <button
                  type="button"
                  onClick={() => onLogin('doctor')}
                  className="group rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 transition hover:border-cyan-400/50 hover:bg-cyan-500/10"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                    <Stethoscope className="h-5 w-5 text-cyan-400" />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-white">
                    Doctor
                  </p>

                  <p className="mt-1 text-[9px] text-gray-600">
                    Clinical
                  </p>
                </button>

                {/* Patient */}
                <button
                  type="button"
                  onClick={() => onLogin('patient')}
                  className="group rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 transition hover:border-violet-400/50 hover:bg-violet-500/10"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                    <UserRound className="h-5 w-5 text-violet-400" />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-white">
                    Patient
                  </p>

                  <p className="mt-1 text-[9px] text-gray-600">
                    Health Portal
                  </p>
                </button>

                {/* Admin */}
                <button
                  type="button"
                  onClick={() => onLogin('admin')}
                  className="group rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 transition hover:border-amber-400/50 hover:bg-amber-500/10"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <Shield className="h-5 w-5 text-amber-400" />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-white">
                    Admin
                  </p>

                  <p className="mt-1 text-[9px] text-gray-600">
                    System Control
                  </p>
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/5 pt-5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />

              <span className="text-[10px] text-gray-600">
                Demo environment · Simulated clinical data
              </span>
            </div>
          </div>

          <p className="mt-5 text-center text-[10px] text-gray-700">
            ELO-04 · Multimodal AI Clinical Screening & Intelligence Platform
          </p>
        </div>
      </div>
    </div>
  )
}
