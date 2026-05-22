const FARMS_KEY = 'dehqon_farms'

export function getFarms() {
  return JSON.parse(localStorage.getItem(FARMS_KEY) || '[]')
}

export function saveFarms(farms) {
  localStorage.setItem(FARMS_KEY, JSON.stringify(farms))
}

export function createFarm(data) {
  const farms = getFarms()
  const farm = { id: Date.now() + Math.random(), ...data, fields: [], createdAt: new Date().toISOString() }
  saveFarms([...farms, farm])
  return farm
}

export function addField(farmId, data) {
  const farms = getFarms()
  const farm = farms.find(f => f.id === farmId)
  if (!farm) return null
  const field = { id: Date.now() + Math.random(), farmId, ...data, createdAt: new Date().toISOString() }
  farm.fields.push(field)
  saveFarms(farms)
  return field
}
