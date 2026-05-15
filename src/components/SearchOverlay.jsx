import { useEffect, useRef } from 'react'
import CatalogueCard from './CatalogueCard'
import SearchEmptyState from './SearchEmptyState'

/**
 * SearchOverlay
 *
 * The catalogue dialog that appears below the search input.
 * Positioned absolutely within the white page container.
 *
 * Props:
 *  - query      {string}   debounced search term
 *  - rawQuery   {string}   live (non-debounced) term — used for highlighting
 *  - catalogue  {Array}    all searchable books
 *  - addedIds   {Set}      ids of books already added
 *  - onAdd      {fn}       called with a book object when "+ Adicionar" clicked
 *  - onClose    {fn}       close handler
 */
export default function SearchOverlay({
  query,
  rawQuery,
  catalogue = [],
  addedIds,
  onAdd,
  onClose,
  isExiting = false,
  openCount = 0,
}) {
  const scrollRef = useRef(null)

  /* Reset scroll when query changes */
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [query])

  /* Normalize + lowercase helper — handles composed (NFC) vs decomposed (NFD) accents */
  const norm = (str) => str.normalize('NFC').toLowerCase()

  /* Filter catalogue by title or grade */
  const results = query.trim()
    ? catalogue.filter(
        (book) =>
          norm(book.title).includes(norm(query)) ||
          norm(book.grade).includes(norm(query)),
      )
    : catalogue

  const isEmpty = results.length === 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Catálogo de manuais"
      className={`flex flex-col overflow-hidden rounded-[14px] ${isExiting ? 'search-overlay-exit' : 'search-overlay-enter'}`}
      style={{
        height: '567px',
        background: 'var(--background)',
        border: '1px solid #e5e5e5',
        boxShadow:
          '0px 4px 6px -1px rgba(8,13,22,0.1), 0px 2px 4px -2px rgba(8,12,16,0.1)',
      }}
    >
      {/* ── Scrollable catalogue ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
        style={{ padding: '12px 16px 120px' }}
      >
        {isEmpty ? (
          <SearchEmptyState query={query} />
        ) : (
          /* 7-column grid matching the Figma catalogue layout (~134 px per card) */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(116px, 1fr))',
              gap: '24px',
              alignItems: 'end',
            }}
          >
            {results.map((book, idx) => (
              /* Wrapper drives the stagger animation.
                 Key includes openCount so all cards get fresh animation keys
                 on each new open session, while filter changes within the same
                 session leave existing DOM nodes untouched (no re-animation). */
              <div
                key={`${book.id}-${openCount}`}
                className="card-enter"
                style={{ animationDelay: `${Math.min(idx, 7) * 28}ms` }}
              >
                <CatalogueCard
                  book={book}
                  searchQuery={rawQuery || query}
                  isAdded={addedIds.has(book.id)}
                  onAdd={onAdd}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer gradient (fades content into white) ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 pointer-events-none rounded-b-[14px]"
        style={{
          height: '114px',
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,1) 100%)',
        }}
      />
    </div>
  )
}
