import { X } from 'lucide-react'
import iconEv from '../assets/images/icon-ev.png'
import badgeApple from '../assets/images/badge-apple.png'
import badgeGoogle from '../assets/images/badge-google.png'

export default function AppBanner({ onClose }) {
  return (
    <div
      className="relative shrink-0 w-full h-9 z-[22]"
      style={{
        background: 'linear-gradient(90deg, #fff6ed 0%, #e7f8ff 100%)',
        boxShadow: '0px 2px 4px 0px rgba(8,12,16,0.14)',
      }}
    >
      <div className="flex gap-3 items-center px-3 py-1.5 size-full">
        {/* EV Smart Book icon */}
        <img
          src={iconEv}
          alt=""
          aria-hidden="true"
          className="shrink-0 size-5 object-cover"
        />

        {/* Promo text */}
        <div className="flex flex-1 min-w-0 items-center justify-between">
          <p
            className="text-[14px] font-normal leading-5 whitespace-nowrap"
            style={{ color: 'var(--card-foreground)', fontFamily: 'Geist, var(--font-default)' }}
          >
            Descarregue a aplicação{' '}
            <span className="font-medium underline decoration-solid">
              EV Smart Book
            </span>{' '}
            e tenha os seus livros sempre disponíveis em qualquer dispositivo.
          </p>

          {/* Store badges */}
          <div className="flex gap-1.5 items-end shrink-0 ml-4">
            <img
              src={badgeApple}
              alt="Disponível na App Store"
              className="h-4 w-auto object-contain"
            />
            <img
              src={badgeGoogle}
              alt="Disponível no Google Play"
              className="size-3.5 object-contain"
            />
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar aviso"
          className="shrink-0 flex items-center justify-center size-7 rounded-full transition-colors duration-100 hover:bg-black/8"
        >
          <X size={16} strokeWidth={1.75} aria-hidden="true" className="text-[#080c10]" />
        </button>
      </div>
    </div>
  )
}
