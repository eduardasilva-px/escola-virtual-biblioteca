import { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import AppBanner from './AppBanner'
import SearchBar from './SearchBar'
import BookCard from './BookCard'
import FloatingButton from './FloatingButton'
import SearchOverlay from './SearchOverlay'
import Toast from './Toast'
import FilterEmptyState from './FilterEmptyState'
import ConfirmRemoveDialog from './ConfirmRemoveDialog'

// ── Book covers — correct mapping discovered from Figma source analysis:
// imgImg1 is a SHARED overlay reused on every card (not a cover).
// Actual covers use the sequence: imgImg, imgImg2, imgImg3, imgImg4, imgImg5…
//
// Pinned (4 books):
//   imgImg  (13c94398) = Português 11°ano
//   imgImg2 (b3f1801f) = Matemática 7°ano  (MX)
//   imgImg3 (8152ebd9) = Economia C 12°ano (Odisseia branding)
//   imgImg4 (fa3ce155) = Biologia e Geologia 10°ano (volcanic cover)
//
// Grid (9 books, 1 image each):
//   imgImg5  (21a3c0a4) = Física 12°ano
//   imgImg6  (d90eaceb) = TIC 9°ano
//   imgImg7  (44fcc72e) = Ciências Naturais 8°ano
//   imgImg8  (4a0b7aee) = Ciências Naturais 9°ano
//   imgImg9  (cea8d38c) = Espanhol 6°ano
//   imgImg10 (c1a3fc55) = Matemática 7°ano
//   imgImg11 (337a0155) = (row 3, partial)
//   imgImg12 (423f8f31) = (row 3, partial)
//   imgImg13 (2550e896) = (row 3, partial)
import coverPortugues  from '../assets/images/book-portugues.jpg'
import coverMatematica from '../assets/images/book-mx.jpg'
import coverEconomia   from '../assets/images/book-odyssey.jpg'
import coverBiologia   from '../assets/images/book-matematica.jpg'
import coverFisica     from '../assets/images/book-economia.jpg'
import coverTic        from '../assets/images/book-biologia.jpg'
import coverCiencias8  from '../assets/images/book-fisica.jpg'
import coverCiencias9  from '../assets/images/book-tic.jpg'
import coverEspanhol   from '../assets/images/book-ciencias-8.jpg'
import coverMat7       from '../assets/images/book-ciencias-9.jpg'
import coverRow3a      from '../assets/images/book-espanhol.jpg'
import coverRow3b      from '../assets/images/book-matematica2.jpg'
import coverRow3c      from '../assets/images/book-sucesso.jpg'

// ── Catalogue covers — real Figma assets ──
import catMat1ano     from '../assets/images/cat-mat-1ano.jpg'
import catMat2ano     from '../assets/images/cat-mat-2ano.jpg'
import catMat3ano     from '../assets/images/cat-mat-3ano.jpg'
import catMat4ano     from '../assets/images/cat-mat-4ano.jpg'
import catMat5ano     from '../assets/images/cat-mat-5ano.jpg'
import catMat6ano     from '../assets/images/cat-mat-6ano.jpg'
import catMat7anoA    from '../assets/images/cat-mat-7ano-a.jpg'
import catMat7anoB    from '../assets/images/cat-mat-7ano-b.jpg'
import catMat8ano     from '../assets/images/cat-mat-8ano.jpg'
import catMat9ano     from '../assets/images/cat-mat-9ano.jpg'
import catMatA10ano   from '../assets/images/cat-mat-a-10ano.jpg'
import catMatA11ano   from '../assets/images/cat-mat-a-11ano.jpg'
import catMatA12anoA  from '../assets/images/cat-mat-a-12ano-a.jpg'
import catMatA12anoB  from '../assets/images/cat-mat-a-12ano-b.jpg'
import catMatA12anoC  from '../assets/images/cat-mat-a-12ano-c.jpg'
import catMatMacs10   from '../assets/images/cat-mat-macs-10ano.jpg'

// ── Pinned books — shown in the top strip ──
const PINNED_BOOKS = [
  { id: 'portugues-11', cover: coverPortugues,  title: 'Português',          grade: '11°ano', pinned: true },
  { id: 'matematica-7', cover: catMat7anoA,    title: 'Matemática',          grade: '7°ano',  pinned: true },
  { id: 'economia-12',  cover: coverEconomia,   title: 'Economia C',          grade: '12°ano', pinned: true },
  { id: 'biologia-10',  cover: coverBiologia,   title: 'Biologia e Geologia', grade: '10°ano', pinned: true },
]

// ── Initial grid books — already in the user's library ──
const INITIAL_GRID_BOOKS = [
  { id: 'fisica-12',   cover: coverFisica,    title: 'Física',            grade: '12°ano', pinned: false },
  { id: 'tic-9',       cover: coverTic,       title: 'TIC',               grade: '9°ano',  pinned: false },
  { id: 'ciencias-8',  cover: coverCiencias8, title: 'Ciências Naturais', grade: '8°ano',  pinned: false },
  { id: 'ciencias-9',  cover: coverCiencias9, title: 'Ciências Naturais', grade: '9°ano',  pinned: false },
  { id: 'espanhol-6',  cover: coverEspanhol,  title: 'Espanhol',          grade: '6°ano',  pinned: false },
  { id: 'matematica-9',cover: catMat9ano,     title: 'Matemática',         grade: '9°ano',  pinned: false },
  { id: 'ciencias-7',  cover: coverRow3b,     title: 'Ciências Naturais', grade: '7°ano',  pinned: false },
  { id: 'sucesso-8',   cover: coverRow3c,     title: 'Inglês',            grade: '8°ano',  pinned: false },
]

/** IDs of the books that ship in the library — used to seed CATALOGUE badges on first render */
const INITIAL_LIBRARY_IDS = new Set([
  ...PINNED_BOOKS.map((b) => b.id),
  ...INITIAL_GRID_BOOKS.map((b) => b.id),
])

/**
 * Full searchable catalogue — library books + all available books.
 * Sorted ascending by grade so search results always appear in school-year order.
 * No duplicate title+grade combinations.
 */
const CATALOGUE = [
  // Library books (will show "Adicionado" badge)
  ...PINNED_BOOKS,
  ...INITIAL_GRID_BOOKS,
  // Additional books available to add (not in library initially)
  { id: 'matematica-1',    cover: catMat1ano,    title: 'Matemática',                              grade: '1°ano'  },
  { id: 'matematica-2',    cover: catMat2ano,    title: 'Matemática',                              grade: '2°ano'  },
  { id: 'matematica-3',    cover: catMat3ano,    title: 'Matemática',                              grade: '3°ano'  },
  { id: 'matematica-4',    cover: catMat4ano,    title: 'Matemática',                              grade: '4°ano'  },
  { id: 'matematica-5',    cover: catMat5ano,    title: 'Matemática',                              grade: '5°ano'  },
  { id: 'portugues-5',     cover: coverRow3b,    title: 'Português',                               grade: '5°ano'  },
  { id: 'ciencias-6',      cover: coverCiencias8,title: 'Ciências Naturais',                       grade: '6°ano'  },
  { id: 'matematica-6',    cover: catMat6ano,    title: 'Matemática',                              grade: '6°ano'  },
  { id: 'espanhol-7',      cover: coverEspanhol, title: 'Espanhol',                                grade: '7°ano'  },
  { id: 'portugues-7',     cover: coverRow3c,    title: 'Português',                               grade: '7°ano'  },
  { id: 'tic-7',           cover: coverRow3a,    title: 'TIC',                                     grade: '7°ano'  },
  { id: 'matematica-7b',   cover: catMat7anoB,   title: 'Matemática',                              grade: '7°ano'  },
  { id: 'frances-8',       cover: coverMat7,     title: 'Francês',                                 grade: '8°ano'  },
  { id: 'historia-8',      cover: coverEconomia, title: 'História',                                grade: '8°ano'  },
  { id: 'ingles-8',        cover: coverCiencias9,title: 'Inglês',                                  grade: '8°ano'  },
  { id: 'matematica-8',    cover: catMat8ano,    title: 'Matemática',                              grade: '8°ano'  },
  { id: 'historia-9',      cover: coverBiologia, title: 'História',                                grade: '9°ano'  },
  { id: 'ingles-9',        cover: coverEspanhol, title: 'Inglês',                                  grade: '9°ano'  },
  { id: 'portugues-9',     cover: coverPortugues,title: 'Português',                               grade: '9°ano'  },
  { id: 'fqa-10',          cover: coverTic,      title: 'Física e Química A',                      grade: '10°ano' },
  { id: 'geo-10',          cover: coverCiencias8,title: 'Geografia A',                             grade: '10°ano' },
  { id: 'matematica-10a',  cover: catMatA10ano,  title: 'Matemática A',                            grade: '10°ano' },
  { id: 'mat-macs-10',     cover: catMatMacs10,  title: 'Matemática Aplicada às Ciências Sociais', grade: '10°ano' },
  { id: 'fqa-11',          cover: coverFisica,   title: 'Física e Química A',                      grade: '11°ano' },
  { id: 'matematica-11a',  cover: catMatA11ano,  title: 'Matemática A',                            grade: '11°ano' },
  { id: 'matematica-12a-a',cover: catMatA12anoA, title: 'Matemática A',                            grade: '12°ano' },
  { id: 'matematica-12a-b',cover: catMatA12anoB, title: 'Matemática A',                            grade: '12°ano' },
  { id: 'matematica-12a-c',cover: catMatA12anoC, title: 'Matemática A',                            grade: '12°ano' },
  { id: 'portugues-12',    cover: coverMatematica,title: 'Português',                              grade: '12°ano' },
].sort((a, b) => (parseInt(a.grade) || 0) - (parseInt(b.grade) || 0))

export default function BibliotecaPage() {
  /* ── Search state ── */
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  /* ── Library state — mutable so pin toggling and catalogue adds work ── */
  const [pinnedBooks, setPinnedBooks] = useState([...PINNED_BOOKS])
  const [gridBooks,   setGridBooks]   = useState([...INITIAL_GRID_BOOKS])

  /**
   * All IDs currently in the library — drives the "Adicionado" badge
   * in the search overlay. Re-derived whenever either array changes.
   */
  const libraryBookIds = useMemo(
    () => new Set([...pinnedBooks.map((b) => b.id), ...gridBooks.map((b) => b.id)]),
    [pinnedBooks, gridBooks],
  )

  /* ── Sort state — 'recent' | 'grade-asc' | 'alpha' ── */
  const [sortOrder, setSortOrder] = useState('recent')

  /** Sort a book array without mutating it */
  function sortBooks(books) {
    if (sortOrder === 'grade-asc') {
      return [...books].sort(
        (a, b) => (parseInt(a.grade) || 0) - (parseInt(b.grade) || 0),
      )
    }
    if (sortOrder === 'alpha') {
      return [...books].sort((a, b) => a.title.localeCompare(b.title, 'pt'))
    }
    // 'recent': keep insertion order (newest first by default)
    return books
  }

  /* ── Filter state ── */
  const [filterState, setFilterState] = useState({
    grade:   new Set(),
    subject: new Set(),
  })

  function handleFilterToggle(key, value) {
    setFilterState((prev) => {
      const next = new Set(prev[key])
      next.has(value) ? next.delete(value) : next.add(value)
      return { ...prev, [key]: next }
    })
  }

  function handleClearFilters() {
    setFilterState({ grade: new Set(), subject: new Set() })
  }

  /** Available items for each filter — derived from the current library. */
  const allLibraryBooks = useMemo(
    () => [...pinnedBooks, ...gridBooks],
    [pinnedBooks, gridBooks],
  )

  const gradeItems = useMemo(
    () =>
      [...new Set(allLibraryBooks.map((b) => b.grade))].sort(
        (a, b) => (parseInt(a) || 0) - (parseInt(b) || 0),
      ),
    [allLibraryBooks],
  )

  const subjectItems = useMemo(
    () => [...new Set(allLibraryBooks.map((b) => b.title))].sort((a, b) => a.localeCompare(b, 'pt')),
    [allLibraryBooks],
  )

  const hasActiveFilters =
    filterState.grade.size > 0 || filterState.subject.size > 0

  /** Filter configs passed down to SearchBar */
  const filters = [
    { key: 'grade',   label: 'Ano de escolaridade', items: gradeItems,   selectedItems: filterState.grade   },
    { key: 'subject', label: 'Disciplina',           items: subjectItems, selectedItems: filterState.subject },
    { key: 'editora', label: 'Editora',              items: [],           selectedItems: new Set()           },
  ]

  /** Returns true when a book passes all active filters */
  function bookMatchesFilters(book) {
    if (filterState.grade.size > 0   && !filterState.grade.has(book.grade))   return false
    if (filterState.subject.size > 0 && !filterState.subject.has(book.title)) return false
    return true
  }

  const visiblePinnedBooks = useMemo(
    () => sortBooks(pinnedBooks.filter(bookMatchesFilters)),
    [pinnedBooks, filterState, sortOrder], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const visibleGridBooks = useMemo(
    () => sortBooks(gridBooks.filter(bookMatchesFilters)),
    [gridBooks, filterState, sortOrder], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const searchInputRef = useRef(null)
  const stickyRowRef   = useRef(null)
  const searchBarRef   = useRef(null)

  /** Overlay is open whenever there's a non-empty query */
  const isOverlayOpen = query.trim().length > 0

  /* ── Delayed unmount — keeps backdrop + dialog in the DOM long enough
        for their exit animations to finish (180 ms) before React removes them. ── */
  const [overlayMounted, setOverlayMounted] = useState(false)
  const unmountTimerRef = useRef(null)
  useEffect(() => {
    if (isOverlayOpen) {
      clearTimeout(unmountTimerRef.current)
      setOverlayMounted(true)
    } else {
      unmountTimerRef.current = setTimeout(() => setOverlayMounted(false), 220)
    }
    return () => clearTimeout(unmountTimerRef.current)
  }, [isOverlayOpen])

  /** True during the exit animation window (mounted but query gone) */
  const isExiting = overlayMounted && !isOverlayOpen

  /* ── openCount: increments each time the overlay freshly opens.
        Used as part of card keys so the stagger animation fires on each new open
        session without re-animating cards that are already visible from filtering. ── */
  const [openCount, setOpenCount] = useState(0)
  useEffect(() => {
    if (isOverlayOpen) setOpenCount((c) => c + 1)
  }, [isOverlayOpen])  // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Overlay fixed position: measure sticky row on open + on resize ── */
  const [overlayFixedStyle, setOverlayFixedStyle] = useState({ position: 'fixed', top: -9999, visibility: 'hidden' })
  useEffect(() => {
    function compute() {
      if (!searchBarRef.current) return
      const rect        = searchBarRef.current.getBoundingClientRect()
      const mainEl      = document.querySelector('main')
      const containerEl = mainEl?.closest('[class*="rounded-\\[16px\\]"]') ?? mainEl
      const mainRight   = mainEl ? mainEl.getBoundingClientRect().right : window.innerWidth
      const containerBottom = containerEl
        ? containerEl.getBoundingClientRect().bottom
        : window.innerHeight
      setOverlayFixedStyle({
        position: 'fixed',
        top:    rect.bottom + 8,
        left:   rect.left,
        right:  window.innerWidth - mainRight + 24,
        bottom: window.innerHeight - containerBottom + 24,
        zIndex: 15,
      })
    }
    if (overlayMounted) {
      compute()
      window.addEventListener('resize', compute)
      return () => window.removeEventListener('resize', compute)
    } else {
      setOverlayFixedStyle({ position: 'fixed', top: -9999, visibility: 'hidden' })
    }
  }, [overlayMounted])

  /* ── Debounce: update `debouncedQuery` 250 ms after the user stops typing ── */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250)
    return () => clearTimeout(timer)
  }, [query])

  /* ── Esc: close the overlay ── */
  useEffect(() => {
    if (!isOverlayOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') clearSearch()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOverlayOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  function clearSearch() {
    setQuery('')
    setDebouncedQuery('')
    searchInputRef.current?.focus()
  }

  /* ── Toast state ─────────────────────────────────────────────────────────
     Single toast, timer-refreshed on repeated "Adicionar" clicks.
     Delayed unmount (220 ms) keeps the element alive for its exit animation.
  ───────────────────────────────────────────────────────────────────────── */
  const [toastBook, setToastBook]       = useState(null)     // {id,title,grade} | null
  const [toastType, setToastType]       = useState('added')  // 'added' | 'removed'
  const [toastMounted, setToastMounted] = useState(false)    // stays true during exit
  const [toastExiting, setToastExiting] = useState(false)    // drives exit animation class
  const dismissDelayRef = useRef(null)  // 4 s auto-dismiss
  const exitDelayRef    = useRef(null)  // 220 ms unmount after exit starts

  /* ── Confirm-remove dialog state ──────────────────────────────────────────
     Delayed unmount (200 ms) keeps the panel alive for its exit animation.
  ─────────────────────────────────────────────────────────────────────────── */
  const [bookToRemove,    setBookToRemove]    = useState(null)   // book pending removal
  const [dialogMounted,   setDialogMounted]   = useState(false)
  const [dialogExiting,   setDialogExiting]   = useState(false)
  const dialogExitTimerRef = useRef(null)

  function showToast(book, type = 'added') {
    // Cancel any in-flight timers so rapid actions reset the clock cleanly
    clearTimeout(dismissDelayRef.current)
    clearTimeout(exitDelayRef.current)

    setToastBook(book)
    setToastType(type)
    setToastExiting(false)
    setToastMounted(true)

    dismissDelayRef.current = setTimeout(() => dismissToast(), 4000)
  }

  function dismissToast() {
    clearTimeout(dismissDelayRef.current)
    clearTimeout(exitDelayRef.current)
    setToastExiting(true)
    exitDelayRef.current = setTimeout(() => {
      setToastMounted(false)
      setToastExiting(false)
      setToastBook(null)
    }, 220)
  }

  // Clean up timers on unmount
  useEffect(() => () => {
    clearTimeout(dismissDelayRef.current)
    clearTimeout(exitDelayRef.current)
  }, [])

  /** Move a book between the pinned strip and the grid */
  function handleTogglePin(book) {
    if (book.pinned) {
      // Unpin → prepend to grid so it's the first grid book
      setPinnedBooks((prev) => prev.filter((b) => b.id !== book.id))
      setGridBooks((prev) => [{ ...book, pinned: false }, ...prev])
    } else {
      // Pin → append to pinned strip
      setGridBooks((prev) => prev.filter((b) => b.id !== book.id))
      setPinnedBooks((prev) => [{ ...book, pinned: true }, ...prev])
    }
  }

  function handleAdd(book) {
    // Guard: already in the library
    if (libraryBookIds.has(book.id)) return
    setGridBooks((prev) => [{ ...book, pinned: false }, ...prev])
    showToast(book)
  }

  /** Opens the confirmation dialog for a book */
  function handleRemoveRequest(book) {
    clearTimeout(dialogExitTimerRef.current)
    setBookToRemove(book)
    setDialogExiting(false)
    setDialogMounted(true)
  }

  /** Closes the dialog without removing */
  function handleCancelRemove() {
    setDialogExiting(true)
    dialogExitTimerRef.current = setTimeout(() => {
      setDialogMounted(false)
      setDialogExiting(false)
      setBookToRemove(null)
    }, 200)
  }

  /** Confirms removal — removes the book and shows the removal toast */
  function handleConfirmRemove() {
    if (!bookToRemove) return
    const book = bookToRemove

    // Close dialog immediately (no exit animation — the toast provides feedback)
    setDialogMounted(false)
    setDialogExiting(false)
    setBookToRemove(null)

    // Remove from the correct list
    if (book.pinned) {
      setPinnedBooks((prev) => prev.filter((b) => b.id !== book.id))
    } else {
      setGridBooks((prev) => prev.filter((b) => b.id !== book.id))
    }

    showToast(book, 'removed')
  }

  // Clean up dialog exit timer on unmount
  useEffect(() => () => clearTimeout(dialogExitTimerRef.current), [])

  return (
    <>
    {/* Root: fills the full viewport (w-screen h-screen).
        At 1366 × 768 this matches the Figma frame exactly. */}
    <div
      className="flex w-screen h-screen overflow-hidden"
      style={{ background: 'var(--sidebar)' }}
    >
      {/* ── Left sidebar ── */}
      <Sidebar />

      {/* ── Right: navy wrapper + white container ── */}
      <div
        className="relative flex flex-col flex-1 min-w-0 items-start pr-3 py-3 h-full"
        style={{ background: 'var(--sidebar)' }}
      >
        {/* Decorative ellipse (bottom-left of wrapper) */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none"
          style={{
            width: 195,
            height: 335,
            left: 3,
            bottom: 0,
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(74,97,168,0.55) 0%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />

        {/* ── White rounded container ── */}
        <div
          className="relative flex flex-col isolate overflow-hidden rounded-[16px] w-full h-full"
          style={{
            background: 'var(--background)',
            boxShadow: 'var(--shadow-container)',
          }}
        >
          {/* Floating "Ferramentas" button — z-[25] keeps it above the overlay */}
          <div className="absolute bottom-6 right-6 z-[25]">
            <FloatingButton />
          </div>

          {/* ── Top bar ── */}
          <TopBar />

          {/* ── Overlay backdrop — covers everything below TopBar.
               z-[10]: below sticky search row (z-[20]) but above scrolled content.
               main has no z-index so the sticky row's z-[20] competes in the same
               stacking context as this backdrop. ── */}
          {overlayMounted && (
            <div
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 z-[10] cursor-default pointer-events-auto ${isExiting ? 'backdrop-exit' : 'backdrop-enter'}`}
              style={{
                top: '52px',
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50.962%, rgba(0,0,0,0.2) 100%)',
              }}
              onClick={clearSearch}
            />
          )}

          {/* ── Scrollable main content ── */}
          <main
            className="relative flex-1 w-full overflow-x-clip overflow-y-auto min-h-0"
            aria-label="Conteúdo da Biblioteca"
          >
            {/* Banner — first in scroll, disappears as user scrolls down */}
            <AppBanner />

            {/* ── Sticky search + filter row — sticks to top of main after banner scrolls away.
                 No z-index on main means this z-[20] competes directly with the backdrop z-[10]. ── */}
            <div
              ref={stickyRowRef}
              className={`sticky top-0 z-[20] relative w-full ${isOverlayOpen ? '' : 'bg-white'}`}
              style={{ padding: '24px 24px 20px' }}
            >
              <SearchBar
                query={query}
                onQueryChange={setQuery}
                onClear={clearSearch}
                inputRef={searchInputRef}
                containerRef={searchBarRef}
                isOpen={isOverlayOpen}
                filters={filters}
                onFilterToggle={handleFilterToggle}
                onClearFilters={handleClearFilters}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
              />

              {/* ── Catalogue dialog — absolute child of the sticky row so it follows it.
                   top: calc(100% + 8px) = 60 px (row height) + 8 px gap = 68 px,
                   which maps to the same visual position as the old top: 156 px / 120 px. ── */}
              {overlayMounted && (
                <div style={overlayFixedStyle}>
                  <SearchOverlay
                    query={debouncedQuery}
                    rawQuery={query}
                    catalogue={CATALOGUE}
                    addedIds={libraryBookIds}
                    onAdd={handleAdd}
                    onClose={clearSearch}
                    isExiting={isExiting}
                    openCount={openCount}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 items-start px-6 pt-0 pb-6 w-full">

              {hasActiveFilters ? (
                /* ── Filtered view — all matching books in one unified grid, same size ── */
                <section aria-label="Manuais filtrados" className="w-full">
                  {visiblePinnedBooks.length === 0 && visibleGridBooks.length === 0 ? (
                    <FilterEmptyState
                      onSearchFocus={() => searchInputRef.current?.focus()}
                    />
                  ) : (
                    <div
                      className="grid w-full items-end"
                      style={{ gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(max(155px, calc((100% - 112px) / 8)), 1fr))' }}
                    >
                      {[...visiblePinnedBooks, ...visibleGridBooks].map((book) => (
                        <BookCard
                          key={book.id}
                          cover={book.cover}
                          title={book.title}
                          grade={book.grade}
                          pinned={book.pinned}
                          onPinToggle={() => handleTogglePin(book)}
                          onRemove={() => handleRemoveRequest(book)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                <>
                  {/* ── Pinned books — fixed 125px wide, bottom-aligned ── */}
                  <section aria-label="Manuais fixados">
                    <div className="flex gap-4 items-end">
                      {visiblePinnedBooks.map((book) => (
                        <BookCard
                          key={book.id}
                          cover={book.cover}
                          title={book.title}
                          grade={book.grade}
                          pinned
                          width={125}
                          onPinToggle={() => handleTogglePin(book)}
                          onRemove={() => handleRemoveRequest(book)}
                        />
                      ))}
                    </div>
                  </section>

                  {/* ── All books grid — responsive 6–8 columns, bottom-aligned ── */}
                  <section aria-label="Todos os manuais" className="w-full">
                    <div
                      className="grid w-full items-end"
                      style={{ gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(max(155px, calc((100% - 112px) / 8)), 1fr))' }}
                    >
                      {visibleGridBooks.map((book) => (
                        <BookCard
                          key={book.id}
                          cover={book.cover}
                          title={book.title}
                          grade={book.grade}
                          pinned={false}
                          onPinToggle={() => handleTogglePin(book)}
                          onRemove={() => handleRemoveRequest(book)}
                        />
                      ))}
                    </div>
                  </section>
                </>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>

    {/* ── Toast portal ────────────────────────────────────────────────────
         The aria-live region is always in the DOM so screen readers register
         it before any content appears. The Toast is conditionally mounted
         inside it. createPortal escapes any overflow-hidden ancestor.
    ─────────────────────────────────────────────────────────────────────── */}
    {createPortal(
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="fixed bottom-6 right-6 z-[200] pointer-events-none"
      >
        {toastMounted && toastBook && (
          <div className="pointer-events-auto">
            <Toast
              book={toastBook}
              type={toastType}
              isExiting={toastExiting}
              onDismiss={dismissToast}
            />
          </div>
        )}
      </div>,
      document.body,
    )}

    {/* ── Confirm-remove dialog portal ── */}
    {dialogMounted && bookToRemove && (
      <ConfirmRemoveDialog
        book={bookToRemove}
        onCancel={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        isExiting={dialogExiting}
      />
    )}
    </>
  )
}
