const PRODUCTS_KEY = 'dehqon_products'

export function getProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]')
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function getMyProducts(userEmail) {
  return getProducts().filter(p => p.sellerEmail === userEmail)
}

export function createProduct(data) {
  const products = getProducts()
  const newProduct = {
    id: Date.now() + Math.random(),
    quantity: 0,
    ...data,
    createdAt: new Date().toISOString(),
  }
  saveProducts([...products, newProduct])
  return newProduct
}

export function updateProduct(id, data) {
  const products = getProducts()
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return null
  products[idx] = { ...products[idx], ...data }
  saveProducts(products)
  return products[idx]
}

export function deleteProduct(id) {
  saveProducts(getProducts().filter(p => p.id !== id))
}

export function getCart(userEmail) {
  return JSON.parse(localStorage.getItem('dehqon_cart_' + userEmail) || '[]')
}

export function saveCart(userEmail, items) {
  localStorage.setItem('dehqon_cart_' + userEmail, JSON.stringify(items))
}

export function addToCart(userEmail, product) {
  const cart = getCart(userEmail)
  const existing = cart.find(i => i.productId === product.id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ productId: product.id, name: product.name, price: product.price, quantity: 1 })
  }
  saveCart(userEmail, cart)
  return cart
}

export function updateCartItem(userEmail, productId, delta) {
  let cart = getCart(userEmail)
  const idx = cart.findIndex(i => i.productId === productId)
  if (idx === -1) return cart
  cart[idx].quantity += delta
  if (cart[idx].quantity <= 0) cart = cart.filter(i => i.productId !== productId)
  saveCart(userEmail, cart)
  return cart
}

export function removeFromCart(userEmail, productId) {
  const cart = getCart(userEmail).filter(i => i.productId !== productId)
  saveCart(userEmail, cart)
  return cart
}

export function clearCart(userEmail) {
  saveCart(userEmail, [])
}
