import { logout } from '../services/auth'
import { getMyProducts } from '../services/marketplace'
import { getCart } from '../services/marketplace'

export default function Profile({ user, onLogout }) {
  const products = getMyProducts(user.email)
  const cart = getCart(user.email)
  const totalStock = products.reduce((s, p) => s + (p.quantity || 0), 0)
  const activeProducts = products.filter(p => p.quantity > 0).length
  const totalCartItems = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="max-w-lg mx-auto">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Mahsulotlar', value: products.length, icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M8.25 8.25l3-3 3 3m-3-3v12', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Savatda', value: totalCartItems, icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Faol', value: activeProducts, icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
              <svg className={`w-4 h-4 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-gray-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {user.role === 'sotuvchi' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Jami zaxiradagi mahsulot</span>
            <span className="text-lg font-bold text-gray-900">{totalStock.toLocaleString()} {totalStock > 0 ? 'dona' : ''}</span>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${products.length ? Math.min(100, (activeProducts / products.length) * 100) : 0}%` }} />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{activeProducts}/{products.length} mahsulot sotuvda</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-24 bg-gradient-to-r from-emerald-500 to-green-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <path d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50 L400,100 L0,100 Z" fill="white" />
            </svg>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="flex justify-center -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {user.role === 'sotuvchi' ? '👨‍🌾 Sotuvchi / Dehqon' : '🛒 Haridor'}
            </span>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            {[
              { label: 'Ism', value: user.firstName, icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
              { label: 'Familiya', value: user.lastName, icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
              { label: 'Email', value: user.email, icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
              { label: 'Rol', value: user.role === 'sotuvchi' ? '👨‍🌾 Sotuvchi' : '🛒 Haridor', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => { logout(); onLogout() }}
            className="w-full mt-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Tizimdan chiqish
          </button>
        </div>
      </div>
    </div>
  )
}
