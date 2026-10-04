import { useState } from 'react'
import {
  Bell,
  CheckCircle2,
  Database,
  Lock,
  Save,
  Shield,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export default function Settings() {
  const { showToast } = useToast()

  const [settings, setSettings] = useState({
    notifications: true,
    highRiskAlerts: true,
    autoRag: true,
    autoLoadModels: true,
    auditLogging: true,
    compactMode: false,
  })

  const [threshold, setThreshold] = useState(85)

  const toggle = (key: keyof typeof settings) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const saveSettings = () => {
    localStorage.setItem(
      'elo04_doctor_settings',
      JSON.stringify({
        settings,
        threshold,
      }),
    )

    showToast(
      'Settings saved',
      'Aura workspace preferences were updated successfully.',
      'success',
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[#2563EB]">
          Workspace
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-[#172033]">
          Clinical Settings
        </h1>

        <p className="mt-1 text-sm text-[#526174]">
          Configure AI screening behavior, notifications, and
          workspace preferences.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <SettingsCard
            icon={SlidersHorizontal}
            title="AI Screening"
            description="Control how the clinical AI pipeline behaves."
          >
            <SettingToggle
              label="Automatic RAG retrieval"
              description="Retrieve relevant historical patient evidence after AI inference."
              enabled={settings.autoRag}
              onChange={() => toggle('autoRag')}
            />

            <SettingToggle
              label="Automatic model loading"
              description="Load required specialist models when a modality is detected."
              enabled={settings.autoLoadModels}
              onChange={() => toggle('autoLoadModels')}
            />

            <div className="border-t border-[#E2E8F0] pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#172033]">
                    Minimum confidence threshold
                  </p>

                  <p className="mt-1 text-xs text-[#526174]">
                    Findings below this level require additional review.
                  </p>
                </div>

                <span className="text-sm font-semibold text-[#2563EB]">
                  {threshold}%
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="99"
                value={threshold}
                onChange={(event) =>
                  setThreshold(Number(event.target.value))
                }
                className="mt-5 w-full accent-cyan-400"
              />
            </div>
          </SettingsCard>

          <SettingsCard
            icon={Bell}
            title="Notifications"
            description="Manage clinical alerts and system notifications."
          >
            <SettingToggle
              label="Workspace notifications"
              description="Receive updates for screening pipeline events."
              enabled={settings.notifications}
              onChange={() => toggle('notifications')}
            />

            <SettingToggle
              label="High-risk findings"
              description="Show immediate alerts for high-severity AI findings."
              enabled={settings.highRiskAlerts}
              onChange={() => toggle('highRiskAlerts')}
            />
          </SettingsCard>

          <SettingsCard
            icon={Shield}
            title="Security & Audit"
            description="Clinical traceability and access controls."
          >
            <SettingToggle
              label="Audit logging"
              description="Record clinical workflow actions in the audit timeline."
              enabled={settings.auditLogging}
              onChange={() => toggle('auditLogging')}
            />

            <SettingToggle
              label="Compact workspace"
              description="Reduce spacing across dense clinical tables and panels."
              enabled={settings.compactMode}
              onChange={() => toggle('compactMode')}
            />
          </SettingsCard>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#2563EB]/10 p-3">
                <UserRound className="h-5 w-5 text-[#2563EB]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#172033]">
                  Dr. Ajay Lad
                </p>

                <p className="text-xs text-[#526174]">
                  Clinical Specialist
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-xs">
              <InfoRow label="Role" value="Doctor" />
              <InfoRow label="Workspace" value="Clinical AI" />
              <InfoRow label="Access" value="Full Clinical" />
              <InfoRow label="Session" value="Authenticated" />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />

              <div>
                <p className="text-sm font-semibold text-[#172033]">
                  Clinical AI Online
                </p>

                <p className="mt-1 text-xs text-[#526174]">
                  All simulated services are operational.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-[#526174]" />

              <div>
                <p className="text-sm font-semibold text-[#172033]">
                  Demo Data
                </p>

                <p className="mt-1 text-xs leading-5 text-[#526174]">
                  Patient records, model outputs, evidence, and
                  audit events are simulated for the ELO-04 prototype.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={saveSettings}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#1D4ED8]"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs text-[#526174]">
            <Lock className="h-4 w-4 shrink-0" />
            Demo environment — no real patient data is stored.
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5">
      <div className="flex items-start gap-3 border-b border-[#E2E8F0] pb-5">
        <div className="rounded-xl bg-[#2563EB]/10 p-2.5">
          <Icon className="h-5 w-5 text-[#2563EB]" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#172033]">
            {title}
          </h2>

          <p className="mt-1 text-xs text-[#526174]">
            {description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {children}
      </div>
    </section>
  )
}

function SettingToggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description: string
  enabled: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div>
        <p className="text-sm font-medium text-[#334155]">
          {label}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#526174]">
          {description}
        </p>
      </div>

      <button
        onClick={onChange}
        aria-label={label}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? 'bg-[#2563EB]' : 'bg-gray-700'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex justify-between border-b border-[#E2E8F0] pb-3 last:border-0 last:pb-0">
      <span className="text-[#7B8794]">{label}</span>
      <span className="font-medium text-[#334155]">{value}</span>
    </div>
  )
}