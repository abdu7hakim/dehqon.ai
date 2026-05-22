const USERS_KEY = 'dehqon_users'
const CURRENT_USER_KEY = 'dehqon_current_user'

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function register({ firstName, lastName, email, password, role }) {
  const users = getUsers()
  if (users.find(u => u.email === email)) {
    return { error: 'Bu email allaqachon ro\'yxatdan o\'tgan' }
  }
  const newUser = { firstName, lastName, email, password, role }
  saveUsers([...users, newUser])
  setCurrentUser(newUser)
  return { user: newUser }
}

export function login({ email, password }) {
  const users = getUsers()
  const found = users.find(u => u.email === email && u.password === password)
  if (!found) return { error: 'Email yoki parol noto\'g\'ri' }
  setCurrentUser(found)
  return { user: found }
}

export function logout() {
  setCurrentUser(null)
}
