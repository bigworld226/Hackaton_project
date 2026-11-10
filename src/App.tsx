import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { NotFoundPage, ScreenPage } from '@/pages/ScreenPage'
import { appScreens } from '@/pages/screens'

export default function App() {
  useTheme()

  return (
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
  )
}
