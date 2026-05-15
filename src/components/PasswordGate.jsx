import { useState } from 'react'

const CORRECT = 'pixelmatters-portoeditora-2026'
const SESSION_KEY = 'ev_proto_auth'

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1',
  )
  const [value, setValue] = useState('')
  const [error, setError]  = useState(false)

  if (unlocked) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (value === CORRECT) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div
      className="flex items-center justify-center w-screen h-screen"
      style={{ background: 'var(--sidebar)' }}
    >
      <div
        className="flex flex-col gap-6 rounded-[16px] p-8"
        style={{
          width: 360,
          background: '#ffffff',
          boxShadow: '0px 20px 40px rgba(0,0,0,0.2)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col gap-1">
          <p className="text-[18px] font-semibold text-[#080c10] leading-snug">
            Protótipo restrito
          </p>
          <p className="text-[14px] text-[#535353] leading-5">
            Insira a palavra-passe para aceder.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="proto-password"
              className="text-[13px] font-medium text-[#080c10]"
            >
              Palavra-passe
            </label>
            <input
              id="proto-password"
              type="password"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false) }}
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="h-9 rounded-[8px] px-3 text-[14px] outline-none transition-[box-shadow] duration-150"
              style={{
                border: error ? '1px solid #dc2626' : '1px solid var(--input)',
                boxShadow: error
                  ? '0 0 0 3px rgba(220,38,38,0.12)'
                  : undefined,
              }}
            />
            {error && (
              <p className="text-[13px] text-[#dc2626]">
                Palavra-passe incorreta. Tente novamente.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="h-9 rounded-[8px] text-[14px] font-medium text-white transition-opacity duration-100 hover:opacity-90"
            style={{ background: 'var(--sidebar)' }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
