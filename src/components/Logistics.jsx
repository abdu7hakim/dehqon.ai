import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
  getTransportRequests, createTransportRequest,
  getDrivers, getDeliveries, calculateDistance, calculatePrice,
} from '../services/logistics'

/* ─── Fix Leaflet default marker icon ─── */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const customIcons = {
  pickup: new L.DivIcon({ html: '<div style="background:#059669;width:1.5rem;height:1.5rem;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg></div>', className: '', iconSize: [24, 24], iconAnchor: [12, 12] }),
  delivery: new L.DivIcon({ html: '<div style="background:#dc2626;width:1.5rem;height:1.5rem;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>', className: '', iconSize: [24, 24], iconAnchor: [12, 12] }),
  driver: new L.DivIcon({ html: '<div style="background:#2563eb;width:1.5rem;height:1.5rem;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg></div>', className: '', iconSize: [24, 24], iconAnchor: [12, 12] }),
  live: new L.DivIcon({ html: '<div style="background:#7c3aed;width:1.2rem;height:1.2rem;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 3px rgba(124,58,237,.4);animation:pulse-dot 1.5s infinite"><style>@keyframes pulse-dot{50%{box-shadow:0 0 0 6px rgba(124,58,237,.2)}}</style></div>', className: '', iconSize: [20, 20], iconAnchor: [10, 10] }),
}

const tabs = [
  { id: 'requests', label: 'Transport so\'rovlari' },
  { id: 'drivers', label: 'Haydovchilar' },
  { id: 'deliveries', label: 'Yetkazib berishlar' },
]

const emptyReq = { pickupAddress: '', deliveryAddress: '', weightKg: '', pickupLat: '', pickupLng: '', deliveryLat: '', deliveryLng: '', description: '' }

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => L.latLng(p[0], p[1])))
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [map, points])
  return null
}

function LiveDriverMarker({ delivery }) {
  const markerRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const data = JSON.parse(localStorage.getItem('dehqon_deliveries') || '[]')
      const curr = data.find(d => d.id === delivery.id)
      if (curr && curr.currentLat && curr.currentLng && markerRef.current) {
        markerRef.current.setLatLng([curr.currentLat, curr.currentLng])
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [delivery.id])

  return (
    <Marker ref={markerRef} position={[delivery.currentLat, delivery.currentLng]} icon={customIcons.live}>
      <Popup>
        <div className="text-xs">
          <p className="font-medium">{delivery.description}</p>
          <p className="text-gray-500 mt-1">{((delivery.progress || 0) * 100).toFixed(0)}% bajarildi</p>
        </div>
      </Popup>
    </Marker>
  )
}

function SimulateAnimation({ delivery, onProgress }) {
  const animRef = useRef(null)

  useEffect(() => {
    if (delivery.status !== 'in_transit' || !delivery.pickupLat) return

    const start = { lat: delivery.pickupLat, lng: delivery.pickupLng }
    const end = { lat: delivery.deliveryLat, lng: delivery.deliveryLng }
    const totalSteps = 100
    let step = Math.round((delivery.progress || 0) * totalSteps)

    animRef.current = setInterval(() => {
      if (step >= totalSteps) {
        clearInterval(animRef.current)
        return
      }
      step++
      const t = step / totalSteps
      const lat = start.lat + (end.lat - start.lat) * t
      const lng = start.lng + (end.lng - start.lng) * t
      onProgress(delivery.id, lat, lng, t, t >= 1 ? 'delivered' : null)
    }, 500)

    return () => clearInterval(animRef.current)
  }, [delivery.id, delivery.status, delivery.pickupLat, delivery.pickupLng, delivery.deliveryLat, delivery.deliveryLng, delivery.progress, onProgress])

  return null
}

