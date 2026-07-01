import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'

export default function App() {
  const [user, setUser]           = useState(null)
  const [searchQuery, setSearch]  = useState('')
  const [toast, setToast]         = useState({ show: false, icon: '', msg: '' })

  const showToast = (msg, icon = '✅') => {
    setToast({ show: true, icon, msg })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      <Header
        user={user}
        onLogin={setUser}
        onSearch={setSearch}
      />
      <main>
        <HomePage
          user={user}
          onToast={showToast}
          searchQuery={searchQuery}
        />
      </main>
      <Footer />
      <Toast toast={toast} onHide={() => setToast({ ...toast, show: false })} />
    </div>
  )
}