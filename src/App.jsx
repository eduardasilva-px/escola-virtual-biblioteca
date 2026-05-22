import { useState, useEffect } from 'react'
import BibliotecaPage from './components/BibliotecaPage'
import NovosProjetosPage from './components/NovosProjetosPage'
import PasswordGate from './components/PasswordGate'

function usePathname() {
  const [path, setPath] = useState(() => window.location.pathname)
  useEffect(() => {
    const handler = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])
  return path
}

export default function App() {
  const path = usePathname()

  function renderPage() {
    if (path === '/' || path === '') {
      window.history.replaceState(null, '', '/biblioteca')
      return <BibliotecaPage />
    }
    if (path === '/novosprojetos') return <NovosProjetosPage />
    if (path === '/biblioteca') return <BibliotecaPage />
    // fallback
    window.history.replaceState(null, '', '/biblioteca')
    return <BibliotecaPage />
  }

  return (
    <PasswordGate>
      {renderPage()}
    </PasswordGate>
  )
}
