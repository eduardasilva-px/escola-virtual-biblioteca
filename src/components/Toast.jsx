import { CircleCheck, X } from 'lucide-react'

/**
 * Toast
 *
 * Notification matching the Figma alert spec.
 * Rendered via createPortal into document.body — never clipped by overflow-hidden ancestors.
 *
 * Props:
 *  - book      {id, title, grade}       the book that was added or removed
 *  - type      {'added' | 'removed'}    controls colour scheme and copy
 *  - isExiting {boolean}                drives exit animation class
 *  - onDismiss {fn}                     called when the × button is clicked
 */
export default function Toast({ book, type = 'added', isExiting, onDismiss }) {
  const isAdded = type === 'added'

  const styles = isAdded
    ? {
        bg:          '#f0fdf4',
        border:      '#dcfce7',
        iconColor:   'text-[#15803d]',
        titleColor:  'text-[#15803d]',
        closeHover:  'hover:bg-[#dcfce7]',
        closeRing:   'focus-visible:ring-[#15803d]',
      }
    : {
        bg:          '#f9f9f9',
        border:      '#e5e5e5',
        iconColor:   'text-[#535353]',
        titleColor:  'text-[#1a1a1a]',
        closeHover:  'hover:bg-[#efefef]',
        closeRing:   'focus-visible:ring-[#d0d0cf]',
      }

  const title = isAdded ? 'Manual adicionado!' : 'Manual removido'
  const body  = isAdded
    ? `${book.title} · ${book.grade} foi adicionado à tua biblioteca.`
    : `${book.title} · ${book.grade} foi removido da tua biblioteca.`

  return (
    <div
      className={`flex gap-3 items-start px-4 py-3 rounded-[10px] ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        boxShadow:
          '0px 4px 6px -1px rgba(8,13,22,0.10), 0px 2px 4px -2px rgba(8,12,16,0.08)',
        width: 360,
        maxWidth: 'calc(100vw - 48px)',
      }}
    >
      {/* ── Icon ── */}
      <div className="shrink-0 pt-[2px]">
        <CircleCheck
          size={16}
          strokeWidth={2}
          className={styles.iconColor}
          aria-hidden="true"
        />
      </div>

      {/* ── Text ── */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <p className={`text-[14px] font-medium leading-5 ${styles.titleColor}`}>
          {title}
        </p>
        <p className="text-[14px] font-normal leading-5 text-[#0b0b0b]">
          {body}
        </p>
      </div>

      {/* ── Close button ── */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar notificação"
        className={`shrink-0 flex items-center justify-center w-5 h-5 -mt-[2px] -mr-[4px] rounded-full ${styles.iconColor} ${styles.closeHover} transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 ${styles.closeRing} focus-visible:ring-offset-1`}
      >
        <X size={13} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  )
}
