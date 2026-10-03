import { useState } from 'react'
import Login from './pages/auth/Login'
import DoctorLayout from './layouts/DoctorLayout'
import DoctorOverview from './pages/doctor/Overview'
import Patients from './pages/doctor/Patients'

type Role = 'doctor' | 'patient' | 'admin'

type DoctorPage =
  | 'overview'
  | 'patients'
  | 'new-case'
  | 'ai-analysis'
  | 'rag'
  | 'reports'
  | 'settings'

function App() {
  const [role, setRole] = useState<Role | null>(null)
  const [doctorPage, setDoctorPage] = useState<DoctorPage>('overview')

  // Show login page when no user is logged in
  if (!role) {
    return <Login onLogin={setRole} />
  }

  // Doctor portal
  if (role === 'doctor') {
    return (
      <DoctorLayout
        currentPage={doctorPage}
        onNavigate={setDoctorPage}
        onLogout={() => {
          setRole(null)
          setDoctorPage('overview')
        }}
      >
        {doctorPage === 'overview' && (
          <DoctorOverview />
        )}

        {doctorPage === 'patients' && (
          <Patients
            onOpenPatient={(patient) => {
              console.log('Selected patient:', patient)
            }}
          />
        )}

        {doctorPage !== 'overview' &&
          doctorPage !== 'patients' && (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-3">
                  Module
                </p>

                <h1 className="text-2xl font-semibold text-white">
                  {doctorPage === 'new-case' && 'New Case Screening'}
                  {doctorPage === 'ai-analysis' && 'AI Analysis'}
                  {doctorPage === 'rag' && 'RAG & Evidence'}
                  {doctorPage === 'reports' && 'Clinical Reports'}
                  {doctorPage === 'settings' && 'Settings'}
                </h1>

                <p className="text-sm text-gray-500 mt-2">
                  This module will be implemented next.
                </p>
              </div>
            </div>
          )}
      </DoctorLayout>
    )
  }

  // Patient/Admin portal placeholder
  return (
    <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] mb-3">
          {role} portal
        </p>

        <h1 className="text-3xl font-semibold">
          Coming next
        </h1>

        <p className="text-gray-500 mt-2">
          This role will be built after the Doctor platform.
        </p>

        <button
          type="button"
          onClick={() => {
            setRole(null)
            setDoctorPage('overview')
          }}
          className="mt-6 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default App


