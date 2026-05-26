import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/* ─── book covers ─────────────────────────────────────────────────── */
import book1  from '../assets/images/banner-book-1.jpg'
import book2  from '../assets/images/banner-book-2.jpg'
import book3  from '../assets/images/banner-book-3.jpg'
import book4  from '../assets/images/banner-book-4.jpg'
import mat    from '../assets/images/book-matematica.jpg'
import mat2   from '../assets/images/book-matematica2.jpg'
import mx     from '../assets/images/book-mx.jpg'
import port   from '../assets/images/book-portugues.jpg'
import eco    from '../assets/images/book-economia.jpg'
import bio    from '../assets/images/book-biologia.jpg'
import fis    from '../assets/images/book-fisica.jpg'
import tic    from '../assets/images/book-tic.jpg'
import cn8    from '../assets/images/book-ciencias-8.jpg'
import cn9    from '../assets/images/book-ciencias-9.jpg'
import esp    from '../assets/images/book-espanhol.jpg'
import suc    from '../assets/images/book-sucesso.jpg'
import m12a   from '../assets/images/cat-mat-a-12ano-a.jpg'
import m12b   from '../assets/images/cat-mat-a-12ano-b.jpg'
import m12c   from '../assets/images/cat-mat-a-12ano-c.jpg'
import m11    from '../assets/images/cat-mat-a-11ano.jpg'
import m10    from '../assets/images/cat-mat-a-10ano.jpg'
import odyss  from '../assets/images/book-odyssey.jpg'

const BOOKS = [
  { id: 1,  cover: book1, title: 'Máximo 12',        grade: '12º ano' },
  { id: 2,  cover: book2, title: 'Matemática 360',   grade: '12º ano' },
  { id: 3,  cover: book3, title: 'Espiral',          grade: '12º ano' },
  { id: 4,  cover: book4, title: 'MX Pro',           grade: '12º ano' },
  { id: 5,  cover: mat,   title: 'Matemática A',     grade: '11º ano' },
  { id: 6,  cover: mat2,  title: 'Matemática A',     grade: '10º ano' },
  { id: 7,  cover: mx,    title: 'MX',               grade: '7º ano'  },
  { id: 8,  cover: port,  title: 'Português',        grade: '11º ano' },
  { id: 9,  cover: eco,   title: 'Economia C',       grade: '12º ano' },
  { id: 10, cover: odyss, title: 'Odisseia',         grade: '10º ano' },
  { id: 11, cover: bio,   title: 'Biologia',         grade: '12º ano' },
  { id: 12, cover: fis,   title: 'Física',           grade: '11º ano' },
  { id: 13, cover: tic,   title: 'TIC',              grade: '9º ano'  },
  { id: 14, cover: cn8,   title: 'Ciências Naturais',grade: '8º ano'  },
  { id: 15, cover: cn9,   title: 'Ciências Naturais',grade: '9º ano'  },
  { id: 16, cover: esp,   title: 'Espanhol',         grade: '8º ano'  },
  { id: 17, cover: suc,   title: 'Sucesso',          grade: '10º ano' },
  { id: 18, cover: m12a,  title: 'Matemática A',     grade: '12º ano' },
  { id: 19, cover: m12b,  title: 'Matemática A',     grade: '12º ano' },
  { id: 20, cover: m12c,  title: 'Matemática A',     grade: '12º ano' },
  { id: 21, cover: m11,   title: 'Matemática A',     grade: '11º ano' },
  { id: 22, cover: m10,   title: 'Matemática A',     grade: '10º ano' },
]

/* ─── simple card (no action buttons) ─────────────────────────────── */
function ModalBookCard({ cover, title, grade }) {
  return (
    <div
      className="flex flex-col gap-2 items-start cursor-pointer group transition-transform duration-200 ease-out hover:-translate-y-1.5 min-w-0"
    >
      <div
        className="relative w-full rounded-[4px] overflow-hidden"
        style={{
          aspectRatio: '125 / 166',
          boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.38), 0px 4px 4px 0px rgba(70,67,62,0.16)',
        }}
      >
        <img
          src={cover}
          alt={`Capa do livro ${title}`}
          className="block w-full h-full object-cover"
          draggable={false}
        />
        {/* Spine gloss */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 91.5%, rgba(0,0,0,0.1) 94.1%, rgba(255,255,255,0.16) 94.5%, rgba(0,0,0,0.06) 95.3%, rgba(0,0,0,0.04) 97.4%, rgba(255,255,255,0) 100%)',
          }}
        />
        {/* Hover highlight */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-colors duration-200" />
      </div>
      <div className="flex flex-col w-full">
        <span className="text-[14px] font-medium leading-5 text-[#111820] truncate">{title}</span>
        <span className="text-[14px] font-normal leading-5 text-[#535353]">{grade}</span>
      </div>
    </div>
  )
}

/* ─── modal ────────────────────────────────────────────────────────── */
export default function NovosProjetosModal({ onClose, containerRef }) {
  /* Measure white container so the backdrop + panel stay inside it */
  const [wrapperStyle, setWrapperStyle] = useState({
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  })

  useEffect(() => {
    function compute() {
      if (!containerRef?.current) return
      const r = containerRef.current.getBoundingClientRect()
      setWrapperStyle({
        position: 'fixed',
        top:    r.top,
        left:   r.left,
        right:  window.innerWidth  - r.right,
        bottom: window.innerHeight - r.bottom,
        borderRadius: '16px',
        overflow: 'hidden',
      })
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [containerRef])

  /* Close on Escape */
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div style={{ ...wrapperStyle, zIndex: 50 }} className="flex items-center justify-center">
      {/* Backdrop — covers only the white container */}
      <div
        className="absolute inset-0 bg-black/[0.7]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative flex flex-col bg-white rounded-[14px] border border-[#d8d8d7] overflow-hidden"
        style={{
          width: 818,
          height: 608,
          boxShadow: '0px 8px 32px 0px rgba(0,0,0,0.12), 0px 2px 8px 0px rgba(0,0,0,0.08)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Novos projetos"
      >
        {/* ── Header ── */}
        <div className="relative flex-shrink-0 px-4 pt-4 pb-3">
          <h2 className="text-[18px] font-medium leading-7 text-[#0a0a0a]">
            Novos projetos
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex items-center justify-center w-6 h-6 rounded-[4px] text-[#0a0a0a]/70 hover:text-[#0a0a0a] hover:bg-black/5 transition-colors duration-100"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* ── Scrollable grid ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
          <div className="grid grid-cols-5 gap-4">
            {BOOKS.map(book => (
              <ModalBookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
