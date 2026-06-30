import { ChevronDown } from 'lucide-react'
import './MenuCard.css'

const FALLBACK = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=260&fit=crop&q=80'

export default function MenuCard({ item, onOpen }) {
  const formattedPrice = item.price.toLocaleString('fa-IR')
  const isUnavailable = item.status === 'greyed'

  return (
    <div
      className={`menu-card ${isUnavailable ? 'menu-card--unavailable' : ''}`}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
    >
      {item.badge && !isUnavailable && (
        <span className="menu-card__badge">{item.badge}</span>
      )}
      {isUnavailable && (
        <span className="menu-card__badge menu-card__badge--unavail">ناموجود</span>
      )}

      <div className="menu-card__img-wrap">
        <img
          className="menu-card__img"
          src={item.image}
          alt={item.name}
          loading="lazy"
          onError={e => { e.currentTarget.src = FALLBACK }}
        />
        {!isUnavailable && (
          <div className="menu-card__img-hint">
            <ChevronDown size={16} />
            <span>جزئیات</span>
          </div>
        )}
        {isUnavailable && (
          <div className="menu-card__unavail-overlay">
            <span>موقتاً ناموجود</span>
          </div>
        )}
      </div>

      <div className="menu-card__body">
        <h3 className="menu-card__name">{item.name}</h3>
        <p className="menu-card__desc">{item.description}</p>
      </div>

      <div className="menu-card__footer">
        <span className={`menu-card__price ${isUnavailable ? 'menu-card__price--strike' : ''}`}>
          {formattedPrice}
          <span className="price__unit"> تومان</span>
        </span>
      </div>
    </div>
  )
}
