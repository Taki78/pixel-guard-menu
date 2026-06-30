import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, UtensilsCrossed, FolderKanban, LogOut, Menu, X,
  TrendingUp, Eye, EyeOff, CircleSlash, ShieldCheck, ChevronLeft
} from 'lucide-react'
import AdminLogin from '../components/admin/AdminLogin'
import ItemsTable from '../components/admin/ItemsTable'
import CategoriesManager from '../components/admin/CategoriesManager'
import { useItemStore } from '../store/ItemStoreContext'
import './AdminPage.css'

const NAV = [
  { id: 'dashboard',  label: 'داشبورد',           icon: LayoutDashboard },
  { id: 'items',      label: 'مدیریت آیتم‌ها',    icon: UtensilsCrossed },
  { id: 'categories', label: 'مدیریت دسته‌بندی‌ها', icon: FolderKanban   },
]

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('px_admin') === '1')
  const [view, setView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function login() {
    sessionStorage.setItem('px_admin', '1')
    setAuthed(true)
  }

  function logout() {
    sessionStorage.removeItem('px_admin')
    setAuthed(false)
  }

  if (!authed) return <AdminLogin onSuccess={login} />

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">PX</span>
          <div>
            <p className="sidebar__logo-name">پیکسل گارد</p>
            <p className="sidebar__logo-sub">Admin Panel</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          {NAV.map(n => {
            const Icon = n.icon
            return (
              <button
                key={n.id}
                className={`sidebar__link ${view === n.id ? 'sidebar__link--active' : ''}`}
                onClick={() => { setView(n.id); setSidebarOpen(false) }}
              >
                <Icon size={18} />
                <span>{n.label}</span>
                {view === n.id && <ChevronLeft size={14} className="sidebar__arrow" />}
              </button>
            )
          })}
        </nav>

        <div className="sidebar__footer">
          <Link to="/" className="sidebar__menu-link">
            <Eye size={16} />
            <span>مشاهده منو</span>
          </Link>
          <button className="sidebar__logout" onClick={logout}>
            <LogOut size={16} />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(s => !s)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="topbar-title">
            {NAV.find(n => n.id === view)?.label}
          </h1>
          <div className="topbar-badge">
            <ShieldCheck size={14} />
            <span>ادمین</span>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {view === 'dashboard'  && <Dashboard setView={setView} />}
          {view === 'items'      && <ItemsTable />}
          {view === 'categories' && <CategoriesManager />}
        </div>
      </div>
    </div>
  )
}

function Dashboard({ setView }) {
  const { allItems } = useItemStore()

  const total     = allItems.length
  const available = allItems.filter(i => i.status === 'available').length
  const greyed    = allItems.filter(i => i.status === 'greyed').length
  const hidden    = allItems.filter(i => i.status === 'hidden').length

  const cats = {}
  allItems.forEach(i => { cats[i.category] = (cats[i.category] || 0) + 1 })

  const catLabels = { hot: 'نوشیدنی گرم', cold: 'نوشیدنی سرد', energy: 'انرژی‌زا', sandwich: 'ساندویچ', snack: 'اسنک', dessert: 'دسر' }

  return (
    <div className="dashboard">
      <div className="dash-cards">
        <div className="dash-card">
          <TrendingUp size={22} className="dc-icon dc-icon--blue" />
          <div className="dc-body">
            <span className="dc-num">{total}</span>
            <span className="dc-label">کل آیتم‌ها</span>
          </div>
        </div>
        <div className="dash-card">
          <Eye size={22} className="dc-icon dc-icon--green" />
          <div className="dc-body">
            <span className="dc-num dc-num--green">{available}</span>
            <span className="dc-label">موجود در منو</span>
          </div>
        </div>
        <div className="dash-card">
          <CircleSlash size={22} className="dc-icon dc-icon--orange" />
          <div className="dc-body">
            <span className="dc-num dc-num--orange">{greyed}</span>
            <span className="dc-label">ناموجود (خاکستری)</span>
          </div>
        </div>
        <div className="dash-card">
          <EyeOff size={22} className="dc-icon dc-icon--red" />
          <div className="dc-body">
            <span className="dc-num dc-num--red">{hidden}</span>
            <span className="dc-label">مخفی از منو</span>
          </div>
        </div>
      </div>

      <div className="dash-bottom">
        <div className="dash-section">
          <h2 className="dash-section__title">توزیع دسته‌بندی‌ها</h2>
          <div className="cat-bars">
            {Object.entries(cats).map(([cat, count]) => (
              <div key={cat} className="cat-bar">
                <span className="cat-bar__label">{catLabels[cat] || cat}</span>
                <div className="cat-bar__track">
                  <div className="cat-bar__fill" style={{ width: `${(count / total) * 100}%` }} />
                </div>
                <span className="cat-bar__count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-section">
          <h2 className="dash-section__title">دسترسی سریع</h2>
          <div className="quick-actions">
            <button className="qa-btn" onClick={() => setView('items')}>
              <UtensilsCrossed size={20} />
              <span>مدیریت آیتم‌ها</span>
            </button>
            <button className="qa-btn qa-btn--blue" onClick={() => setView('categories')}>
              <FolderKanban size={20} />
              <span>مدیریت دسته‌بندی‌ها</span>
            </button>
            <Link to="/" className="qa-btn qa-btn--outline">
              <Eye size={20} />
              <span>مشاهده منو مشتری</span>
            </Link>
          </div>

          <div className="dash-tip">
            <ShieldCheck size={14} />
            <p>برای تغییر وضعیت آیتم‌ها به صفحه «مدیریت آیتم‌ها» بروید. تغییرات فوری در منوی مشتری اعمال می‌شوند.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
