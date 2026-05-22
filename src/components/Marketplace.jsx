import { useState } from 'react'
import { addToCart, getProducts } from '../services/marketplace'

export default function Marketplace({ user, onCartUpdate }) {
  const [products] = useState(() => getProducts())
  const [search, setSearch] = useState('')
  const [addedId, setAddedId] = useState(null)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (p) => {
    addToCart(user.email, p)
    setAddedId(p.id)
    onCartUpdate()
    setTimeout(() => setAddedId(null), 1000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} ta mahsulot mavjud</p>
        </div>
        <div className="relative w-full sm:w-80">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Mahsulot qidirish..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-gray-400 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-900">Mahsulot topilmadi</p>
          <p className="text-sm text-gray-400 mt-1">{search ? `"${search}" bo'yicha hech narsa yo'q` : 'Hozircha mahsulot mavjud emas'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => {
            const outOfStock = p.quantity === 0
            return (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-all flex flex-col">
                {/* Image */}
                <div className={`h-44 flex items-center justify-center ${outOfStock ? 'bg-gray-50' : 'bg-emerald-50'}`}>
                  {outOfStock ? (
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <span className="text-xs font-medium text-gray-400">Tugagan</span>
                    </div>
                  ) : (
                    <svg className="w-14 h-14 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${outOfStock ? 'bg-gray-100 text-gray-400' : 'bg-emerald-50 text-emerald-600'}`}>
                      {p.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{p.name}</h3>
                  {p.description && <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-1">{p.description}</p>}
                  {!p.description && <div className="flex-1" />}

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <div>
                      <p className="text-base font-bold text-gray-900">{Number(p.price).toLocaleString()} so'm</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{p.sellerName}</p>
                    </div>
                    {outOfStock ? (
                      <span className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-50 rounded-lg">Tugagan</span>
                    ) : (
                      <button onClick={() => handleAdd(p)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all active:scale-95 ${
                          addedId === p.id
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >{addedId === p.id ? 'Qo\'shildi' : 'Savatga'}</button>
                    )}
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
