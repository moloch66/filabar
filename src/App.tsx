import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import JoinQueue from './pages/JoinQueue'
import WaitingRoom from './pages/WaitingRoom'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinQueue />} />
        <Route path="/fila" element={<WaitingRoom />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
