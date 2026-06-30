import { useState } from 'react'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import './AdminLogin.css'

const PASSWORD = 'pixel1234'

export default function AdminLogin({ onSuccess }) {
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (pass === PASSWORD) {
      onSuccess()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="admin-login">
      <div className={`admin-login__card ${shake ? 'admin-login__card--shake' : ''}`}>
        <div className="admin-login__icon">
          <Shield size={32} />
        </div>
        <h1 className="admin-login__title">پنل مدیریت</h1>
        <p className="admin-login__sub">پیکسل گارد — Admin</p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className={`admin-login__field ${error ? 'admin-login__field--error' : ''}`}>
            <Lock size={16} className="field-icon" />
            <input
              type={show ? 'text' : 'password'}
              placeholder="رمز عبور"
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false) }}
              autoFocus
            />
            <button type="button" className="field-toggle" onClick={() => setShow(s => !s)}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="admin-login__error">رمز عبور اشتباه است</p>}
          <button type="submit" className="admin-login__btn">ورود به پنل</button>
        </form>

        <p className="admin-login__hint">رمز پیش‌فرض: pixel1234</p>
      </div>
    </div>
  )
}
