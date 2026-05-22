const REQUESTS_KEY = 'dehqon_transport_requests'
const DRIVERS_KEY = 'dehqon_drivers'
const DELIVERIES_KEY = 'dehqon_deliveries'

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
