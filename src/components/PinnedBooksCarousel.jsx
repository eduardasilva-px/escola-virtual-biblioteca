import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BookCard from './BookCard'

const CARD_GAP = 16

// Number of cards visible per row based on track width
function getCardsPerRow(trackWidth) {
  if (trackWidth >= 1700) return 8
  if (trackWidth >= 1400) return 7
  if (trackWidth >= 1100) return 6
  return 5
}

/**
 * PinnedBooksCarousel
 *
 * Renders the pinned books row. When there is overflow it shows
 * left / right arrow buttons and edge-fade gradients so the user
 * can navigate without a visible scrollbar.
 *
 * Props:
 *  - books       {Array}   pinned book objects
 *  - onPinToggle {fn}      called with (book) when pin icon clicked
 *  - onRemove    {fn}      called with (book) when "Remover" selected
 */
export default function PinnedBooksCarousel({ books, onPinToggle, onRemove }) {
  const trackRef = useRef(null)
  const [atStart,     setAtStart]     = useState(true)
  const [atEnd,       setAtEnd]       = useState(true)
  const [cardsPerRow, setCardsPerRow] = useState(6)

  function update() {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2)
    setCardsPerRow(getCardsPerRow(el.clientWidth))
  }

  /* Set up scroll + resize listeners */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* Re-check when the book list changes (e.g. after pin/unpin) */
  useEffect(() => { update() }, [books])

  function scroll(dir) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({
      left: dir * ((el.clientWidth + CARD_GAP) / cardsPerRow),
      behavior: 'smooth',
    })
  }

  const cardFlex = `0 0 calc((100% - ${(cardsPerRow - 1) * CARD_GAP}px) / ${cardsPerRow})`

  return (
    <div className="relative w-full -mt-2">

      {/* ── Scrollable track (scrollbar hidden via CSS class) ── */}
      <div
        ref={trackRef}
        className="flex items-end overflow-x-auto scrollbar-none pt-2"
        style={{ gap: CARD_GAP }}
      >
        {books.map((book) => (
          <div key={book.id} style={{ flex: cardFlex, minWidth: 0 }}>
            <BookCard
              cover={book.cover}
              title={book.title}
              grade={book.grade}
              pinned
              onPinToggle={() => onPinToggle(book)}
              onRemove={() => onRemove(book)}
            />
          </div>
        ))}
      </div>

      {/* ── Left edge fade ── */}
      <div
        aria-hidden="true"
        className="absolute left-0 inset-y-0 w-24 pointer-events-none transition-opacity duration-200"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.3) 60%, transparent 100%)',
          opacity: atStart ? 0 : 1,
        }}
      />

      {/* ── Left arrow ── */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Navegar para a esquerda"
        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white transition-[opacity,transform] duration-200 hover:scale-105 active:scale-95"
        style={{
          border:     '1px solid var(--input)',
          boxShadow:  '0px 1px 3px rgba(8,13,22,0.14)',
          opacity:    atStart ? 0 : 1,
          pointerEvents: atStart ? 'none' : 'auto',
        }}
      >
        <ChevronLeft size={15} strokeWidth={1.75} aria-hidden="true" />
      </button>

      {/* ── Right edge fade ── */}
      <div
        aria-hidden="true"
        className="absolute right-0 inset-y-0 w-24 pointer-events-none transition-opacity duration-200"
        style={{
          background: 'linear-gradient(to left, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.3) 60%, transparent 100%)',
          opacity: atEnd ? 0 : 1,
        }}
      />

      {/* ── Right arrow ── */}
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Navegar para a direita"
        className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white transition-[opacity,transform] duration-200 hover:scale-105 active:scale-95"
        style={{
          border:     '1px solid var(--input)',
          boxShadow:  '0px 1px 3px rgba(8,13,22,0.14)',
          opacity:    atEnd ? 0 : 1,
          pointerEvents: atEnd ? 'none' : 'auto',
        }}
      >
        <ChevronRight size={15} strokeWidth={1.75} aria-hidden="true" />
      </button>

    </div>
  )
}
