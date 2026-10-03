import { useState } from 'react'
import Login from './pages/auth/Login'
import DoctorLayout from './layouts/DoctorLayout'
import DoctorOverview from './pages/doctor/Overview'
import Patients from './pages/doctor/Patients'
import PatientProfile from './pages/doctor/PatientProfile'
import NewCase from './pages/doctor/NewCase'
import AIAnalysis from './pages/doctor/AIAnalysis'
import RAGEvidence from './pages/doctor/RAGEvidence'
import ClinicalReport from './pages/doctor/ClinicalReport'
import PatientDashboard from './pages/patient/PatientDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import { DemoProvider, useDemo } from './context/DemoContext'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ui/ToastContainer'
import ModelRouter from './components/ai/ModelRouter'
import Settings from './pages/doctor/Settings'
import type { Patient } from './types'

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
  return (
    <ToastProvider>
      <DemoProvider>
        <AppContent />
        <ToastContainer />
      </DemoProvider>
    </ToastProvider>
  )
}

function AppContent() {
  const [role, setRole] = useState<Role | null>(null)

  const [doctorPage, setDoctorPage] =
    useState<DoctorPage>('overview')

  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null)

  const [activeCaseId, setActiveCaseId] =
    useState<string | null>(null)

  const { createCase, approveCase, addAuditEvent } =
    useDemo()

  if (!role) {
    return <Login onLogin={setRole} />
  }

  const logout = () => {
    setRole(null)
    setDoctorPage('overview')
    setSelectedPatient(null)
    setActiveCaseId(null)
  }

  if (role === 'doctor') {
    return (
      <DoctorLayout
        currentPage={doctorPage}
        onNavigate={(page) => {
          setDoctorPage(page)

          if (
            page !== 'patients' &&
            page !== 'new-case' &&
            page !== 'ai-analysis' &&
            page !== 'rag' &&
            page !== 'reports'
          ) {
            setSelectedPatient(null)
          }
        }}
        onLogout={logout}
      >
        {doctorPage === 'overview' && (
          <DoctorOverview />
        )}

        {doctorPage === 'patients' && !selectedPatient && (
          <Patients
            onOpenPatient={(patient) => {
              setSelectedPatient(patient)

              addAuditEvent(
                'Patient Record',
                patient.id,
                'Accessed',
              )
            }}
          />
        )}

        {doctorPage === 'patients' && selectedPatient && (
          <PatientProfile
            patient={selectedPatient}
            onBack={() => {
              setSelectedPatient(null)
            }}
            onStartScreening={(patient) => {
              setSelectedPatient(patient)
              setDoctorPage('new-case')

              addAuditEvent(
                'Screening Started',
                patient.id,
                'Accessed',
              )
            }}
          />
        )}

        {doctorPage === 'new-case' && (
          <NewCase
            selectedPatient={selectedPatient}
            onBack={() => {
              setDoctorPage(
                selectedPatient
                  ? 'patients'
                  : 'overview',
              )
            }}
            onCaseCreated={(caseId) => {
              const generatedCase = createCase(
                selectedPatient?.id ?? 'PAT-1001',
                selectedPatient?.name ??
                  'James Anderson',
                ['X-Ray', 'Clinical Text'],
              )

              setActiveCaseId(
                generatedCase || caseId,
              )

              setDoctorPage('ai-analysis')
            }}
          />
        )}

        {doctorPage === 'ai-analysis' && (
          <div className="space-y-6">
            <AIAnalysis
              patient={selectedPatient}
              caseId={activeCaseId}
              onContinue={() => {
                if (activeCaseId) {
                  addAuditEvent(
                    'AI Analysis',
                    activeCaseId,
                    'Completed',
                  )
                }

                setDoctorPage('rag')
              }}
            />

            <ModelRouter running />
          </div>
        )}

        {doctorPage === 'rag' && (
          <RAGEvidence
            patient={selectedPatient}
            caseId={activeCaseId}
            onContinue={() => {
              if (activeCaseId) {
                addAuditEvent(
                  'RAG Retrieval',
                  activeCaseId,
                  'Completed',
                )
              }

              setDoctorPage('reports')
            }}
          />
        )}

        {doctorPage === 'reports' && (
          <ClinicalReport
            patient={selectedPatient}
            caseId={activeCaseId}
            onApproved={() => {
              if (activeCaseId) {
                approveCase(activeCaseId)
              }
            }}
          />
        )}

        {doctorPage === 'settings' && <Settings />}
      </DoctorLayout>
    )
  }

  if (role === 'patient') {
    return (
      <PatientDashboard
        onLogout={logout}
      />
    )
  }

  return (
    <AdminDashboard
      onLogout={logout}
    />
  )
}


export default App
