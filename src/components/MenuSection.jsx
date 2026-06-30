import { useState, useEffect, useRef } from 'react'
import {
  Gamepad2, Coffee, GlassWater, Zap, Sandwich, ChefHat, IceCream,
  Pizza, Cookie, Salad, Beef, Fish, CupSoda, Soup, Wine,
  Apple, Cherry, Popcorn, Flame, Star, Layers,
} from 'lucide-react'
import { useItemStore } from '../store/ItemStoreContext'
import MenuCard from './MenuCard'
import ItemDrawer from './ItemDrawer'
import './MenuSection.css'

const ICONS = {
  Gamepad2, Coffee, GlassWater, Zap, Sandwich, ChefHat, IceCream,
  Pizza, Cookie, Salad, Beef, Fish, CupSoda, Soup, Wine,
  Apple, Cherry, Popcorn, Flame, Star, Layers,
}

export default function MenuSection() {
  const { allItems, allCategories } = useItemStore()
  const [active, setActive] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  // Track whether WE pushed a drawer entry — prevents interference with React Router navigation
  const drawerPushed = useRef(false)

  function openItem(item) {
    setSelectedItem(item)
    window.history.pushState({ drawerOpen: true }, '')
    drawerPushed.current = true
  }

  function closeItem() {
    if (drawerPushed.current) {
      drawerPushed.current = false
      window.history.back()   // triggers popstate → setSelectedItem(null)
    } else {
      setSelectedItem(null)
    }
  }

  useEffect(() => {
    function onPopState() {
      // Only act if WE are the ones who pushed this drawer state
      if (drawerPushed.current) {
        drawerPushed.current = false
        setSelectedItem(null)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      // Clean up: if drawer was open when component unmounts (route change), pop the entry
      if (drawerPushed.current) {
        drawerPushed.current = false
        window.history.back()
      }
    }
  }, [])

  // hide items with status='hidden', show rest (including greyed)
  const visible = allItems.filter(item => item.status !== 'hidden')

  const filtered = active === 'all'
    ? visible
    : visible.filter(item => item.category === active)

  return (
    <section className="menu-section" id="menu">
      <div className="container">
        <div className="menu-section__header">
          <h2 className="section__title">
            <span className="title__line" />
            منوی ما
            <span className="title__line" />
          </h2>
          <p className="section__sub">بهترین نوشیدنی‌ها و خوراکی‌ها برای بهترین گیم‌پلی</p>
        </div>

        <div className="menu-section__tabs" role="tablist">
          {allCategories.map(cat => {
            const Icon = ICONS[cat.iconName]
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={active === cat.id}
                className={`tab ${active === cat.id ? 'tab--active' : ''}`}
                onClick={() => setActive(cat.id)}
              >
                {Icon && <Icon size={15} />}
                <span className="tab__label">{cat.label}</span>
              </button>
            )
          })}
        </div>

        <p className="menu-section__count">
          <span>{filtered.length}</span> آیتم
        </p>

        <div className="menu-grid">
          {filtered.map(item => (
            <MenuCard
              key={item.id}
              item={item}
              onOpen={() => openItem(item)}
            />
          ))}
        </div>
      </div>

      {selectedItem && (
        <ItemDrawer
          item={selectedItem}
          onClose={closeItem}
        />
      )}
    </section>
  )
}
