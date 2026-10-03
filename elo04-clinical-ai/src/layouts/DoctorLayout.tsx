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
    <div className="min-h-screen bg-[#070b14] text-white flex">
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
          bg-[#0a101c]
          border-r border-white/[0.07]
          flex flex-col
          transition-all duration-300
          ${sidebarOpen ? 'w-[260px]' : 'w-0 lg:w-[78px]'}
          overflow-hidden
        `}
      >
        {/* Brand */}
        <div className="h-[76px] px-5 flex items-center border-b border-white/[0.07] shrink-0">
          <div className="h-10 w-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
            <Activity size={21} className="text-cyan-400" />
          </div>

          {sidebarOpen && (
            <div className="ml-3 whitespace-nowrap">
              <p className="font-semibold text-white leading-tight">
                MedAI
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-400/70 mt-0.5">
                Clinical Intelligence
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          {navigation.map((group) => (
            <div key={group.section} className="mb-7">
              {sidebarOpen && (
                <p className="px-3 mb-3 text-[10px] font-semibold tracking-[0.18em] text-gray-600">
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
                            ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/10'
                            : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 ${
                          active ? 'text-cyan-400' : ''
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

        {/* Bottom navigation */}
        <div className="p-3 border-t border-white/[0.07]">
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition"
          >
            <Settings size={18} className="shrink-0" />

            {sidebarOpen && <span>Settings</span>}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-300 hover:bg-red-400/5 transition"
          >
            <LogOut size={18} className="shrink-0" />

            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main application */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="h-[76px] border-b border-white/[0.07] bg-[#080d17]/90 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              {sidebarOpen ? (
                <X size={19} />
              ) : (
                <Menu size={19} />
              )}
            </button>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">
                Clinical Workspace
              </p>

              <p className="text-xs text-gray-600">
                ELO-04 Multimodal Screening Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-white/[0.08] text-gray-600 hover:text-gray-300 hover:bg-white/[0.03] transition"
            >
              <Search size={15} />

              <span className="text-xs">
                Search patients...
              </span>

              <span className="ml-4 text-[10px] border border-white/10 rounded px-1.5 py-0.5">
                /
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-lg bg-emerald-400/5 border border-emerald-400/10">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-xs text-emerald-400">
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
                  className="text-cyan-400"
                />
              </div>

              <div className="hidden md:block text-left">
                <p className="text-xs font-medium text-gray-200">
                  Dr. Sarah Mitchell
                </p>

                <p className="text-[10px] text-gray-600">
                  Clinical Specialist
                </p>
              </div>

              <ChevronDown
                size={14}
                className="text-gray-600 hidden md:block"
              />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
