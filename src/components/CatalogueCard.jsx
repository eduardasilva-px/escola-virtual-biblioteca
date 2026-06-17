import { Plus } from 'lucide-react'

/**
 * Splits `text` into a [before, match, after] triple for highlight rendering.
 * Returns null for the match segment if `query` isn't found.
 */
const norm = (str) => str.normalize('NFC').toLowerCase()

function splitHighlight(text, query) {
  if (!query.trim()) return { before: '', match: text, after: '' }
  const idx = norm(text).indexOf(norm(query))
  if (idx === -1) return null
  return {
    before: text.slice(0, idx),
    match: text.slice(idx, idx + query.length),
    after: text.slice(idx + query.length),
  }
}

/**
 * CatalogueCard
 *
 * Used inside the search overlay catalogue grid.
 *
 * Props:
 *  - book        {id, cover, title, grade}
 *  - searchQuery {string}   current search term for title highlight
 *  - isAdded     {boolean}  show "Adicionado" badge vs "+ Adicionar" button
 *  - onAdd       {fn}       called with `book` when Adicionar is clicked
 */
export default function CatalogueCard({ book, searchQuery = '', isAdded = false, onAdd }) {
  const highlight = splitHighlight(book.title, searchQuery)

  return (
    <article className="flex flex-col gap-2 items-start drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] justify-end min-w-0 w-full">

      {/* ── Cover container ── */}
      <div className="relative rounded-[4px] w-full">

        {/* Book cover — natural aspect ratio */}
        <img
          src={book.cover}
          alt={`Capa do livro ${book.title}`}
          className="block w-full h-auto rounded-[4px]"
          draggable={false}
        />

        {/* Spine gloss */}
        <div
          className="absolute inset-0 rounded-[4px] pointer-events-none"
          style={{
            background:
              'linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 91.5%, rgba(0,0,0,0.1) 94.1%, rgba(255,255,255,0.16) 94.5%, rgba(0,0,0,0.06) 95.3%, rgba(0,0,0,0.04) 97.4%, rgba(255,255,255,0) 100%)',
          }}
        />

        {/* "Na biblioteca" badge — top-left of cover, replaces the button */}
        {isAdded && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dcfce7] border border-black/10 pointer-events-none">
            <span className="text-[12px] font-medium leading-4 text-[#166534] whitespace-nowrap">
              Na biblioteca
            </span>
          </div>
        )}

        {/* Bottom gradient + "Adicionar" button — hidden once added */}
        {!isAdded && (
          <div
            className="absolute bottom-0 left-0 right-0 p-2 rounded-b-[4px]"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
            }}
          >
            <button
              onClick={() => onAdd(book)}
              className="flex items-center justify-center gap-1.5 w-full px-[10px] py-2 bg-white/90 backdrop-blur-[6px] rounded-[6px] shadow-[0px_1px_3px_0px_rgba(8,12,16,0.14)] hover:bg-white active:scale-[0.98] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={`Adicionar ${book.title} à biblioteca`}
            >
              <Plus size={14} strokeWidth={2} className="shrink-0 text-[#2a2a29]" aria-hidden="true" />
              <span className="text-[12px] font-medium leading-none text-[#2a2a29] whitespace-nowrap">
                Adicionar
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ── Metadata ── */}
      <div className="flex flex-col gap-0 w-full overflow-hidden">
        {/* Title with search-term highlight */}
        <p
          className="text-[13px] leading-5 truncate"
          style={{ color: 'var(--foreground)' }}
          title={book.title}
        >
          {highlight ? (
            <>
              {highlight.before && (
                <span className="font-normal text-[#111820]">{highlight.before}</span>
              )}
              <span className="font-semibold text-black">{highlight.match}</span>
              {highlight.after && (
                <span className="font-normal text-[#111820]">{highlight.after}</span>
              )}
            </>
          ) : (
            <span className="font-normal text-[#111820]">{book.title}</span>
          )}
        </p>
        <p className="text-[12px] font-normal leading-4 text-[#38444f] truncate">
          {book.grade}
        </p>
      </div>
    </article>
  )
}
