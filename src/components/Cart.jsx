import { useState } from 'react'
import { getCart, removeFromCart, updateCartItem, clearCart } from '../services/marketplace'

export default function Cart({ user, onCartUpdate }) {
  const [cart, setCart] = useState(() => getCart(user.email))
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

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
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Savat</h2>
        {cart.length > 0 && (
          <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-600 font-medium">Tozalash</button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <p className="text-lg font-medium">Savat bo'sh</p>
          <p className="text-sm mt-1">Mahsulotlarni ko'rish uchun Marketplace ga o'ting</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.productId} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{item.price.toLocaleString()} so'm</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdate(item.productId, -1)}
                    className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-sm">−</button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => handleUpdate(item.productId, 1)}
                    className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-sm">+</button>
                </div>
                <p className="text-sm font-bold text-gray-900 w-24 text-right">{(item.price * item.quantity).toLocaleString()} so'm</p>
                <button onClick={() => handleRemove(item.productId)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Jami:</span>
              <span className="text-2xl font-bold text-gray-900">{total.toLocaleString()} so'm</span>
            </div>
            <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all active:scale-[0.99]">Xarid qilish</button>
          </div>
        </>
      )}
    </div>
  )
}
