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
    if (path === '/novosprojetos') return <NovosProjetosPage />
    return <BibliotecaPage />
  }

  return (
    <PasswordGate>
      {renderPage()}
    </PasswordGate>
  )
}
