import { useState } from 'react'
import { Search, X, ArrowUpDown } from 'lucide-react'
import FilterButton from './FilterButton'

/**
 * SearchBar
 *
 * Controlled search input + filter buttons row.
 *
 * Props:
 *  - query          {string}   current value
 *  - onQueryChange  {fn}       called with new value on each keystroke
 *  - onClear        {fn}       called when the × button is clicked
 *  - inputRef       {ref}      forwarded to the <input> element
 *  - isOpen         {boolean}  true while the catalogue overlay is visible
 *  - filters        {Array}    [{ key, label, items, selectedItems }]
 *  - onFilterToggle {fn}       called with (key, value) when a filter item is toggled
 *  - sortOrder      {string}   current sort key
 *  - onSortChange   {fn}       called with the new sort key
 */
export default function SearchBar({
  query = '',
  onQueryChange,
  onClear,
  inputRef,
  containerRef,
  isOpen = false,
  filters = [],
  onFilterToggle,
  onClearFilters,
  sortOrder,
  onSortChange,
}) {
  const [isFocused, setIsFocused] = useState(false)
  const isActive = isFocused || isOpen

  return (
    <div ref={containerRef} className="relative shrink-0 w-full">
      <div className="flex gap-3 items-center w-full">

        {/* Search input — fixed width so the sort button never shifts */}
        <div className="shrink-0">
          <label htmlFor="search-biblioteca" className="sr-only">
            Explorar catálogo e adicionar livros
          </label>
          <div
            className="flex gap-3 h-9 items-center px-3 py-1 rounded-[8px] transition-[box-shadow] duration-150"
            style={{
              width: '338px',
              background: 'var(--background)',
              border: '1px solid var(--input)',
              boxShadow: isActive
                ? '0px 1px 1.5px rgba(8,13,22,0.1), 0 0 0 3px rgba(83,83,83,0.12)'
                : '0px 1px 1.5px rgba(8,13,22,0.1)',
            }}
          >
              <div className="flex gap-2 items-center flex-1 min-w-0">
                <Search
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="shrink-0 text-[#3a4452]"
                />
                <input
                  id="search-biblioteca"
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isActive ? '' : 'Explorar catálogo e adicionar livros'}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-haspopup="dialog"
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? 'catalogue-dialog' : undefined}
                  className="flex-1 min-w-0 bg-transparent text-[14px] font-normal leading-5 text-[#3a4452] placeholder:text-[#3a4452] outline-none truncate"
                />
              </div>

              {/* Clear button — always in DOM, fades+scales in when there's a query */}
              <button
                type="button"
                onClick={onClear}
                aria-label="Limpar pesquisa"
                className={`shrink-0 flex items-center justify-center w-4 h-4 text-[#3a4452] hover:text-[#080c10] transition-[opacity,transform,color] duration-150 ease-out ${
                  query
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-75 pointer-events-none'
                }`}
              >
                <X size={13} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
        </div>

        {/* Filter buttons + Sort — flex-1 so sort is always pinned to the right */}
        <div className="flex flex-1 min-w-0 items-center justify-between">
          {/* Filter buttons group + Limpar filtros */}
          <div className="flex gap-1.5 items-center shrink-0">
            <div className="flex gap-3 items-center shrink-0">
              {filters.map((f) => (
                <FilterButton
                  key={f.key}
                  label={f.label}
                  items={f.items}
                  selectedItems={f.selectedItems}
                  onToggle={(value) => onFilterToggle(f.key, value)}
                  showSearch={f.showSearch !== false}
                />
              ))}
            </div>

            {/* Clear all filters — only shown when at least one filter is active */}
            {filters.some((f) => f.selectedItems.size > 0) && (
              <button
                type="button"
                onClick={onClearFilters}
                className="text-[13px] font-medium leading-none text-[#1a1a1a] hover:text-[#080c10] transition-colors duration-100 whitespace-nowrap px-1"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Sort button — always at the far right */}
          <FilterButton
            label="Ordenar por"
            icon={ArrowUpDown}
            align="right"
            sortConfig={
              sortOrder !== undefined
                ? { value: sortOrder, onChange: onSortChange }
                : undefined
            }
          />
        </div>

      </div>
    </div>
  )
}
