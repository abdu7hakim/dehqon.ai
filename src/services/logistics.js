const REQUESTS_KEY = 'dehqon_transport_requests'
const DRIVERS_KEY = 'dehqon_drivers'
const DELIVERIES_KEY = 'dehqon_deliveries'

/* ─── Seeded mock data ─── */
const SEEDED_KEY = 'dehqon_logistics_seeded'

function seed() {
  if (localStorage.getItem(SEEDED_KEY)) return

  const drivers = [
    { id: 'drv-1', name: 'Akmal Karimov', vehicleType: 'ZIL-130', vehiclePlate: '01 A 123 BB', maxWeightKg: 5000, isAvailable: true, lat: 41.3112, lng: 69.2797, phone: '+998 90 123 45 67' },
    { id: 'drv-2', name: 'Botir Rahimov', vehicleType: 'MAN TGS', vehiclePlate: '01 B 456 CC', maxWeightKg: 12000, isAvailable: true, lat: 41.2628, lng: 69.2157, phone: '+998 91 234 56 78' },
    { id: 'drv-3', name: 'Jasur Toshmatov', vehicleType: 'GAZ-3302', vehiclePlate: '01 C 789 DD', maxWeightKg: 1500, isAvailable: false, lat: 41.3301, lng: 69.3022, phone: '+998 93 345 67 89' },
    { id: 'drv-4', name: 'Shavkat Ergashev', vehicleType: 'HOWO 6x4', vehiclePlate: '01 D 012 EE', maxWeightKg: 25000, isAvailable: true, lat: 41.2785, lng: 69.1926, phone: '+998 94 456 78 90' },
  ]
  localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers))

  const deliveries = [
    {
      id: 'del-1', driverId: 'drv-3', requestId: 'req-1',
      pickupAddress: 'Toshkent, Chilonzor', deliveryAddress: 'Samarqand, Registon',
      pickupLat: 41.2995, pickupLng: 69.2401, deliveryLat: 39.6542, deliveryLng: 66.9597,
      status: 'in_transit',
      currentLat: 40.420, currentLng: 67.830,
      progress: 0.55, weightKg: 800, description: 'Olma 800 kg',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      startedAt: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: 'del-2', driverId: 'drv-1', requestId: 'req-2',
      pickupAddress: 'Andijon, Bozor', deliveryAddress: 'Toshkent, Oloy bozori',
      pickupLat: 40.7821, pickupLng: 72.3442, deliveryLat: 41.3225, deliveryLng: 69.2727,
      status: 'delivered',
      currentLat: 41.3225, currentLng: 69.2727,
      progress: 1, weightKg: 2000, description: 'Kartoshka 2 tonna',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      startedAt: new Date(Date.now() - 129600000).toISOString(),
      deliveredAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'del-3', driverId: 'drv-4', requestId: 'req-3',
      pickupAddress: 'Buxoro, Bog\'', deliveryAddress: 'Farg\'ona, Bozor',
      pickupLat: 39.7747, pickupLng: 64.4286, deliveryLat: 40.3864, deliveryLng: 71.7864,
      status: 'pending',
      currentLat: 39.7747, currentLng: 64.4286,
      progress: 0, weightKg: 3000, description: 'Uzum 3 tonna',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]
  localStorage.setItem(DELIVERIES_KEY, JSON.stringify(deliveries))

  const requests = [
    {
      id: 'req-1', pickupAddress: 'Toshkent, Chilonzor', deliveryAddress: 'Samarqand, Registon',
      pickupLat: 41.2995, pickupLng: 69.2401, deliveryLat: 39.6542, deliveryLng: 66.9597,
      weightKg: 800, description: 'Olma 800 kg', farmerId: 'fermer@mail.com',
      status: 'in_transit', createdAt: new Date(Date.now() - 86400000).toISOString(), driverId: 'drv-3',
    },
    {
      id: 'req-2', pickupAddress: 'Andijon, Bozor', deliveryAddress: 'Toshkent, Oloy bozori',
      pickupLat: 40.7821, pickupLng: 72.3442, deliveryLat: 41.3225, deliveryLng: 69.2727,
      weightKg: 2000, description: 'Kartoshka 2 tonna', farmerId: 'fermer@mail.com',
      status: 'delivered', createdAt: new Date(Date.now() - 172800000).toISOString(), driverId: 'drv-1',
    },
    {
      id: 'req-3', pickupAddress: 'Buxoro, Bog\'', deliveryAddress: 'Farg\'ona, Bozor',
      pickupLat: 39.7747, pickupLng: 64.4286, deliveryLat: 40.3864, deliveryLng: 71.7864,
      weightKg: 3000, description: 'Uzum 3 tonna', farmerId: 'fermer@mail.com',
      status: 'pending', createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))

  localStorage.setItem(SEEDED_KEY, '1')
}

seed()

/* ─── CRUD ─── */

export function getTransportRequests() {
  return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]')
}

export function createTransportRequest(data) {
  const requests = getTransportRequests()
  const req = { id: Date.now() + Math.random(), ...data, status: 'pending', createdAt: new Date().toISOString() }
  localStorage.setItem(REQUESTS_KEY, JSON.stringify([...requests, req]))
  return req
}

export function getDrivers() {
  return JSON.parse(localStorage.getItem(DRIVERS_KEY) || '[]')
}

export function createDriver(data) {
  const drivers = getDrivers()
  const driver = { id: Date.now() + Math.random(), ...data, isAvailable: true }
  localStorage.setItem(DRIVERS_KEY, JSON.stringify([...drivers, driver]))
  return driver
}

export function getDeliveries() {
  return JSON.parse(localStorage.getItem(DELIVERIES_KEY) || '[]')
}

export function updateDeliveryProgress(id, { lat, lng, progress, status }) {
  const deliveries = getDeliveries()
  const idx = deliveries.findIndex(d => d.id === id)
  if (idx === -1) return null
  const upd = { ...deliveries[idx] }
  if (lat !== undefined) upd.currentLat = lat
  if (lng !== undefined) upd.currentLng = lng
  if (progress !== undefined) upd.progress = progress
  if (status !== undefined) upd.status = status
  deliveries[idx] = upd
  localStorage.setItem(DELIVERIES_KEY, JSON.stringify(deliveries))
  return upd
}

export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dlat = (lat2 - lat1) * Math.PI / 180
  const dlng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dlng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function calculatePrice(distanceKm, weightKg) {
  return Math.round(distanceKm * 0.5 + weightKg * 0.05 * 100) / 100
}
