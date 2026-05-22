import { useState } from 'react'

const roles = [
  {
    id: 'sotuvchi',
    label: 'Sotuvchi',
    desc: 'Dehqon / Fermer',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'haridor',
    label: 'Haridor',
    desc: 'Xaridor / Mijoz',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
]

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!formData.email.trim()) errs.email = 'Email kiriting'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Noto\'g\'ri email format'
    if (!formData.password) errs.password = 'Parol kiriting'
    else if (formData.password.length < 4) errs.password = 'Parol kamida 4 belgi'
    if (!isLogin) {
      if (!formData.firstName.trim()) errs.firstName = 'Ism kiriting'
      if (!formData.lastName.trim()) errs.lastName = 'Familiya kiriting'
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Parollar mos emas'
      if (!role) errs.role = 'Rol tanlang'
    }
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    console.log(isLogin ? 'Login:' : 'Signup:', { ...formData, role })
  }

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
    setRole('')
    setErrors({})
    setShowPassword(false)
    setShowConfirm(false)
  }

  const inputClass = (name) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm transition-all duration-200 outline-none ${
      errors[name]
        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
        : 'border-gray-300 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500'
    }`

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl shadow-xl bg-white overflow-hidden min-h-[600px]">
        {/* Left */}
        <div className="md:w-[45%] bg-gradient-to-br from-emerald-600 to-green-700 p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dehqon AI</h1>
            <p className="text-emerald-100 text-sm md:text-base">Qishloq xo'jaligini raqamlashtirish</p>
          </div>
          <div className="relative z-10 space-y-4 mt-8">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>Mahsulotlarni online savdosi</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>Sotuvchilar va xaridorlar uchun himoya</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span>Xavfsiz va tezkor to'lovlar</span>
            </div>
          </div>
          <div className="relative z-10 mt-auto pt-8 text-emerald-100 text-xs">
            &copy; 2026 Dehqon AI
          </div>
        </div>

        {/* Right */}
        <div className="md:w-[55%] p-6 md:p-10 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Xush kelibsiz' : "Ro'yxatdan o'tish"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isLogin ? "Hisobingizga kiring" : "Yangi hisob yarating"}
              </p>
            </div>

            {/* Tab */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setIsLogin(true); resetForm() }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Kirish
              </button>
              <button
                onClick={() => { setIsLogin(false); resetForm() }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  !isLogin ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ro'yxatdan o'tish
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                      <input
                        type="text" name="firstName" value={formData.firstName}
                        onChange={handleChange} placeholder="Ismingiz"
                        className={inputClass('firstName')} required
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
                      <input
                        type="text" name="lastName" value={formData.lastName}
                        onChange={handleChange} placeholder="Familiyangiz"
                        className={inputClass('lastName')} required
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Siz kimsiz?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map(r => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => { setRole(r.id); if (errors.role) setErrors(prev => ({ ...prev, role: '' })) }}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                            role === r.id
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className={role === r.id ? 'text-emerald-600' : 'text-gray-400'}>{r.icon}</span>
                          <span className="text-sm font-semibold">{r.label}</span>
                          <span className="text-xs opacity-70">{r.desc}</span>
                        </button>
                      ))}
                    </div>
                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="example@email.com"
                  className={inputClass('email')} required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password" value={formData.password}
                    onChange={handleChange} placeholder="Parol kiriting"
                    className={inputClass('password')} required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parolni tasdiqlang</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword" value={formData.confirmPassword}
                      onChange={handleChange} placeholder="Parolni qayta kiriting"
                      className={inputClass('confirmPassword')} required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                {isLogin ? 'Kirish' : "Ro'yxatdan o'tish"}
              </button>

              {/* Toggle */}
              <p className="text-center text-sm text-gray-500">
                {isLogin ? "Akkauntingiz yo'qmi? " : "Akkauntingiz bormi? "}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); resetForm() }}
                  className="text-emerald-600 font-medium hover:text-emerald-700"
                >
                  {isLogin ? "Ro'yxatdan o'ting" : 'Kiring'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