export default function Logistics({ user }) {
  const [tab, setTab] = useState('deliveries')
  const [requests, setRequests] = useState(() => getTransportRequests())
  const [drivers] = useState(() => getDrivers())
  const [deliveries, setDeliveries] = useState(() => getDeliveries())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyReq)
  const [priceInfo, setPriceInfo] = useState(null)

  const resetForm = () => { setForm(emptyReq); setShowForm(false); setPriceInfo(null) }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      pickupAddress: form.pickupAddress, deliveryAddress: form.deliveryAddress,
      weightKg: Number(form.weightKg), pickupLat: form.pickupLat ? Number(form.pickupLat) : null,
      pickupLng: form.pickupLng ? Number(form.pickupLng) : null,
      deliveryLat: form.deliveryLat ? Number(form.deliveryLat) : null,
      deliveryLng: form.deliveryLng ? Number(form.deliveryLng) : null,
      description: form.description, farmerId: user.email,
    }
    const req = createTransportRequest(data)
    setRequests(prev => [req, ...prev])
    if (data.pickupLat && data.pickupLng && data.deliveryLat && data.deliveryLng) {
      const dist = calculateDistance(data.pickupLat, data.pickupLng, data.deliveryLat, data.deliveryLng)
      const price = calculatePrice(dist, data.weightKg)
      setPriceInfo({ distance: Math.round(dist * 10) / 10, price })
    }
    resetForm()
  }

  const handleProgress = (id, lat, lng, progress, status) => {
    const updates = JSON.parse(localStorage.getItem('dehqon_deliveries') || '[]')
    const idx = updates.findIndex(d => d.id === id)
    if (idx === -1) return
    updates[idx] = { ...updates[idx], currentLat: lat, currentLng: lng, progress, ...(status ? { status } : {}) }
    localStorage.setItem('dehqon_deliveries', JSON.stringify(updates))
    setDeliveries([...updates])
  }

  const statusColor = (s) => {
    const map = { pending: 'bg-yellow-50 text-yellow-600', accepted: 'bg-blue-50 text-blue-600', in_transit: 'bg-purple-50 text-purple-600', delivered: 'bg-emerald-50 text-emerald-600', cancelled: 'bg-red-50 text-red-500' }
    return map[s] || 'bg-gray-50 text-gray-500'
  }
  const statusLabel = (s) => {
    const map = { pending: 'Kutilmoqda', accepted: 'Qabul qilingan', in_transit: 'Yo\'lda', delivered: 'Yetkazilgan', cancelled: 'Bekor qilingan' }
    return map[s] || s
  }
  const statusIcon = (s) => {
    const map = {
      pending: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
      accepted: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      in_transit: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z',
      delivered: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    }
    return map[s] || 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
  }

  const inTransit = deliveries.filter(d => d.status === 'in_transit')
  const activeDeliveries = deliveries.filter(d => d.status === 'in_transit' || d.status === 'pending' || d.status === 'accepted')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Logistika</h1>
        <p className="text-sm text-gray-500 mt-1">Mahsulotlarni tashish va yetkazib berish</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Faol yetkazishlar', value: inTransit.length, icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Haydovchilar', value: drivers.filter(d => d.isAvailable).length + '/' + drivers.length, icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Jami so\'rovlar', value: requests.length, icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Yetkazilgan', value: deliveries.filter(d => d.status === 'delivered').length, icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
              <svg className={`w-5 h-5 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
              </svg>
            </div>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >{t.label}</button>
        ))}
      </div>

      {/* ───── TRANSPORT SO'ROVLARI ───── */}
      {tab === 'requests' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{requests.length} ta so'rov</p>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {showForm ? 'Bekor qilish' : 'Yangi so\'rov'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Yangi transport so'rovi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Qayerdan</label>
                  <input type="text" name="pickupAddress" value={form.pickupAddress} onChange={handleChange}
                    placeholder="Toshkent, Chilonzor" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Qayerga</label>
                  <input type="text" name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange}
                    placeholder="Samarqand, Registon" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Yuk og'irligi (kg)</label>
                  <input type="number" name="weightKg" value={form.weightKg} onChange={handleChange}
                    placeholder="500" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Tavsif</label>
                  <input type="text" name="description" value={form.description} onChange={handleChange}
                    placeholder="Olma, 500 kg" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
                </div>
              </div>
              <details className="mb-4">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">Koordinatalar (ixtiyoriy)</summary>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div><label className="block text-xs text-gray-500 mb-1">Pickup Lat</label><input type="number" step="any" name="pickupLat" value={form.pickupLat} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Pickup Lng</label><input type="number" step="any" name="pickupLng" value={form.pickupLng} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Delivery Lat</label><input type="number" step="any" name="deliveryLat" value={form.deliveryLat} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1">Delivery Lng</label><input type="number" step="any" name="deliveryLng" value={form.deliveryLng} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" /></div>
                </div>
              </details>
              <button type="submit" className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all">So'rov yuborish</button>
            </form>
          )}

          {priceInfo && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 mb-0.5">Hisoblangan narx</p>
                <p className="text-lg font-bold text-emerald-800">{priceInfo.price.toLocaleString()} so'm</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-600 mb-0.5">Masofa</p>
                <p className="text-sm font-semibold text-emerald-800">{priceInfo.distance} km</p>
              </div>
            </div>
          )}

          {/* Requests list + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {requests.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <p className="text-sm font-medium text-gray-900">Hali so'rov yo'q</p>
                </div>
              ) : (
                requests.map(r => (
                  <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.pickupLat ? 'bg-gray-50' : 'bg-gray-50'}`}>
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{r.pickupAddress} → {r.deliveryAddress}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{r.weightKg} kg {r.description ? `• ${r.description}` : ''}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColor(r.status)}`}>{statusLabel(r.status)}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{new Date(r.createdAt).toLocaleString('uz-UZ')}</p>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-2 bg-gray-50 rounded-2xl overflow-hidden h-[400px] lg:h-[600px]">
              <MapContainer center={[41.3, 69.2]} zoom={5} className="w-full h-full" zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {requests.filter(r => r.pickupLat && r.deliveryLat).slice(0, 20).map(r => (
                  <div key={r.id}>
                    <Marker position={[r.pickupLat, r.pickupLng]} icon={customIcons.pickup}>
                      <Popup>{r.pickupAddress}</Popup>
                    </Marker>
                    <Marker position={[r.deliveryLat, r.deliveryLng]} icon={customIcons.delivery}>
                      <Popup>{r.deliveryAddress}</Popup>
                    </Marker>
                    <Polyline positions={[[r.pickupLat, r.pickupLng], [r.deliveryLat, r.deliveryLng]]} color="#059669" weight={1.5} dashArray="6 4" opacity={0.5} />
                  </div>
                ))}
                <FitBounds points={requests.filter(r => r.pickupLat && r.deliveryLat).flatMap(r => [[r.pickupLat, r.pickupLng], [r.deliveryLat, r.deliveryLng]])} />
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {/* ───── HAYDOVCHILAR ───── */}
      {tab === 'drivers' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-3">
            <p className="text-sm text-gray-500 mb-4">{drivers.filter(d => d.isAvailable).length}/{drivers.length} haydovchi bo'sh</p>
            {drivers.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm font-medium text-gray-900">Hali haydovchi yo'q</p>
                <p className="text-xs mt-1">Haydovchilar admin tomonidan qo'shiladi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drivers.map(d => (
                  <div key={d.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${d.isAvailable ? 'bg-emerald-600' : 'bg-gray-400'}`}>
                        {d.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{d.name}</p>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${d.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                            {d.isAvailable ? "Bo'sh" : 'Band'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{d.vehicleType} • {d.vehiclePlate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📦 Max {d.maxWeightKg} kg</span>
                      {d.phone && <span>📞 {d.phone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-gray-50 rounded-2xl overflow-hidden h-[500px]">
            <MapContainer center={[41.3, 69.2]} zoom={7} className="w-full h-full" zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {drivers.map(d => (
                <Marker key={d.id} position={[d.lat, d.lng]} icon={customIcons.driver}>
                  <Popup>
                    <div className="text-xs">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-gray-500">{d.vehicleType} • {d.vehiclePlate}</p>
                      <p className={`mt-1 font-medium ${d.isAvailable ? 'text-emerald-600' : 'text-gray-400'}`}>{d.isAvailable ? "Bo'sh" : 'Band'}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <FitBounds points={drivers.map(d => [d.lat, d.lng])} />
            </MapContainer>
          </div>
        </div>
      )}

      {/* ───── YETKAZIB BERISHLAR ───── */}
      {tab === 'deliveries' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">{activeDeliveries.length} ta faol, {deliveries.filter(d => d.status === 'delivered').length} ta yetkazilgan</p>

          {/* Live tracking map */}
          {inTransit.length > 0 && (
            <div className="bg-gray-50 rounded-2xl overflow-hidden h-[400px] mb-6">
              <MapContainer center={[40.5, 68]} zoom={6} className="w-full h-full" zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {inTransit.map(d => (
                  <div key={d.id}>
                    <Marker position={[d.pickupLat, d.pickupLng]} icon={customIcons.pickup}>
                      <Popup>{d.pickupAddress}</Popup>
                    </Marker>
                    <Marker position={[d.deliveryLat, d.deliveryLng]} icon={customIcons.delivery}>
                      <Popup>{d.deliveryAddress}</Popup>
                    </Marker>
                    <Polyline positions={[[d.pickupLat, d.pickupLng], [d.deliveryLat, d.deliveryLng]]} color="#059669" weight={2} dashArray="8 6" opacity={0.6} />
                    <Polyline positions={[[d.pickupLat, d.pickupLng], [d.currentLat, d.currentLng]]} color="#7c3aed" weight={3} opacity={0.8} />
                    <LiveDriverMarker delivery={d} />
                    <SimulateAnimation delivery={d} onProgress={handleProgress} />
                  </div>
                ))}
                <FitBounds points={inTransit.flatMap(d => [[d.pickupLat, d.pickupLng], [d.deliveryLat, d.deliveryLng], [d.currentLat, d.currentLng]])} />
              </MapContainer>
            </div>
          )}

          {/* Delivery list */}
          <div className="space-y-3">
            {deliveries.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm font-medium text-gray-900">Hali yetkazib berishlar yo'q</p>
              </div>
            ) : (
              deliveries.map(d => {
                const driver = drivers.find(drv => drv.id === d.driverId)
                const pct = Math.round((d.progress || 0) * 100)
                return (
                  <div key={d.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          d.status === 'delivered' ? 'bg-emerald-50' : d.status === 'in_transit' ? 'bg-purple-50' : 'bg-gray-50'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            d.status === 'delivered' ? 'text-emerald-600' : d.status === 'in_transit' ? 'text-purple-600' : 'text-gray-400'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={statusIcon(d.status)} />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{d.pickupAddress} → {d.deliveryAddress}</p>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColor(d.status)}`}>{statusLabel(d.status)}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{d.weightKg} kg {d.description ? `• ${d.description}` : ''}</p>
                          {driver && <p className="text-xs text-gray-400 mt-0.5">🚚 {driver.name} • {driver.vehiclePlate}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {d.status === 'in_transit' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>{d.pickupAddress}</span>
                          <span className="font-medium text-purple-600">{pct}%</span>
                          <span>{d.deliveryAddress}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 via-purple-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                          <span>{new Date(d.createdAt).toLocaleString('uz-UZ')}</span>
                          {d.startedAt && <span>Boshlangan: {new Date(d.startedAt).toLocaleString('uz-UZ')}</span>}
                          {d.deliveredAt && <span>Yetkazilgan: {new Date(d.deliveredAt).toLocaleString('uz-UZ')}</span>}
                        </div>
                      </div>
                    )}

                    {d.status === 'delivered' && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Yetkazib berildi</span>
                        {d.deliveredAt && <span className="text-gray-400">{new Date(d.deliveredAt).toLocaleString('uz-UZ')}</span>}
                      </div>
                    )}

                    {d.status === 'pending' && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-amber-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Haydovchi tayinlanmoqda...</span>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
