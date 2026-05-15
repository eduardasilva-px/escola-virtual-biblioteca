import IconBookOpen from './IconBookOpen'

export default function TopBar() {
  return (
    <header
      className="relative shrink-0 w-full h-[52px] z-[3]"
      style={{
        background: 'var(--background)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-2 size-full">
        {/* Left: breadcrumb / page title */}
        <div className="flex flex-1 min-w-0 gap-2 items-center">
          <div className="flex gap-2 items-center shrink-0">
            <IconBookOpen
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="text-[#080c10]"
            />
            <h1
              className="truncate text-[14px] font-medium leading-5"
              style={{ color: 'var(--foreground)' }}
            >
              Biblioteca
            </h1>
          </div>
        </div>

        {/* Right: reserved for actions (empty in this frame) */}
        <div className="flex-1 min-w-0 h-8" />
      </div>
    </header>
  )
}
