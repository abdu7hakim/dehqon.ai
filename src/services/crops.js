const CROPS_KEY = 'dehqon_crops'
const PLANTINGS_KEY = 'dehqon_plantings'

export function getCrops() {
  return JSON.parse(localStorage.getItem(CROPS_KEY) || '[]')
}

export function saveCrops(crops) {
  localStorage.setItem(CROPS_KEY, JSON.stringify(crops))
}

export function createCrop(data) {
  const crops = getCrops()
  const crop = { id: Date.now() + Math.random(), ...data, createdAt: new Date().toISOString() }
  saveCrops([...crops, crop])
  return crop
}

export function getPlantings() {
  return JSON.parse(localStorage.getItem(PLANTINGS_KEY) || '[]')
}

export function savePlantings(plantings) {
  localStorage.setItem(PLANTINGS_KEY, JSON.stringify(plantings))
}

export function createPlanting(data) {
  const plantings = getPlantings()
  const planting = { id: Date.now() + Math.random(), ...data, status: 'active', createdAt: new Date().toISOString() }
  savePlantings([...plantings, planting])
  return planting
}

export function harvestPlanting(id) {
  const plantings = getPlantings()
  const p = plantings.find(p => p.id === id)
  if (!p) return null
  p.status = 'harvested'
  p.actualHarvestDate = new Date().toISOString().split('T')[0]
  savePlantings(plantings)
  return p
}
