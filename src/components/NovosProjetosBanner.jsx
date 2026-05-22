import bgPattern    from '../assets/images/banner-bg-pattern.png'
import ellipse      from '../assets/images/banner-ellipse.png'
import bookOverlay  from '../assets/images/banner-book-overlay.png'
import book1        from '../assets/images/banner-book-1.jpg'
import book2        from '../assets/images/banner-book-2.jpg'
import book3        from '../assets/images/banner-book-3.jpg'
import book4        from '../assets/images/banner-book-4.jpg'
import { ArrowRight } from 'lucide-react'

function BookCover({ src, rotation, zIndex }) {
  return (
    <div
      className="relative shrink-0 w-[143px]"
      style={{ marginRight: '-15px', zIndex }}
    >
      <div style={{ transform: `rotate(${rotation}deg)` }}>
        <div
          className="relative rounded-[5px] overflow-hidden"
          style={{
            aspectRatio: '271 / 360',
            boxShadow: '0px 1.25px 5.9px 0px rgba(0,0,0,0.08), 0px 5px 11.8px 0px rgba(70,67,62,0.18)',
          }}
        >
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Multiply overlay (page texture) */}
          <img
            src={bookOverlay}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
          />
          {/* Spine highlight */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(270deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 91.5%, rgba(0,0,0,0.10) 94.1%, rgba(255,255,255,0.16) 94.5%, rgba(0,0,0,0.06) 95.3%, rgba(0,0,0,0.04) 97.4%, rgba(255,255,255,0) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function NovosProjetosBanner() {
  return (
    <div
      className="relative w-full rounded-[16px] overflow-hidden shrink-0"
      style={{
        background: '#161532',
        boxShadow:
          '0px 5px 6px 0px rgba(18,33,93,0.09), 0px 1px 2px 0px rgba(6,6,22,0.20)',
        height: 240,
      }}
    >
      {/* ── Left background pattern ── */}
      <img
        src={bgPattern}
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ width: 381, height: 400, left: -120, top: -83 }}
      />

      {/* ── Decorative ellipse glow (mid-right) ── */}
      <img
        src={ellipse}
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          width: 521,
          height: 144,
          left: 525,
          top: 117,
          filter: 'blur(10px)',
        }}
      />

      {/* ── Text + CTA (left column) ── */}
      <div className="relative z-10 flex flex-col gap-4 p-6 h-full justify-center" style={{ maxWidth: 460 }}>
        {/* Pill label */}
        <div
          className="self-start px-2 py-0.5 rounded-full text-white uppercase text-[12px] font-medium leading-6"
          style={{
            background: '#dc2626',
            boxShadow: '0px 2px 2px 0px rgba(8,12,16,0.14)',
            letterSpacing: '0.02em',
          }}
        >
          Novos projetos
        </div>

        {/* Heading + body */}
        <div className="flex flex-col gap-1">
          <p className="text-white font-medium text-[22px] leading-7">
            Ano Letivo 2026
          </p>
          <p className="text-white/80 font-normal text-[16px] leading-6">
            Conheça os 24 manuais que chegam em setembro e prepare a sua escolha.
          </p>
        </div>

        {/* CTA button */}
        <button
          className="self-start flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] text-[14px] font-medium text-[#080c10] transition-colors duration-100"
          style={{
            background: '#f6f6f5',
            boxShadow:
              '0px 1px 1.5px 0px rgba(8,12,16,0.14), inset 0px -1px 1px 0px rgba(146,146,145,0.2)',
          }}
        >
          <span>Ver todos</span>
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      {/* ── Book covers (right side) ── */}
      <div
        className="absolute flex items-end"
        style={{ right: 32, bottom: 0, top: 0, alignItems: 'flex-end', paddingBottom: 18 }}
      >
        <BookCover src={book1} rotation={-2} zIndex={1} />
        <BookCover src={book2} rotation={-1} zIndex={2} />
        <BookCover src={book3} rotation={2}  zIndex={3} />
        <BookCover src={book4} rotation={2}  zIndex={4} />
      </div>
    </div>
  )
}
