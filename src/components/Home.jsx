import { useState } from 'react'
import Header from './Header'
import Marketplace from './Marketplace'
import MyProducts from './MyProducts'
import Cart from './Cart'
import Profile from './Profile'
import { getCart } from '../services/marketplace'

const sellerPages = [
  { id: 'products', label: 'Mening mahsulotlarim' },
  { id: 'profile', label: 'Profil' },
]

const buyerPages = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'cart', label: 'Savat' },
  { id: 'profile', label: 'Profil' },
]

export default function Home({ user, onLogout }) {
  const isSeller = user.role === 'sotuvchi'
  const navPages = isSeller ? sellerPages : buyerPages
  const defaultPage = isSeller ? 'products' : 'marketplace'
  const [currentPage, setCurrentPage] = useState(defaultPage)
  const [cartCount, setCartCount] = useState(() =>
    getCart(user.email).reduce((s, i) => s + i.quantity, 0)
  )

  const refreshCart = () => setCartCount(getCart(user.email).reduce((s, i) => s + i.quantity, 0))

  const renderPage = () => {
    switch (currentPage) {
      case 'marketplace': return <Marketplace user={user} onCartUpdate={refreshCart} />
      case 'products': return <MyProducts user={user} />
      case 'cart': return <Cart user={user} onCartUpdate={refreshCart} />
      case 'profile': return <Profile user={user} onLogout={onLogout} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} navPages={navPages} currentPage={currentPage}
        onNavigate={setCurrentPage} cartCount={cartCount}
        onCartClick={() => setCurrentPage('cart')}
        onProfileClick={() => setCurrentPage('profile')} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>
    </div>
  )
}
