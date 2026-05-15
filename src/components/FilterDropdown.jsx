import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

/**
 * FilterDropdown
 *
 * The panel that appears below a FilterButton.
 * Rendered via createPortal so it escapes overflow-hidden ancestors.
 *
 * Props:
 *  - items         {string[]}  all available options
 *  - selectedItems {Set}       currently selected values
 *  - onToggle      {fn}        called with the item string when a row is clicked
 */
export default function FilterDropdown({ items, selectedItems, onToggle }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)

  // Auto-focus the search input when the dropdown opens
  useEffect(() => { inputRef.current?.focus() }, [])

  const filtered = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e5e5e5',
        borderRadius: 10,
        boxShadow:
          '0px 4px 6px -1px rgba(0,0,0,0.10), 0px 2px 4px -2px rgba(0,0,0,0.10)',
        width: 320,
      }}
    >
      {/* ── Search input ── */}
      <div style={{ padding: '4px 4px 0' }}>
        <div
          className="flex items-center gap-1 h-8 px-3 py-1 rounded-[8px]"
          style={{ background: 'white', border: '1px solid #d0d0cf' }}
        >
          <Search size={14} strokeWidth={1.75} className="shrink-0 text-[#535353]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar"
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent text-[14px] font-normal leading-5 text-[#535353] placeholder:text-[#535353] outline-none"
          />
        </div>
      </div>

      {/* ── Items list ── */}
      <div
        style={{ padding: 4, display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 232, overflowY: 'auto' }}
        role="listbox"
        aria-multiselectable="true"
      >
        {filtered.length === 0 ? (
          <p className="px-1 py-3 text-[13px] text-center text-[#535353]">
            Sem resultados
          </p>
        ) : (
          filtered.map((item) => {
            const checked = selectedItems.has(item)
            return (
              <button
                key={item}
                role="option"
                aria-selected={checked}
                onClick={() => onToggle(item)}
                className="flex gap-2 items-center w-full rounded-[6px] hover:bg-[#f6f6f5] transition-colors duration-100 text-left"
                style={{ padding: 4 }}
              >
                {/* Checkbox */}
                <div
                  className="shrink-0 flex items-center justify-center rounded-[4px]"
                  style={{
                    width: 16,
                    height: 16,
                    background: checked ? 'var(--sidebar)' : 'white',
                    border: checked ? 'none' : '1px solid #e5e5e5',
                  }}
                  aria-hidden="true"
                >
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* Label */}
                <span className="text-[14px] leading-5 text-[#0a0a0a]">
                  {item}
                </span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
