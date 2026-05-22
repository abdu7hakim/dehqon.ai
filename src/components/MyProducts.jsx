import { useState, useRef } from 'react'
import { createProduct, deleteProduct, getMyProducts, updateProduct } from '../services/marketplace'

const categories = ['Meva', 'Sabzavot', 'Don mahsulotlari', 'Chorva', 'Parranda', 'Boshqa']

const emptyForm = { name: '', category: '', price: '', quantity: '', description: '', image: '' }

export default function MyProducts({ user }) {
  const [products, setProducts] = useState(() => getMyProducts(user.email))
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const fileRef = useRef(null)

  const totalStock = products.reduce((s, p) => s + (p.quantity || 0), 0)
  const activeCount = products.filter(p => p.quantity > 0).length
  const outCount = products.filter(p => p.quantity === 0).length
  const totalValue = products.reduce((s, p) => s + (p.quantity || 0) * Number(p.price), 0)
  const categoryCount = new Set(products.map(p => p.category)).size

  const resetForm = () => { setForm(emptyForm); setErrors({}); setEditingId(null); setShowForm(false); setImagePreview(null) }

  const openEdit = (p) => {
    setForm({ name: p.name, category: p.category, price: String(p.price), quantity: String(p.quantity), description: p.description || '', image: p.image || '' })
    setImagePreview(p.image || null)
    setErrors({}); setEditingId(p.id); setShowForm(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setImagePreview(reader.result); setForm(prev => ({ ...prev, image: reader.result })) }
    reader.readAsDataURL(file)
  }

  const removeImage = () => { setImagePreview(null); setForm(prev => ({ ...prev, image: '' })); if (fileRef.current) fileRef.current.value = '' }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nomi majburiy'
    if (!form.category) errs.category = 'Kategoriya tanlang'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errs.price = 'Noto\'g\'ri narx'
    if (form.quantity !== '' && (isNaN(form.quantity) || Number(form.quantity) < 0)) errs.quantity = 'Noto\'g\'ri miqdor'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const data = { name: form.name.trim(), category: form.category, price: Number(form.price), quantity: form.quantity === '' ? 0 : Number(form.quantity), description: form.description, image: form.image }
    if (editingId) {
      updateProduct(editingId, data)
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...data } : p))
    } else {
      const newP = createProduct({ ...data, sellerEmail: user.email, sellerName: `${user.firstName} ${user.lastName}` })
      setProducts(prev => [...prev, newP])
    }
    resetForm()
  }

  const handleDelete = (id) => { deleteProduct(id); setProducts(prev => prev.filter(p => p.id !== id)) }

  const inputClass = (name) => `w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition-all ${errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-gray-400 focus:bg-white'}`

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mening mahsulotlarim</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} ta mahsulot</p>
        </div>
        <button onClick={() => { if (!showForm) resetForm(); setShowForm(!showForm); setEditingId(null) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {showForm ? 'Bekor qilish' : 'Yangi mahsulot'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Aktiv', value: activeCount, icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Tugagan', value: outCount, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', color: outCount > 0 ? 'text-red-500' : 'text-gray-400', bg: outCount > 0 ? 'bg-red-50' : 'bg-gray-50' },
          { label: 'Kategoriya', value: categoryCount, icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L13.159 3.66A2.25 2.25 0 0011.568 3z', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Zaxira', value: totalStock.toLocaleString(), icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m16.5 0v.624c0 1.075-.558 2.072-1.472 2.62a4.5 4.5 0 01-4.556 0A3.006 3.006 0 0112 9.376M3.75 7.5v.624c0 1.075.558 2.072 1.472 2.62a4.5 4.5 0 004.556 0A3.006 3.006 0 0112 9.376', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
              <svg className={`w-5 h-5 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {totalValue > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-500">Zaxira qiymati</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{totalValue.toLocaleString()} so'm</span>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${activeCount > 0 ? Math.min(100, (activeCount / products.length) * 100) : 0}%` }} />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{activeCount}/{products.length} mahsulot mavjud</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-5">{editingId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}</h3>
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Mahsulot rasmi</label>
            <div className="flex items-center gap-4">
              <div className={`w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${imagePreview ? 'border-emerald-200' : 'border-gray-200'}`}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" id="productImage" />
                <label htmlFor="productImage" className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-all text-center">Rasm tanlash</label>
                {imagePreview && <button type="button" onClick={removeImage} className="text-xs text-red-500 hover:text-red-600 text-center">O'chirish</button>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Mahsulot nomi</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Olma" className={inputClass('name')} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategoriya</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass('category')}>
                <option value="">Tanlang</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Narxi (so'm)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="15000" className={inputClass('price')} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Soni (kg/dona)</label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="100" className={inputClass('quantity')} />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Tavsif</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mahsulot haqida qisqacha..." rows={2} className={inputClass('description')} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all">{editingId ? 'Saqlash' : 'Qo\'shish'}</button>
            <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">Bekor qilish</button>
          </div>
        </form>
      )}

      {/* Products */}
      {products.length === 0 && !showForm ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M8.25 8.25l3-3 3 3m-3-3v12" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-900">Hali mahsulot yo'q</p>
          <p className="text-sm text-gray-400 mt-1">Yangi mahsulot qo'shish uchun yuqoridagi tugmani bosing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => {
            const outOfStock = p.quantity === 0
            return (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-all flex flex-col">
                <div className={`h-40 flex items-center justify-center ${p.image ? '' : outOfStock ? 'bg-gray-50' : 'bg-emerald-50'} overflow-hidden relative`}>
                  {outOfStock && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="text-[11px] font-medium text-red-500 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">Tugagan</span>
                    </div>
                  )}
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : outOfStock ? (
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${outOfStock ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>{p.category}</span>
                      <h3 className="text-sm font-semibold text-gray-900 mt-2">{p.name}</h3>
                    </div>
                  </div>
                  {p.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>}
                  <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-50">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{Number(p.price).toLocaleString()} so'm</p>
                      <p className={`text-xs mt-0.5 ${outOfStock ? 'text-red-400' : 'text-gray-400'}`}>{p.quantity} dona qoldi</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
