import { useEffect } from 'react' // 1. Ajoute useEffect
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/hooks/AuthProvider'
import { ThemeProvider } from '@/hooks/ThemeProvider'
import { NotFoundPage, ScreenPage } from '@/pages/ScreenPage'
import { appScreens } from '@/pages/screens'
import { supabase } from './lib/supabase' // 2. Importe ton client supabase (ajuste le chemin "../" si besoin)

export default function App() {
  // 3. Ajoute ce test de connexion au lancement de l'application
  useEffect(() => {
    async function testConnection() {
      try {
        console.log("🔄 Tentative de connexion à Supabase...")
        const { data, error } = await supabase.from('profiles').select('*')
        
        if (error) {
          console.error("❌ Erreur SQL Supabase :", error.message, error.details, error.hint)
        } else {
          console.log("✅ SUCCÈS ! Données de la table profiles :", data)
        }
      } catch (err) {
        console.error("❌ Exception attrapée :", err)
      }
    }

    testConnection()
  }, [])

  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Navigate replace to="/welcome" />} path="/" />
            {appScreens.map((screen) => (
              <Route
                element={<ScreenPage screen={screen} />}
                key={screen.path}
                path={screen.path}
              />
            ))}
            <Route element={<NotFoundPage />} path="*" />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}