import { Zap, ArrowLeft } from 'lucide-react'
import './HeroSection.css'

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__bg-image" />
      <div className="hero__bg-overlay" />

      <div className="container hero__inner">
        <div className="hero__tag">
          <Zap size={14} />
          <span>گیم‌نت حرفه‌ای قشم</span>
        </div>

        <h1 className="hero__title">
          <span className="hero__title-en">PIXEL</span>
          <span className="hero__title-divider"> — </span>
          <span className="hero__title-fa">گارد</span>
        </h1>

        <p className="hero__subtitle">
          بهترین تجربه بازی رو با بهترین طعم‌ها ترکیب کن
        </p>

        <div className="hero__stats">
          <div className="stat">
            <span className="stat__num">۵۰+</span>
            <span className="stat__label">آیتم منو</span>
          </div>
          <div className="stat__sep" />
          <div className="stat">
            <span className="stat__num">۴K</span>
            <span className="stat__label">مانیتور گیمینگ</span>
          </div>
          <div className="stat__sep" />
          <div className="stat">
            <span className="stat__num">۲۴/۷</span>
            <span className="stat__label">باز هستیم</span>
          </div>
        </div>

        <a href="#menu" className="hero__cta">
          <span>مشاهده منو</span>
          <ArrowLeft size={18} className="cta__arrow" />
        </a>
      </div>

      <div className="hero__scroll-hint">
        <span />
      </div>
    </section>
  )
}
