import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * ConfirmRemoveDialog
 *
 * Alert dialog asking the user to confirm removing a book from their library.
 * Rendered via createPortal so it sits above everything.
 *
 * Props:
 *  - book      {cover, title, grade}  book to be removed
 *  - onCancel  {fn}                   called when user dismisses without confirming
 *  - onConfirm {fn}                   called when user confirms removal
 *  - isExiting {boolean}              drives exit animation classes
 */
export default function ConfirmRemoveDialog({ book, onCancel, onConfirm, isExiting }) {
  /* Close on Escape */
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return createPortal(
    /* ── Backdrop ── */
    <div
      className={`fixed inset-0 z-[700] flex items-center justify-center ${
        isExiting ? 'dialog-backdrop-exit' : 'dialog-backdrop-enter'
      }`}
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
      aria-hidden="true"
    >
      {/* ── Panel ── */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="remove-dialog-title"
        aria-describedby="remove-dialog-desc"
        aria-hidden="false"
        className={`flex flex-col bg-white rounded-[16px] overflow-hidden ${
          isExiting ? 'dialog-panel-exit' : 'dialog-panel-enter'
        }`}
        style={{
          width: 380,
          boxShadow:
            '0px 20px 25px -5px rgba(0,0,0,0.12), 0px 8px 10px -6px rgba(0,0,0,0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Content ── */}
        <div className="flex gap-4 items-start p-6">
          {/* Book cover thumbnail — wider so the cover reads clearly */}
          <div
            className="shrink-0 rounded-[4px] overflow-hidden"
            style={{
              width: 76,
              boxShadow:
                '0px 1px 1px rgba(0,0,0,0.38), 0px 4px 4px rgba(70,67,62,0.16)',
            }}
          >
            <img
              src={book.cover}
              alt=""
              aria-hidden="true"
              className="block w-full h-auto"
              draggable={false}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2 min-w-0">
            <p
              id="remove-dialog-title"
              className="text-[16px] font-semibold leading-snug text-[#080c10]"
            >
              Remover {book.title} · {book.grade}?
            </p>
            <p
              id="remove-dialog-desc"
              className="text-[14px] font-normal leading-5 text-[#535353]"
            >
              Irá remover permanentemente este livro da sua biblioteca.
              Poderá voltar a adicioná-lo mais tarde.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-end gap-2 px-6 py-4"
          style={{ borderTop: '1px solid #e5e5e5' }}
        >
          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center h-9 px-4 rounded-[8px] text-[14px] font-medium leading-none text-[#080c10] bg-white hover:bg-[#f6f6f5] transition-colors duration-100"
            style={{
              border: '1px solid var(--input)',
              boxShadow:
                '0px 0.5px 1.5px rgba(8,12,16,0.14), inset 0px -1px 1px 0px rgba(146,146,145,0.2)',
            }}
          >
            Cancelar
          </button>

          {/* Confirm — soft destructive */}
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center justify-center h-9 px-4 rounded-[10px] text-[14px] font-medium leading-none text-[#dc2626] bg-[#fef2f2] hover:bg-[#fee2e2] transition-colors duration-100"
          >
            Remover
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
