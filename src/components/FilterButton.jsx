import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import FilterDropdown from './FilterDropdown'
import SortDropdown from './SortDropdown'

/**
 * FilterButton
 *
 * Dropdown trigger for a single filter dimension.
 * Owns its own open/closed state; renders the dropdown panel via
 * createPortal so it escapes any overflow-hidden ancestor.
 *
 * Props:
 *  - label         {string}    button text
 *  - icon          {Component} optional leading lucide icon (e.g. ArrowUpDown)
 *  - items         {string[]}  available filter options (empty → no dropdown)
 *  - selectedItems {Set}       currently active selections
 *  - onToggle      {fn}        called with item string on checkbox click
 *  - sortConfig    {object}    { value, onChange } — when provided renders a SortDropdown
 *  - align         {'left'|'right'}  dropdown alignment (default 'left')
 */
export default function FilterButton({
  label,
  icon: Icon,
  items = [],
  selectedItems = new Set(),
  onToggle,
  sortConfig,
  align = 'left',
}) {
  const [isOpen,          setIsOpen]          = useState(false)
  const [dropdownMounted, setDropdownMounted] = useState(false)
  const [dropdownExiting, setDropdownExiting] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, right: undefined })
  const buttonRef   = useRef(null)
  const dropdownRef = useRef(null)
  const exitTimerRef = useRef(null)

  const hasDropdown = items.length > 0 || onToggle !== undefined || sortConfig !== undefined
  const isActive    = selectedItems.size > 0

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setDropdownExiting(true)
    exitTimerRef.current = setTimeout(() => {
      setDropdownMounted(false)
      setDropdownExiting(false)
    }, 150)
  }, [])

  function openDropdown() {
    clearTimeout(exitTimerRef.current)
    const rect = buttonRef.current.getBoundingClientRect()
    if (align === 'right') {
      setDropdownPos({
        top:   rect.bottom + 6,
        right: window.innerWidth - rect.right,
        left:  undefined,
      })
    } else {
      setDropdownPos({ top: rect.bottom + 6, left: rect.left, right: undefined })
    }
    setDropdownMounted(true)
    setDropdownExiting(false)
    setIsOpen(true)
  }

  function handleClick() {
    if (!hasDropdown) return
    isOpen ? closeDropdown() : openDropdown()
  }

  // Clean up exit timer on unmount
  useEffect(() => () => clearTimeout(exitTimerRef.current), [])

  /* Close on Escape or click outside */
  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'Escape') closeDropdown()
    }
    function onPointer(e) {
      if (
        buttonRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) return
      closeDropdown()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [isOpen, closeDropdown])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-expanded={hasDropdown ? isOpen : undefined}
        aria-haspopup={hasDropdown ? 'listbox' : undefined}
        className="relative flex items-center justify-center gap-1.5 h-9 px-2.5 py-2 rounded-[6px] shrink-0 transition-colors duration-100"
        style={{
          background: 'var(--secondary)',
          border: '1px solid var(--input)',
          boxShadow:
            '0px 0.5px 1.5px rgba(8,12,16,0.14), inset 0px -1px 1px 0px rgba(146,146,145,0.2)',
          color: 'var(--foreground)',
        }}
      >
        {Icon && (
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
        )}
        <span className="text-[14px] font-medium leading-none whitespace-nowrap">
          {label}
        </span>
        {isActive && (
          <span
            className="flex items-center justify-center rounded-full text-[11px] font-semibold leading-none"
            style={{
              minWidth: 18,
              height: 18,
              padding: '0 5px',
              background: '#d0d0cf',
              color: '#080c10',
            }}
          >
            {selectedItems.size}
          </span>
        )}
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className="shrink-0 transition-transform duration-150"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {dropdownMounted && createPortal(
        <div
          ref={dropdownRef}
          className={dropdownExiting ? 'dropdown-exit' : 'dropdown-enter'}
          style={{
            position:        'fixed',
            top:             dropdownPos.top,
            left:            dropdownPos.left,
            right:           dropdownPos.right,
            zIndex:          400,
            transformOrigin: align === 'right' ? 'top right' : 'top left',
          }}
        >
          {sortConfig ? (
            <SortDropdown
              value={sortConfig.value}
              onChange={(val) => { sortConfig.onChange(val); closeDropdown() }}
            />
          ) : (
            <FilterDropdown
              items={items}
              selectedItems={selectedItems}
              onToggle={onToggle}
            />
          )}
        </div>,
        document.body,
      )}
    </>
  )
}
