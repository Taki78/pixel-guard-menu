import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__glow" />
      <div className="container footer__inner">

        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-icon">PX</span>
            <div>
              <p className="footer__logo-name">پیکسل گارد</p>
              <p className="footer__logo-sub">Gaming Cafe</p>
            </div>
          </div>
          <p className="footer__desc">
            بهترین تجربه گیمینگ با فضای حرفه‌ای، تجهیزات پیشرفته و منوی اختصاصی
          </p>
        </div>

        <div className="footer__info">
          <h4 className="footer__col-title">اطلاعات تماس</h4>
          <ul className="footer__list">
            <li><MapPin size={15} /> قشم، برج‌های دوقلو اپادانا، بلوک ب</li>
            <li><Phone size={15} /> ۰۲۱-۱۲۳۴۵۶۷۸</li>
            <li><Clock size={15} /> ۲۴ ساعته — ۷ روز هفته</li>
            <li><Mail size={15} /> info@pixelguard.ir</li>
          </ul>
        </div>

        <div className="footer__links">
          <h4 className="footer__col-title">دسترسی سریع</h4>
          <ul className="footer__list">
            <li><a href="#menu">منوی کامل</a></li>
            <li><a href="#about">درباره ما</a></li>
            <li><a href="#contact">رزرو میز</a></li>
            <li><a href="#contact">تماس با ما</a></li>
          </ul>
        </div>

      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© ۱۴۰۴ پیکسل گارد — تمام حقوق محفوظ است</p>
          <div className="footer__socials">
            <a href="#" aria-label="اینستاگرام">IG</a>
            <a href="#" aria-label="تلگرام">TG</a>
            <a href="#" aria-label="توییتر">TW</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
