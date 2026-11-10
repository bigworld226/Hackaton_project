import { useTheme } from '@/hooks/useTheme'

export default function App() {
  useTheme()

  return (
    <main className="app-shell flex items-center justify-center">
      <h1 className="text-3xl font-semibold">Projet Hackaton</h1>
    </main>
  )
}
