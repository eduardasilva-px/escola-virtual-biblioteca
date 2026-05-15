import { SearchX } from 'lucide-react'

/**
 * SearchEmptyState
 *
 * Shown inside the catalogue overlay when the search query returns no results.
 *
 * Props:
 *  - query {string}  the current search term — displayed in the title when present
 */
export default function SearchEmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full min-h-[300px] text-center px-6">
      <SearchX
        size={20}
        strokeWidth={1.75}
        className="text-[#080c10]"
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-1">
        <p className="text-[14px] font-medium leading-5 text-[#080c10]">
          {query
            ? <>Sem resultados para <span className="italic">&ldquo;{query}&rdquo;</span></>
            : 'Sem resultados'}
        </p>
        <p className="text-[14px] font-normal leading-5 text-[#737373] max-w-[280px]">
          Verifique os termos pesquisados ou tente novamente com palavras diferentes.
        </p>
      </div>
    </div>
  )
}
