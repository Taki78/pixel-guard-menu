import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <div className="header__logo">
          <span className="logo__icon">PX</span>
          <div className="logo__text">
            <span className="logo__name">پیکسل گارد</span>
            <span className="logo__sub">Gaming Cafe</span>
          </div>
        </div>

        <nav className="header__nav">
          <a href="#menu" className="nav__link">منو</a>
          <a href="#about" className="nav__link">درباره ما</a>
          <a href="#contact" className="nav__link">تماس</a>
        </nav>

        <div className="header__actions">
          <div className="header__badge">
            <span className="pulse" />
            <span>آنلاین</span>
          </div>
          <Link to="/admin" className="header__admin-btn" title="پنل مدیریت">
            <Settings size={16} />
          </Link>
        </div>
      </div>
    </header>
  )
}
