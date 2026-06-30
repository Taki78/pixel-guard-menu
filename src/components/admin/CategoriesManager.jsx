import { useState } from 'react'
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, Check,
  Coffee, GlassWater, Zap, Sandwich, ChefHat, IceCream,
  Gamepad2, Pizza, Cookie, Salad, Beef, Fish, CupSoda,
  Soup, Wine, Apple, Cherry, Popcorn, Flame, Star, Layers,
} from 'lucide-react'
import { useItemStore } from '../../store/ItemStoreContext'
import './CategoriesManager.css'

// Icon registry available for selection
const ICON_OPTIONS = [
  { name: 'Gamepad2', Icon: Gamepad2 },
  { name: 'Coffee',   Icon: Coffee   },
  { name: 'GlassWater', Icon: GlassWater },
  { name: 'Zap',     Icon: Zap      },
  { name: 'Sandwich', Icon: Sandwich },
  { name: 'ChefHat', Icon: ChefHat  },
  { name: 'IceCream', Icon: IceCream },
  { name: 'Pizza',   Icon: Pizza    },
  { name: 'Cookie',  Icon: Cookie   },
  { name: 'Salad',   Icon: Salad    },
  { name: 'Beef',    Icon: Beef     },
  { name: 'Fish',    Icon: Fish     },
  { name: 'CupSoda', Icon: CupSoda  },
  { name: 'Soup',    Icon: Soup     },
  { name: 'Wine',    Icon: Wine     },
  { name: 'Apple',   Icon: Apple    },
  { name: 'Cherry',  Icon: Cherry   },
  { name: 'Popcorn', Icon: Popcorn  },
  { name: 'Flame',   Icon: Flame    },
  { name: 'Star',    Icon: Star     },
  { name: 'Layers',  Icon: Layers   },
]

const ICON_MAP = Object.fromEntries(ICON_OPTIONS.map(o => [o.name, o.Icon]))

function renderIcon(name, size = 18) {
  const Icon = ICON_MAP[name]
  return Icon ? <Icon size={size} /> : null
}

const EMPTY_FORM = { label: '', iconName: 'Gamepad2' }

