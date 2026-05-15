import { SearchX } from 'lucide-react'

/**
 * FilterEmptyState
 *
 * Shown in the library grid when active filters produce zero results.
 * Encourages the user to search the full catalogue via the search bar.
 */
export default function FilterEmptyState() {
  return (
    <div
      className="flex flex-col gap-2 items-center justify-center w-full px-2 py-8 rounded-[12px]"
      style={{
        background: 'var(--background)',
        border: '1px solid var(--border)',
        boxShadow: '0px 2px 2px rgba(27,42,74,0.1)',
      }}
    >
      {/* Icon + text */}
      <div className="flex flex-col gap-2 items-center w-full">
        <SearchX
          size={16}
          strokeWidth={1.75}
          className="text-[#080c10]"
          aria-hidden="true"
        />

        <div className="flex flex-col items-center text-center text-[14px] leading-5 w-full">
          <p className="font-medium text-[#080c10]">
            Não encontrámos esse livro na sua biblioteca
          </p>
          <p className="font-normal text-[#737373]">
            Clique na barra de pesquisa para procurar no catálogo completo e adicioná-lo.
          </p>
        </div>
      </div>
    </div>
  )
}
