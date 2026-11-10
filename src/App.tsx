import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/ThemeProvider'
import { NotFoundPage, ScreenPage } from '@/pages/ScreenPage'
import { appScreens } from '@/pages/screens'

export default function App() {
  return (
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
  )
}
