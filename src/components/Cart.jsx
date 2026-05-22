import { useState } from 'react'
import { getCart, removeFromCart, updateCartItem, clearCart } from '../services/marketplace'

export default function Cart({ user, onCartUpdate }) {
  const [cart, setCart] = useState(() => getCart(user.email))
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleUpdate = (productId, delta) => {
    setCart(updateCartItem(user.email, productId, delta))
    onCartUpdate()
  }

  const handleRemove = (productId) => {
    setCart(removeFromCart(user.email, productId))
    onCartUpdate()
  }

  const handleClear = () => {
    clearCart(user.email)
    setCart([])
    onCartUpdate()
    setShowConfirm(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Savat</h1>
          <p className="text-sm text-gray-500 mt-1">{totalItems} ta mahsulot</p>
        </div>
        {cart.length > 0 && (
          <div className="flex items-center gap-3">
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Ishonchingiz komilmi?</span>
                <button onClick={handleClear} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-all">Ha</button>
                <button onClick={() => setShowConfirm(false)} className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all">Yo'q</button>
              </div>
            ) : (
              <button onClick={() => setShowConfirm(true)} className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 text-xs font-medium rounded-xl hover:bg-red-50 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Savatni tozalash
              </button>
            )}
          </div>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-900">Savat bo'sh</p>
          <p className="text-sm text-gray-400 mt-1">Mahsulotlarni ko'rish uchun Marketplace ga o'ting</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.productId} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-all">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.category}</span>
                  <h3 className="font-medium text-gray-900 text-sm mt-1">{item.name}</h3>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{item.price.toLocaleString()} so'm</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdate(item.productId, -1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm">−</button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                  <button onClick={() => handleUpdate(item.productId, 1)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm">+</button>
                </div>
                <p className="text-sm font-bold text-gray-900 w-24 text-right">{(item.price * item.quantity).toLocaleString()} so'm</p>
                <button onClick={() => handleRemove(item.productId)}
                  className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">Mahsulotlar ({totalItems} ta)</span>
              <span className="text-sm text-gray-900">{total.toLocaleString()} so'm</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Yetkazib berish</span>
              <span className="text-sm text-emerald-600 font-medium">Bepul</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Jami:</span>
              <span className="text-2xl font-bold text-gray-900">{total.toLocaleString()} so'm</span>
            </div>
            <button className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Xarid qilish
            </button>
          </div>
        </>
      )}
    </div>
  )
}
