import BibliotecaPage from './components/BibliotecaPage'
import PasswordGate from './components/PasswordGate'

export default function App() {
  return (
    <PasswordGate>
      <BibliotecaPage />
    </PasswordGate>
  )
}
