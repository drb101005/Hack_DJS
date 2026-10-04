import { useState } from 'react'
import {
  Activity,
  BrainCircuit,
  ChevronDown,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react'

type DoctorPage =
  | 'overview'
  | 'patients'
  | 'new-case'
  | 'ai-analysis'
  | 'rag'
  | 'reports'
  | 'settings'

interface DoctorLayoutProps {
  children: React.ReactNode
  currentPage: DoctorPage
  onNavigate: (page: DoctorPage) => void
  onLogout: () => void
}

const navigation: {
  section: string
  items: {
    id: DoctorPage
    label: string
    icon: typeof LayoutDashboard
  }[]
}[] = [
  {
    section: 'CLINICAL',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
      },
      {
        id: 'patients',
        label: 'Patients',
        icon: Users,
      },
      {
        id: 'new-case',
        label: 'New Case Screening',
        icon: ClipboardList,
      },
    ],
  },
  {
    section: 'AI INTELLIGENCE',
    items: [
      {
        id: 'ai-analysis',
        label: 'AI Analysis',
        icon: BrainCircuit,
      },
      {
        id: 'rag',
        label: 'RAG & Evidence',
        icon: ShieldCheck,
      },
      {
        id: 'reports',
        label: 'Clinical Reports',
        icon: FileText,
      },
    ],
  },
]

export default function DoctorLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: DoctorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#172033] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          h-screen
          bg-[#FFFFFF]
          border-r border-white/[0.07]
          flex flex-col
          transition-all duration-300
          ${sidebarOpen ? 'w-[260px]' : 'w-0 lg:w-[78px]'}
          overflow-hidden
        `}
      >
        <div className="h-[76px] px-5 flex items-center border-b border-white/[0.07] shrink-0">
          <div className="h-10 w-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
            <Activity size={21} className="text-[#2563EB]" />
          </div>

          {sidebarOpen && (
            <div className="ml-3 whitespace-nowrap">
              <p className="font-semibold text-[#172033] leading-tight">
                MedAI
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-[#2563EB]/70 mt-0.5">
                Clinical Intelligence
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          {navigation.map((group) => (
            <div key={group.section} className="mb-7">
              {sidebarOpen && (
                <p className="px-3 mb-3 text-[10px] font-semibold tracking-[0.18em] text-[#7B8794]">
                  {group.section}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = currentPage === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id)
                        setSidebarOpen(false)
                      }}
                      title={!sidebarOpen ? item.label : undefined}
                      className={`
                        w-full flex items-center gap-3
                        px-3 py-2.5
                        rounded-xl
                        text-sm
                        transition-all
                        ${
                          active
                            ? 'bg-cyan-400/10 text-[#2563EB] border border-cyan-400/10'
                            : 'text-[#526174] hover:text-[#334155] hover:bg-white/[0.04]'
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 ${
                          active ? 'text-[#2563EB]' : ''
                        }`}
                      />

                      {sidebarOpen && (
                        <span className="whitespace-nowrap">
                          {item.label}
                        </span>
                      )}

                      {active && sidebarOpen && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/[0.07]">
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#526174] hover:text-[#334155] hover:bg-white/[0.04] transition"
          >
            <Settings size={18} className="shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#526174] hover:text-[#DC2626] hover:bg-red-400/5 transition"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-[76px] border-b border-white/[0.07] bg-[#FFFFFF]/90 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-[#526174] hover:text-[#172033] hover:bg-white/5 transition"
            >
              {sidebarOpen ? (
                <X size={19} />
              ) : (
                <Menu size={19} />
              )}
            </button>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[#172033]">
                Clinical Workspace
              </p>

              <p className="text-xs text-[#7B8794]">
                ELO-04 Multimodal Screening Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-white/[0.08] text-[#7B8794] hover:text-[#334155] hover:bg-[#F8FAFC] transition"
            >
              <Search size={15} />

              <span className="text-xs">
                Search patients...
              </span>

              <span className="ml-4 text-[10px] border border-[#E2E8F0] rounded px-1.5 py-0.5">
                /
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-lg bg-[#16A34A]/5 border border-emerald-400/10">
              <div className="h-1.5 w-1.5 rounded-full bg-[#16A34A] animate-pulse" />

              <span className="text-xs text-[#16A34A]">
                AI Systems Online
              </span>
            </div>

            <button
              type="button"
              className="flex items-center gap-2.5 h-10 pl-2 pr-2 rounded-lg hover:bg-white/[0.04] transition"
            >
              <div className="h-8 w-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                <UserRound
                  size={16}
                  className="text-[#2563EB]"
                />
              </div>

              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-[#334155]">
                  Dr. Ajay Lad
                </p>

                <p className="text-[10px] text-[#7B8794]">
                  Clinical Specialist
                </p>
              </div>

              <ChevronDown
                size={14}
                className="text-[#7B8794] hidden md:block"
              />
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}