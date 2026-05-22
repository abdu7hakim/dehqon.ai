import { useState } from 'react'
import Auth from './components/Auth'
import Home from './components/Home'

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('dehqon_current_user')
    return stored ? JSON.parse(stored) : null
  })

  if (!user) return <Auth onAuth={setUser} />
  return <Home user={user} onLogout={() => { localStorage.removeItem('dehqon_current_user'); setUser(null) }} />
}

export default App
