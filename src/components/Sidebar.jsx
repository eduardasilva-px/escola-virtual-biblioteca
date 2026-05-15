import {
  Home,
  ClipboardList,
  BookMarked,
  Users,
  Shapes,
  Folders,
  BookA,
  Store,
  Bell,
  ChevronDown,
} from 'lucide-react'
import EscolaVirtualLogo from './EscolaVirtualLogo'
import IconBiblioteca from './IconBiblioteca'
import IconEvia from './IconEvia'

const NAV_MAIN = [
  { icon: Home,           label: 'Meu Espaço',  active: false },
  { icon: IconBiblioteca, label: 'Biblioteca',  active: true  },
  { icon: ClipboardList, label: 'Avaliação',   active: false },
  { icon: BookMarked,    label: 'Disciplinas', active: false },
  { icon: Users,         label: 'Turmas',      active: false },
]

const NAV_EXPLORE = [
  { icon: Shapes,   label: 'Recursos'    },
  { icon: Folders,  label: 'Projetos'    },
  { icon: BookA,    label: 'Dicionários' },
  { icon: IconEvia,  label: 'EVIA'        },
]

const NAV_BOTTOM = [
  { icon: Store, label: 'Loja'          },
  { icon: Bell,  label: 'Notificações'  },
]

function SidebarItem({ icon: Icon, label, active = false }) {
  return (
    <button
      className={[
        'relative flex w-full items-center gap-2 rounded-md px-2 py-2 h-8 text-left',
        'transition-colors duration-150',
        active
          ? 'bg-[#151d40] text-white'
          : 'text-white/90 hover:bg-white/10',
      ].join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      {/* Left-edge active indicator */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-[-12px] top-0 w-[3px] h-8 rounded-r-full bg-[#EF4444]"
        />
      )}
      <Icon
        size={16}
        strokeWidth={active ? 2 : 1.75}
        aria-hidden="true"
        className="shrink-0"
      />
      <span
        className={[
          'flex-1 min-w-0 truncate leading-none',
          active
            ? 'text-[12px] font-medium'
            : 'text-[14px] font-normal',
        ].join(' ')}
      >
        {label}
      </span>
    </button>
  )
}

export default function Sidebar() {
  return (
    <aside
      className="relative flex flex-col shrink-0 w-[194px] h-full p-3 z-10"
      style={{ background: 'var(--sidebar)' }}
      aria-label="Navegação principal"
    >
      {/* ── Main content (grows to fill) ── */}
      <div className="flex flex-col flex-1 gap-4 min-h-0">
        {/* Logo */}
        <div className="flex flex-col gap-0 py-2 shrink-0">
          <EscolaVirtualLogo />
        </div>

        {/* Nav + Explore section */}
        <div className="flex flex-col flex-1 gap-6 min-h-0">
          {/* Primary navigation */}
          <nav aria-label="Menu principal">
            <ul className="flex flex-col gap-1 list-none">
              {NAV_MAIN.map((item) => (
                <li key={item.label}>
                  <SidebarItem {...item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Explore section */}
          <div className="flex flex-col shrink-0">
            {/* Section header */}
            <div className="flex h-8 items-center justify-between px-2 rounded-md w-[170px]">
              <span className="flex-1 min-w-0 truncate text-[12px] font-semibold leading-4 text-[#cccccc] uppercase tracking-wide">
                Explorar
              </span>
            </div>
            <nav aria-label="Explorar">
              <ul className="flex flex-col gap-1 list-none">
                {NAV_EXPLORE.map((item) => (
                  <li key={item.label}>
                    <SidebarItem {...item} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* ── Bottom content ── */}
      <div className="flex flex-col gap-2 shrink-0">
        <nav aria-label="Menu secundário">
          <ul className="flex flex-col gap-1 list-none">
            {NAV_BOTTOM.map((item) => (
              <li key={item.label}>
                <SidebarItem {...item} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Separator */}
        <hr className="border-t border-[#3a4688]" />

        {/* User profile */}
        <button className="flex w-full items-center gap-2 px-2 py-2 rounded-md hover:bg-white/10 transition-colors duration-150">
          {/* Avatar */}
          <div
            className="shrink-0 size-8 rounded-full overflow-hidden flex items-center justify-center relative"
            style={{ background: '#eff6ff' }}
            aria-hidden="true"
          >
            {/* Decorative bg tilt */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                background: 'linear-gradient(135deg, #3a4688 0%, transparent 70%)',
                transform: 'rotate(-15deg) scale(1.5)',
              }}
            />
            <span className="relative text-[14px] font-normal leading-5 text-[#172554]">
              CR
            </span>
          </div>

          {/* Name */}
          <div className="flex flex-col flex-1 min-w-0 gap-0.5 justify-center">
            <p className="truncate text-[12px] font-medium leading-none text-white">
              Carolina Reis
            </p>
          </div>

          {/* Chevron */}
          <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-white/70" />
        </button>
      </div>
    </aside>
  )
}
