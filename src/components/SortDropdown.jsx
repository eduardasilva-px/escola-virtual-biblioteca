import { Check } from 'lucide-react'

/**
 * SortDropdown
 *
 * Radio-select panel for the "Ordenar por" button.
 * Renders inside a portal-positioned wrapper in FilterButton.
 *
 * Props:
 *  - value    {string}  current sort key
 *  - onChange {fn}      called with the new sort key when an option is clicked
 */

export const SORT_OPTIONS = [
  { value: 'recent',    label: 'Adicionados recentemente'  },
  { value: 'grade-asc', label: 'Ano de escolaridade (1º - 12º)' },
  { value: 'alpha',     label: 'Título (A - Z)'            },
]

export default function SortDropdown({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Ordenar por"
      style={{
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: 10,
        boxShadow:
          '0px 4px 6px -1px rgba(0,0,0,0.10), 0px 2px 4px -2px rgba(0,0,0,0.10)',
        padding: 4,
        minWidth: 228,
      }}
    >
      {SORT_OPTIONS.map((opt) => {
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className="relative flex items-center w-full text-left rounded-[8px] transition-colors duration-100"
            style={{
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 8,
              paddingRight: 32,
              background: isSelected ? '#f5f5f5' : 'transparent',
            }}
          >
            <span
              className="text-[14px] font-normal leading-6 whitespace-nowrap"
              style={{ color: '#0a0a0a' }}
            >
              {opt.label}
            </span>

            {isSelected && (
              <Check
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className="absolute"
                style={{ right: 8, color: '#0a0a0a' }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
