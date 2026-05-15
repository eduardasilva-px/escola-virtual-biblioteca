import { Ruler } from 'lucide-react'

/**
 * FloatingButton — the "Ferramentas" pill fixed at the bottom-right of
 * the main content container.  Uses the dark radial-gradient background
 * and the floating shadow from the Figma frame.
 */
export default function FloatingButton() {
  return (
    <button
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[200px] overflow-clip"
      style={{
        background:
          'radial-gradient(ellipse at 50% 50%, #1c2858 0%, #151d40 50%, #0d1228 100%)',
        boxShadow:
          '0px 1px 1px 0px rgba(0,0,0,0.2), 0px 4px 8px -2px rgba(27,42,74,0.4)',
      }}
      aria-label="Ferramentas"
    >
      <Ruler
        size={16}
        strokeWidth={1.75}
        aria-hidden="true"
        className="shrink-0 text-white"
      />
      <span className="text-[12px] font-medium leading-none text-white whitespace-nowrap">
        Ferramentas
      </span>
    </button>
  )
}
