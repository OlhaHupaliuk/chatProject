import './App.css'
import MainPage from './pages/MainPage'
import AuthPage from './pages/AuthPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<MainPage />} />
        <Route path='/auth' element={<AuthPage />} />
      </Routes>
    </Router>
  )
}

export default App
