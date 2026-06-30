import { useState, useEffect } from 'react'
import { X, Image, Tag, DollarSign, AlignLeft, Layers } from 'lucide-react'
import { useItemStore } from '../../store/ItemStoreContext'
import './ItemFormModal.css'

const EMPTY = {
  name: '', category: 'hot', price: '', description: '',
  image: '', badge: '',
  details: { fullDesc: '', ingredients: '', calories: '', prepTime: '', allergens: '', volume: '', temp: '' },
}

export default function ItemFormModal({ item, onSave, onClose }) {
  const { allCategories } = useItemStore()
  const [form, setForm] = useState(EMPTY)
  const [preview, setPreview] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        category: item.category || 'hot',
        price: item.price || '',
        description: item.description || '',
        image: item.image || '',
        badge: item.badge || '',
        details: {
          fullDesc: item.details?.fullDesc || '',
          ingredients: Array.isArray(item.details?.ingredients) ? item.details.ingredients.join('، ') : '',
          calories: item.details?.calories ?? '',
          prepTime: item.details?.prepTime || '',
          allergens: Array.isArray(item.details?.allergens) ? item.details.allergens.join('، ') : '',
          volume: item.details?.volume || '',
          temp: item.details?.temp || '',
        },
      })
      setPreview(item.image || '')
    }
  }, [item])

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }))
  }

  function setDetail(key, val) {
    setForm(f => ({ ...f, details: { ...f.details, [key]: val } }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'نام آیتم الزامی است'
    if (!form.price || isNaN(Number(form.price))) errs.price = 'قیمت معتبر وارد کنید'
    if (!form.description.trim()) errs.description = 'توضیح کوتاه الزامی است'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const parsed = {
      ...form,
      price: Number(form.price),
      badge: form.badge.trim() || null,
      details: {
        fullDesc: form.details.fullDesc,
        ingredients: form.details.ingredients.split('،').map(s => s.trim()).filter(Boolean),
        calories: Number(form.details.calories) || 0,
        prepTime: form.details.prepTime || '—',
        allergens: form.details.allergens.split('،').map(s => s.trim()).filter(Boolean),
        volume: form.details.volume || '—',
        temp: form.details.temp || '—',
      },
    }
    onSave(parsed)
  }

  const catOptions = allCategories.filter(c => c.id !== 'all')

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__head">
          <h2>{item ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}</h2>
          <button className="modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          <div className="modal__cols">

            {/* LEFT col */}
            <div className="modal__col">
              <h3 className="form-section-title">اطلاعات اصلی</h3>

              <FormField icon={<Tag size={14} />} label="نام آیتم *" error={errors.name}>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="مثلاً: کاپوچینو دابل" />
              </FormField>

              <FormField icon={<Layers size={14} />} label="دسته‌بندی *">
                <select value={form.category} onChange={e => set('category', e.target.value)}>
                  {catOptions.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </FormField>

              <FormField icon={<DollarSign size={14} />} label="قیمت (تومان) *" error={errors.price}>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="مثلاً: 75000" />
              </FormField>

              <FormField label="بج (اختیاری)">
                <input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="مثلاً: جدید، پرفروش، تند" />
              </FormField>

              <FormField icon={<AlignLeft size={14} />} label="توضیح کوتاه *" error={errors.description}>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={2} placeholder="یک خط توضیح برای منوی مشتری" />
              </FormField>

              <FormField icon={<Image size={14} />} label="آدرس تصویر (URL)">
                <input value={form.image} onChange={e => { set('image', e.target.value); setPreview(e.target.value) }}
                  placeholder="https://images.unsplash.com/..." dir="ltr" />
              </FormField>

              {preview && (
                <div className="img-preview">
                  <img src={preview} alt="preview"
                    onError={e => { e.currentTarget.style.display = 'none' }}
                    onLoad={e => { e.currentTarget.style.display = 'block' }} />
                </div>
              )}
            </div>

            {/* RIGHT col */}
            <div className="modal__col">
              <h3 className="form-section-title">جزئیات (کشو)</h3>

              <FormField label="توضیح کامل">
                <textarea value={form.details.fullDesc} onChange={e => setDetail('fullDesc', e.target.value)}
                  rows={3} placeholder="توضیح کامل‌تر برای پنل جزئیات" />
              </FormField>

              <FormField label="مواد تشکیل‌دهنده">
                <input value={form.details.ingredients} onChange={e => setDetail('ingredients', e.target.value)}
                  placeholder="با ، جدا کنید: آرد، کره، شکر" />
              </FormField>

              <div className="form-row">
                <FormField label="کالری">
                  <input type="number" value={form.details.calories} onChange={e => setDetail('calories', e.target.value)} placeholder="مثلاً: 320" />
                </FormField>
                <FormField label="زمان آماده‌سازی">
                  <input value={form.details.prepTime} onChange={e => setDetail('prepTime', e.target.value)} placeholder="مثلاً: ۵ دقیقه" />
                </FormField>
              </div>

              <div className="form-row">
                <FormField label="دما">
                  <input value={form.details.temp} onChange={e => setDetail('temp', e.target.value)} placeholder="داغ / سرد" />
                </FormField>
                <FormField label="حجم">
                  <input value={form.details.volume} onChange={e => setDetail('volume', e.target.value)} placeholder="مثلاً: ۲۵۰ml" />
                </FormField>
              </div>

              <FormField label="آلرژن‌ها">
                <input value={form.details.allergens} onChange={e => setDetail('allergens', e.target.value)}
                  placeholder="با ، جدا کنید: گلوتن، لبنیات" />
              </FormField>
            </div>
          </div>

          <div className="modal__footer">
            <button type="button" className="btn-cancel" onClick={onClose}>انصراف</button>
            <button type="submit" className="btn-save">{item ? 'ذخیره تغییرات' : 'افزودن آیتم'}</button>
          </div>
        </form>
      </div>
    </>
  )
}

function FormField({ icon, label, error, children }) {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <label className="form-field__label">
        {icon && <span className="field-ico">{icon}</span>}
        {label}
      </label>
      <div className="form-field__input">{children}</div>
      {error && <span className="form-field__error">{error}</span>}
    </div>
  )
}
