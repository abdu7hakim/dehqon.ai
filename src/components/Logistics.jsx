import { useState } from 'react'
import {
  getTransportRequests, createTransportRequest,
  getDrivers, getDeliveries, calculateDistance, calculatePrice,
} from '../services/logistics'

const tabs = [
  { id: 'requests', label: 'Transport so\'rovlari' },
  { id: 'drivers', label: 'Haydovchilar' },
  { id: 'deliveries', label: 'Yetkazib berishlar' },
]

const emptyReq = { pickupAddress: '', deliveryAddress: '', weightKg: '', pickupLat: '', pickupLng: '', deliveryLat: '', deliveryLng: '', description: '' }

export default function Logistics({ user }) {
  const [tab, setTab] = useState('requests')
  const [requests, setRequests] = useState(() => getTransportRequests())
  const [drivers] = useState(() => getDrivers())
  const [deliveries] = useState(() => getDeliveries())
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
      pickupAddress: form.pickupAddress,
      deliveryAddress: form.deliveryAddress,
      weightKg: Number(form.weightKg),
      pickupLat: form.pickupLat ? Number(form.pickupLat) : null,
      pickupLng: form.pickupLng ? Number(form.pickupLng) : null,
      deliveryLat: form.deliveryLat ? Number(form.deliveryLat) : null,
      deliveryLng: form.deliveryLng ? Number(form.deliveryLng) : null,
      description: form.description,
      farmerId: user.email,
    }
    const req = createTransportRequest(data)
    setRequests(prev => [req, ...prev])

    // Calculate price
    if (data.pickupLat && data.pickupLng && data.deliveryLat && data.deliveryLng) {
      const dist = calculateDistance(data.pickupLat, data.pickupLng, data.deliveryLat, data.deliveryLng)
      const price = calculatePrice(dist, data.weightKg)
      setPriceInfo({ distance: Math.round(dist * 10) / 10, price })
    }
    resetForm()
  }

  const statusColor = (s) => {
    const map = { pending: 'bg-yellow-50 text-yellow-600', accepted: 'bg-blue-50 text-blue-600', in_transit: 'bg-purple-50 text-purple-600', delivered: 'bg-emerald-50 text-emerald-600', cancelled: 'bg-red-50 text-red-500' }
    return map[s] || 'bg-gray-50 text-gray-500'
  }
  const statusLabel = (s) => {
    const map = { pending: 'Kutilmoqda', accepted: 'Qabul qilingan', in_transit: 'Yo\'lda', delivered: 'Yetkazilgan', cancelled: 'Bekor qilingan' }
    return map[s] || s
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Logistika</h1>
        <p className="text-sm text-gray-500 mt-1">Mahsulotlarni tashish va yetkazib berish</p>
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

      {/* Transport Requests */}
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
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Pickup Lat</label>
                    <input type="number" step="any" name="pickupLat" value={form.pickupLat} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Pickup Lng</label>
                    <input type="number" step="any" name="pickupLng" value={form.pickupLng} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Delivery Lat</label>
                    <input type="number" step="any" name="deliveryLat" value={form.deliveryLat} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Delivery Lng</label>
                    <input type="number" step="any" name="deliveryLng" value={form.deliveryLng} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
                  </div>
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

          {requests.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <p className="text-sm font-medium text-gray-900">Hali so'rov yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map(r => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* Drivers */}
      {tab === 'drivers' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{drivers.length} ta haydovchi</p>
          </div>
          {drivers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm font-medium text-gray-900">Hali haydovchi yo'q</p>
              <p className="text-xs mt-1">Haydovchilar admin tomonidan qo'shiladi</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drivers.map(d => (
                <div key={d.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-semibold">
                      {d.vehicleType[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{d.vehicleType}</p>
                      <p className="text-xs text-gray-400">{d.vehiclePlate}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Max yuk: {d.maxWeightKg} kg</span>
                    <span className={`font-medium ${d.isAvailable ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {d.isAvailable ? "Bo'sh" : 'Band'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Deliveries */}
      {tab === 'deliveries' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">{deliveries.length} ta yetkazib berish</p>
          {deliveries.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm font-medium text-gray-900">Hali yetkazib berishlar yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deliveries.map(d => (
                <div key={d.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">Yetkazib berish #{d.id.slice(0, 8)}</p>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColor(d.status)}`}>{statusLabel(d.status)}</span>
                  </div>
                  <p className="text-xs text-gray-400">Haydovchi ID: {d.driverId?.slice(0, 8) || 'Noma\'lum'}</p>
                  {d.currentLat && d.currentLng && (
                    <p className="text-xs text-gray-400 mt-1">Joriy joy: {d.currentLat}, {d.currentLng}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
