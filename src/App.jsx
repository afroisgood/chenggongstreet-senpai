import { HashRouter, Routes, Route } from 'react-router-dom'
import { ParticipantProvider } from './context/ParticipantContext'
import FrontStage from './pages/FrontStage'
import Interactive from './pages/Interactive'
import Admin from './pages/Admin'

// 使用 HashRouter：GitHub Pages 是純靜態主機，QR code 直接連到 /#/join
// 這種深層路徑不會被伺服器端改寫，用 hash routing 可以避免 404。
export default function App() {
  return (
    <HashRouter>
      <ParticipantProvider>
        <Routes>
          <Route path="/" element={<FrontStage />} />
          <Route path="/join" element={<Interactive />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </ParticipantProvider>
    </HashRouter>
  )
}