export default function CategoriesManager() {
  const {
    allCategories, allItems,
    addCategory, updateCategory, deleteCategory,
    moveCategoryUp, moveCategoryDown,
  } = useItemStore()

  const [showAdd, setShowAdd]           = useState(false)
  const [editId, setEditId]             = useState(null)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [iconPickerFor, setIconPickerFor] = useState(null) // 'add' | catId

  // item counts per category
  const itemCount = {}
  allItems.forEach(i => { itemCount[i.category] = (itemCount[i.category] || 0) + 1 })

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowAdd(true)
  }

  function openEdit(cat) {
    setForm({ label: cat.label, iconName: cat.iconName })
    setEditId(cat.id)
    setShowAdd(true)
  }

  function closeForm() {
    setShowAdd(false)
    setEditId(null)
    setForm(EMPTY_FORM)
    setIconPickerFor(null)
  }

  function handleSave() {
    if (!form.label.trim()) return
    if (editId) {
      updateCategory(editId, { label: form.label.trim(), iconName: form.iconName })
    } else {
      addCategory({ label: form.label.trim(), iconName: form.iconName })
    }
    closeForm()
  }

  function handleDelete(id) {
    deleteCategory(id)
    setConfirmDelete(null)
  }

  const cats = allCategories.filter(c => c.id !== 'all')

  return (
    <div className="cats-manager">

      {/* Header toolbar */}
      <div className="cats-toolbar">
        <div>
          <h2 className="cats-title">دسته‌بندی‌ها</h2>
          <p className="cats-sub">{cats.length} دسته — ترتیب نمایش در منوی مشتری</p>
        </div>
        <button className="btn-add-cat" onClick={openAdd}>
          <Plus size={16} />
          دسته جدید
        </button>
      </div>

      {/* Add / Edit inline form */}
      {showAdd && (
        <div className="cat-form-card">
          <h3 className="cat-form-title">{editId ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}</h3>

          <div className="cat-form-body">
            {/* Icon selector */}
            <div className="cat-form-icon-wrap">
              <label className="cat-form-label">آیکون</label>
              <button
                type="button"
                className="icon-preview-btn"
                onClick={() => setIconPickerFor(iconPickerFor ? null : 'form')}
              >
                {renderIcon(form.iconName, 22)}
                <span className="icon-preview-name">{form.iconName}</span>
                <ChevronDown size={14} />
              </button>

              {iconPickerFor === 'form' && (
                <div className="icon-picker">
                  {ICON_OPTIONS.map(({ name, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      className={`icon-opt ${form.iconName === name ? 'icon-opt--active' : ''}`}
                      title={name}
                      onClick={() => { setForm(f => ({ ...f, iconName: name })); setIconPickerFor(null) }}
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Label input */}
            <div className="cat-form-name-wrap">
              <label className="cat-form-label">نام دسته *</label>
              <input
                className="cat-form-input"
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="مثلاً: پیتزا، وگان، ویژه شب"
                autoFocus
              />
            </div>
          </div>

          <div className="cat-form-actions">
            <button className="btn-form-cancel" onClick={closeForm}><X size={15} /> انصراف</button>
            <button className="btn-form-save" onClick={handleSave} disabled={!form.label.trim()}>
              <Check size={15} />
              {editId ? 'ذخیره' : 'افزودن'}
            </button>
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="cats-list">
        {cats.length === 0 && (
          <div className="cats-empty">هنوز دسته‌بندی‌ای وجود ندارد</div>
        )}

        {cats.map((cat, idx) => {
          const count = itemCount[cat.id] || 0
          const isFirst = idx === 0
          const isLast  = idx === cats.length - 1

          return (
            <div key={cat.id} className="cat-row">
              {/* Reorder */}
              <div className="cat-row__order">
                <button
                  className="order-btn"
                  onClick={() => moveCategoryUp(cat.id)}
                  disabled={isFirst}
                  title="بالاتر"
                >
                  <ChevronUp size={14} />
                </button>
                <span className="order-num">{idx + 1}</span>
                <button
                  className="order-btn"
                  onClick={() => moveCategoryDown(cat.id)}
                  disabled={isLast}
                  title="پایین‌تر"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Icon */}
              <div className="cat-row__icon">
                {renderIcon(cat.iconName, 20)}
              </div>

              {/* Info */}
              <div className="cat-row__info">
                <span className="cat-row__name">{cat.label}</span>
                <span className="cat-row__meta">
                  {cat.isBase ? (
                    <em className="badge-base">پیش‌فرض</em>
                  ) : (
                    <em className="badge-custom">دستی</em>
                  )}
                  <span className="cat-row__count">{count} آیتم</span>
                </span>
              </div>

              {/* Actions */}
              <div className="cat-row__actions">
                <button className="act-btn act-btn--edit" onClick={() => openEdit(cat)} title="ویرایش">
                  <Pencil size={14} />
                </button>
                <button
                  className="act-btn act-btn--del"
                  onClick={() => setConfirmDelete(cat)}
                  title="حذف"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmDelete(null)} />
          <div className="confirm-dialog">
            <Trash2 size={28} className="confirm-icon" />
            <h3>حذف «{confirmDelete.label}»؟</h3>
            {(itemCount[confirmDelete.id] || 0) > 0 ? (
              <p className="confirm-warn">
                این دسته‌بندی <strong>{itemCount[confirmDelete.id]} آیتم</strong> دارد.
                آیتم‌ها حذف نمی‌شوند ولی در منو بدون دسته نمایش داده می‌شوند.
              </p>
            ) : (
              <p>این دسته‌بندی آیتمی ندارد و حذف می‌شود.</p>
            )}
            <div className="confirm-btns">
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>انصراف</button>
              <button className="btn-del-confirm" onClick={() => handleDelete(confirmDelete.id)}>
                حذف
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
