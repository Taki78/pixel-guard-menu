import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import MenuSection from './components/MenuSection'
import Footer from './components/Footer'
import AdminPage from './pages/AdminPage'

function CustomerSite() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <MenuSection />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"      element={<CustomerSite />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
