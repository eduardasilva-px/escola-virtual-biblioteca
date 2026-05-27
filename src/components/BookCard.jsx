import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Pin, MoreVertical, Trash2 } from 'lucide-react'

/**
 * BookCard
 *
 * Props:
 *  - cover       {string}  image src
 *  - title       {string}
 *  - grade       {string}  e.g. "11°ano"
 *  - pinned      {boolean} filled orange pin vs outline
 *  - width       {number}  card width in px (fixed for pinned row; omit for grid)
 *  - onPinToggle {fn}      called when pin button clicked
 *  - onRemove    {fn}      called when "Remover" is selected in the dropdown
 *
 * The cover image renders at its NATURAL aspect ratio — no fixed height —
 * so books of different proportions display correctly. The grid/flex
 * container should use `items-end` so cards bottom-align.
 */
export default function BookCard({
  cover,
  title,
  grade,
  pinned = false,
  width,
  disciplines,
  onPinToggle,
  onRemove,
}) {
  const [menuOpen, setMenuOpen]         = useState(false)
  const [menuPos,  setMenuPos]          = useState({ top: 0, left: 0 })
  const menuButtonRef                   = useRef(null)
  const menuPanelRef                    = useRef(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPos, setTooltipPos]     = useState({ top: 0, left: 0 })
  const titleRef                        = useRef(null)

  function showTooltip() {
    if (!titleRef.current) return
    const rect = titleRef.current.getBoundingClientRect()
    setTooltipPos({ top: rect.top, left: rect.left + rect.width / 2 })
    setTooltipVisible(true)
  }

  function hideTooltip() {
    setTooltipVisible(false)
  }

  function openMenu() {
    const rect = menuButtonRef.current.getBoundingClientRect()
    // Right-align the 112px panel with the button's right edge
    setMenuPos({ top: rect.bottom + 6, left: rect.right - 112 })
    setMenuOpen(true)
  }

  function handleMenuButtonClick() {
    menuOpen ? setMenuOpen(false) : openMenu()
  }

  /* Close on Escape or click outside */
  useEffect(() => {
    if (!menuOpen) return
    function onKey(e) { if (e.key === 'Escape') setMenuOpen(false) }
    function onPointer(e) {
      if (
        menuButtonRef.current?.contains(e.target) ||
        menuPanelRef.current?.contains(e.target)
      ) return
      setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [menuOpen])

  return (
    <article
      className="relative flex flex-col gap-2 items-start shrink-0 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] cursor-pointer hover:z-[25]"
      style={width ? { width } : undefined}
    >
      {/* ── Cover image container — height driven by natural image dimensions ── */}
      <div
        className="relative rounded-[4px] w-full group transition-transform duration-200 ease-out hover:-translate-y-1.5"
        style={{ boxShadow: 'var(--shadow-card-cover)' }}
      >
        {/* Natural-ratio cover — block + w-full so the div sizes to the image */}
        <img
          src={cover}
          alt={`Capa do livro ${title}`}
          className="block w-full h-auto rounded-[4px]"
          draggable={false}
        />

        {/* Spine gloss overlay — inset-0 tracks the image via the relative container */}
        <div
          className="absolute inset-0 rounded-[4px] pointer-events-none"
          style={{
            background:
              'linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 91.5%, rgba(0,0,0,0.1) 94.1%, rgba(255,255,255,0.16) 94.5%, rgba(0,0,0,0.06) 95.3%, rgba(0,0,0,0.04) 97.4%, rgba(255,255,255,0) 100%)',
          }}
        />

        {/* Hover highlight */}
        <div className="absolute inset-0 rounded-[4px] pointer-events-none bg-white/0 group-hover:bg-white/15 transition-colors duration-200" />

        {/* ── Action buttons ── */}
        {/* Pin — top-right */}
        <button
          aria-label={pinned ? 'Desafixar livro' : 'Fixar livro'}
          onClick={onPinToggle}
          className={[
            'absolute top-1 right-1',
            'flex items-center justify-center p-1.5 rounded-full w-7 h-7',
            'backdrop-blur-[6px] shadow-[0px_1px_3px_0px_rgba(8,13,22,0.2)]',
            'transition-[background-color,opacity] duration-150',
            pinned ? 'bg-white/90 hover:bg-white' : 'bg-white/80 hover:bg-white',
          ].join(' ')}
        >
          <Pin
            size={14}
            className={pinned ? 'text-orange-500 fill-orange-500' : 'text-[#535353]'}
            strokeWidth={1.5}
            style={{ transform: 'rotate(30deg)' }}
            aria-hidden="true"
          />
        </button>

        {/* Three-dot menu — 4 px below the pin button */}
        <button
          ref={menuButtonRef}
          aria-label="Mais opções"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={handleMenuButtonClick}
          className={[
            'absolute top-9 right-1 flex items-center justify-center p-1.5 rounded-full w-7 h-7',
            'backdrop-blur-[6px] bg-white/80 hover:bg-white shadow-[0px_1px_3px_0px_rgba(8,13,22,0.2)]',
            'transition-[background-color,opacity] duration-150',
          ].join(' ')}
        >
          <MoreVertical size={14} className="text-[#535353]" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      {/* ── Metadata ── */}
      <div className="flex flex-col gap-0.5 w-full">
        <p
          ref={disciplines ? titleRef : null}
          className="text-[13px] font-medium leading-[18px] truncate"
          style={{ color: 'var(--foreground)', cursor: disciplines ? 'default' : undefined }}
          title={title}
          onMouseEnter={disciplines ? showTooltip : undefined}
          onMouseLeave={disciplines ? hideTooltip : undefined}
        >
          {title}
        </p>
        <p
          className="text-[12px] font-normal leading-4 truncate"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {grade}
        </p>
      </div>

      {/* ── Disciplines tooltip portal ── */}
      {tooltipVisible && disciplines && createPortal(
        <div
          style={{
            position: 'fixed',
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: 'translateX(-50%) translateY(calc(-100% - 6px))',
            zIndex: 600,
            pointerEvents: 'none',
          }}
        >
          {/* Tooltip box */}
          <div
            style={{
              background: '#2a2a29',
              borderRadius: 8,
              padding: '6px 12px',
              color: 'white',
              fontSize: 12,
              lineHeight: '16px',
              textAlign: 'center',
              maxWidth: 220,
              whiteSpace: 'normal',
              fontFamily: 'var(--font-default)',
            }}
          >
            {disciplines.join(', ')}
          </div>
          {/* Downward arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 10,
              height: 10,
              background: '#2a2a29',
            }}
          />
        </div>,
        document.body,
      )}

      {/* ── Dropdown portal ── */}
      {menuOpen && createPortal(
        <div
          ref={menuPanelRef}
          style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            zIndex: 500,
          }}
        >
          <div
            role="menu"
            style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: 10,
              boxShadow:
                '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)',
              width: 112,
              padding: 4,
            }}
          >
            <button
              role="menuitem"
              onClick={() => { setMenuOpen(false); onRemove?.() }}
              className="flex gap-1.5 items-center w-full h-7 px-1.5 py-1 rounded-[8px] hover:bg-[#fef2f2] transition-colors duration-100 text-left"
            >
              <Trash2 size={16} strokeWidth={1.75} className="shrink-0 text-[#dc2626]" aria-hidden="true" />
              <span className="text-[14px] font-normal leading-5 text-[#dc2626]">
                Remover
              </span>
            </button>
          </div>
        </div>,
        document.body,
      )}
    </article>
  )
}
