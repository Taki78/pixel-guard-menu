import { useState } from 'react'
import { Search, Pencil, Trash2, Eye, EyeOff, CircleSlash, CheckCircle2, Plus } from 'lucide-react'
import { useItemStore } from '../../store/ItemStoreContext'
import ItemFormModal from './ItemFormModal'
import './ItemsTable.css'

const STATUS_CONFIG = {
  available: { label: 'موجود',    icon: CheckCircle2,  cls: 'status--available' },
  greyed:    { label: 'ناموجود',  icon: CircleSlash,   cls: 'status--greyed'    },
  hidden:    { label: 'مخفی',     icon: EyeOff,        cls: 'status--hidden'    },
}

// CAT_LABELS built dynamically from store in component

export default function ItemsTable() {
  const { allItems, allCategories, setItemStatus, updateItem, addItem, deleteItem } = useItemStore()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editItem, setEditItem] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const CAT_LABELS = Object.fromEntries(allCategories.map(c => [c.id, c.label]))

  const filtered = allItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || item.category === catFilter
    const matchStatus = statusFilter === 'all' || item.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  function handleSaveEdit(fields) {
    updateItem(editItem.id, fields)
    setEditItem(null)
  }

  function handleAdd(fields) {
    addItem(fields)
    setShowAdd(false)
  }

  function handleDelete(id) {
    deleteItem(id)
    setConfirmDelete(null)
  }

  const stats = {
    total: allItems.length,
    available: allItems.filter(i => i.status === 'available').length,
    greyed: allItems.filter(i => i.status === 'greyed').length,
    hidden: allItems.filter(i => i.status === 'hidden').length,
  }

  return (
    <div className="items-table-page">
      {/* Summary strip */}
      <div className="items-stats">
        <button className={`istat ${statusFilter === 'all' ? 'istat--active' : ''}`} onClick={() => setStatusFilter('all')}>
          <span className="istat__num">{stats.total}</span>
          <span className="istat__label">همه آیتم‌ها</span>
        </button>
        <button className={`istat istat--green ${statusFilter === 'available' ? 'istat--active' : ''}`} onClick={() => setStatusFilter('available')}>
          <span className="istat__num">{stats.available}</span>
          <span className="istat__label">موجود</span>
        </button>
        <button className={`istat istat--orange ${statusFilter === 'greyed' ? 'istat--active' : ''}`} onClick={() => setStatusFilter('greyed')}>
          <span className="istat__num">{stats.greyed}</span>
          <span className="istat__label">ناموجود (خاکستری)</span>
        </button>
        <button className={`istat istat--red ${statusFilter === 'hidden' ? 'istat--active' : ''}`} onClick={() => setStatusFilter('hidden')}>
          <span className="istat__num">{stats.hidden}</span>
          <span className="istat__label">مخفی از منو</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="items-toolbar">
        <div className="toolbar-search">
          <Search size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو در آیتم‌ها..." />
        </div>
        <select className="toolbar-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          {allCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button className="btn-add-item" onClick={() => setShowAdd(true)}>
          <Plus size={16} />
          آیتم جدید
        </button>
      </div>

      {/* Count */}
      <p className="items-count">{filtered.length} آیتم</p>

      {/* Table */}
      <div className="table-wrap">
        <table className="items-tbl">
          <thead>
            <tr>
              <th>تصویر</th>
              <th>نام آیتم</th>
              <th>دسته</th>
              <th>قیمت (تومان)</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const sc = STATUS_CONFIG[item.status]
              const Icon = sc.icon
              return (
                <tr key={item.id} className={`tbl-row tbl-row--${item.status}`}>
                  <td className="tbl-thumb">
                    <img src={item.image} alt={item.name}
                      onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=60&fit=crop' }} />
                  </td>
                  <td className="tbl-name">
                    <span>{item.name}</span>
                    {item.badge && <em className="item-badge">{item.badge}</em>}
                  </td>
                  <td className="tbl-cat">{CAT_LABELS[item.category] || item.category}</td>
                  <td className="tbl-price">
                    <PriceEdit item={item} onChange={val => updateItem(item.id, { price: val })} />
                  </td>
                  <td className="tbl-status">
                    <StatusSelector value={item.status} onChange={s => setItemStatus(item.id, s)} />
                  </td>
                  <td className="tbl-actions">
                    <button className="act-btn act-btn--edit" onClick={() => setEditItem(item)} title="ویرایش">
                      <Pencil size={15} />
                    </button>
                    <button className="act-btn act-btn--del" onClick={() => setConfirmDelete(item.id)} title="حذف">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="tbl-empty">آیتمی یافت نشد</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAdd && <ItemFormModal onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editItem && <ItemFormModal item={editItem} onSave={handleSaveEdit} onClose={() => setEditItem(null)} />}

      {/* Delete confirm */}
      {confirmDelete && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmDelete(null)} style={{ zIndex: 400 }} />
          <div className="confirm-dialog">
            <Trash2 size={28} className="confirm-icon" />
            <h3>حذف آیتم؟</h3>
            <p>این عملیات قابل برگشت نیست.</p>
            <div className="confirm-btns">
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>انصراف</button>
              <button className="btn-del-confirm" onClick={() => handleDelete(confirmDelete)}>بله، حذف کن</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function PriceEdit({ item, onChange }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(item.price)

  function commit() {
    const n = Number(val)
    if (!isNaN(n) && n > 0) onChange(n)
    setEditing(false)
  }

  if (editing) {
    return (
      <input className="price-input" type="number" value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => e.key === 'Enter' && commit()}
        autoFocus />
    )
  }
  return (
    <button className="price-display" onClick={() => { setVal(item.price); setEditing(true) }}>
      {item.price.toLocaleString('fa-IR')}
      <Pencil size={11} />
    </button>
  )
}

function StatusSelector({ value, onChange }) {
  return (
    <div className="status-sel">
      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
        const Icon = cfg.icon
        return (
          <button
            key={key}
            className={`status-opt ${cfg.cls} ${value === key ? 'status-opt--active' : ''}`}
            onClick={() => onChange(key)}
            title={cfg.label}
          >
            <Icon size={14} />
            <span>{cfg.label}</span>
          </button>
        )
      })}
    </div>
  )
}
