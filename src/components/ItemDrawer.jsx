import { useEffect } from 'react'
import { X, Clock, Flame, Thermometer, FlaskConical, AlertTriangle } from 'lucide-react'
import './ItemDrawer.css'

const FALLBACK = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop&q=80'

export default function ItemDrawer({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!item) return null
  const { details } = item
  const price = item.price.toLocaleString('fa-IR')
  const isUnavailable = item.status === 'greyed'

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />

      <div className="drawer" role="dialog" aria-modal="true" aria-label={item.name}>
        <button className="drawer__close" onClick={onClose} aria-label="بستن">
          <X size={20} />
        </button>

        <div className="drawer__img-wrap">
          <img
            src={item.image}
            alt={item.name}
            className={`drawer__img ${isUnavailable ? 'drawer__img--grey' : ''}`}
            onError={e => { e.currentTarget.src = FALLBACK }}
          />
          <div className="drawer__img-overlay" />
          {isUnavailable
            ? <span className="drawer__badge drawer__badge--unavail">موقتاً ناموجود</span>
            : item.badge && <span className="drawer__badge">{item.badge}</span>
          }
        </div>

        <div className="drawer__body">
          <h2 className="drawer__name">{item.name}</h2>
          <p className="drawer__desc">{details.fullDesc}</p>

          <div className="drawer__meta">
            <div className="meta-chip">
              <Flame size={14} />
              <span>{details.calories} کالری</span>
            </div>
            <div className="meta-chip">
              <Clock size={14} />
              <span>{details.prepTime}</span>
            </div>
            <div className="meta-chip">
              <Thermometer size={14} />
              <span>{details.temp}</span>
            </div>
            {details.volume !== '—' && (
              <div className="meta-chip">
                <FlaskConical size={14} />
                <span>{details.volume}</span>
              </div>
            )}
          </div>

          {details.ingredients?.length > 0 && (
            <div className="drawer__section">
              <h3 className="drawer__section-title">مواد تشکیل‌دهنده</h3>
              <ul className="drawer__ingredients">
                {details.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {details.allergens?.length > 0 && (
            <div className="drawer__section drawer__allergens">
              <AlertTriangle size={15} className="allergen-icon" />
              <div>
                <h3 className="drawer__section-title">آلرژن‌ها</h3>
                <p>{details.allergens.join(' · ')}</p>
              </div>
            </div>
          )}
        </div>

        <div className="drawer__footer">
          <span className={`drawer__price ${isUnavailable ? 'drawer__price--strike' : ''}`}>
            {price}
            <span className="drawer__price-unit"> تومان</span>
          </span>
          {isUnavailable && (
            <span className="drawer__unavail-note">این آیتم موقتاً ناموجود است</span>
          )}
        </div>
      </div>
    </>
  )
}
