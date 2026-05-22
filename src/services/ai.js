export function predictYield(fieldArea) {
  const base = 2000 + Math.random() * 6000
  const confidence = 0.7 + Math.random() * 0.25
  return {
    predictedYieldKg: Math.round(base * fieldArea * 100) / 100,
    confidence: Math.round(confidence * 100) / 100,
    recommendations: [
      'Suv tejovchi tomchilatib sug\'orish tizimidan foydalaning',
      'Tuproq namligini muntazam tekshirib turing',
      'Organik o\'g\'itlardan foydalanish hosilni oshiradi',
    ],
  }
}

export function detectDisease() {
  const diseases = [
    { disease: 'Unshudring (powdery mildew)', probability: 0.87, treatment: 'Fungitsid püskürtme' },
    { disease: 'Zang (rust)', probability: 0.92, treatment: 'Azotli o\'g\'itlarni kamaytiring' },
    { disease: 'Fusarium so\'lishi', probability: 0.78, treatment: 'Tuproqni almashtirish tavsiya etiladi' },
    { disease: 'Barg dog\'i (leaf spot)', probability: 0.83, treatment: 'Barglarni muntazam tozalang' },
  ]
  return diseases[Math.floor(Math.random() * diseases.length)]
}

export function getWeatherAdvisory() {
  const temp = Math.round((15 + Math.random() * 25) * 10) / 10
  const humidity = Math.round((30 + Math.random() * 60) * 10) / 10
  const rainfall = Math.round(Math.random() * 25 * 10) / 10

  let advisory
  if (temp > 35) advisory = 'Havo juda issiq. Ekinlarni ertalab va kechqurun sug\'oring.'
  else if (rainfall > 20) advisory = 'Kuchli yog\'ingarchilik kutilmoqda. Drenaj tizimini tekshiring.'
  else if (humidity > 75) advisory = 'Namlik yuqori. Zamburug\'li kasalliklardan ehtiyot bo\'ling.'
  else advisory = 'Ob-havo qulay. Rejalashtirilgan ishlarni bajaring.'

  return { temperature: temp, humidity, rainfallMm: rainfall, advisory }
}

/* ─── Bozor tahlili ─── */

const countries = [
  { id: 'uz', name: "O'zbekiston", flag: '🇺🇿' },
  { id: 'kz', name: 'Qozog\'iston', flag: '🇰🇿' },
  { id: 'ru', name: 'Rossiya', flag: '🇷🇺' },
  { id: 'kg', name: 'Qirg\'iziston', flag: '🇰🇬' },
  { id: 'tj', name: 'Tojikiston', flag: '🇹🇯' },
  { id: 'tm', name: 'Turkmaniston', flag: '🇹🇲' },
]

const categories = [
  { id: 'fruits', label: 'Mevalar', icon: '🍎' },
  { id: 'vegetables', label: 'Sabzavotlar', icon: '🥬' },
  { id: 'grains', label: 'Don mahsulotlari', icon: '🌾' },
]

function rnd(base, variance) {
  return Math.round((base + (Math.random() - 0.5) * variance) / 100) * 100
}

function trend() {
  const t = Math.random()
  if (t < 0.35) return { dir: 'up', label: 'Oshmoqda', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  if (t < 0.6) return { dir: 'down', label: 'Tushmoqda', color: 'text-red-500', bg: 'bg-red-50' }
  if (t < 0.8) return { dir: 'stable', label: 'Barqaror', color: 'text-blue-600', bg: 'bg-blue-50' }
  return { dir: 'shortage', label: 'Tanqis', color: 'text-orange-600', bg: 'bg-orange-50' }
}

function demandLevel() {
  const t = Math.random()
  if (t < 0.3) return { level: 'high', label: 'Yuqori', pct: 75 + Math.round(Math.random() * 20) }
  if (t < 0.65) return { level: 'medium', label: "O'rtacha", pct: 45 + Math.round(Math.random() * 25) }
  return { level: 'low', label: 'Past', pct: 15 + Math.round(Math.random() * 25) }
}

const productTemplates = [
  { name: 'Olma', base: 8000, cat: 'fruits' },
  { name: 'Uzum', base: 12000, cat: 'fruits' },
  { name: "O'rik", base: 15000, cat: 'fruits' },
  { name: 'Shaftoli', base: 18000, cat: 'fruits' },
  { name: 'Anor', base: 20000, cat: 'fruits' },
  { name: 'Pomidor', base: 5000, cat: 'vegetables' },
  { name: 'Bodring', base: 4000, cat: 'vegetables' },
  { name: 'Kartoshka', base: 3000, cat: 'vegetables' },
  { name: 'Piyoz', base: 2500, cat: 'vegetables' },
  { name: 'Sabzi', base: 3000, cat: 'vegetables' },
  { name: 'Karam', base: 3500, cat: 'vegetables' },
  { name: 'Bug\'doy', base: 4500, cat: 'grains' },
  { name: 'Arpa', base: 3500, cat: 'grains' },
  { name: 'Makkajo\'xori', base: 4000, cat: 'grains' },
  { name: 'Sholi', base: 10000, cat: 'grains' },
]

const countryPriceFactors = {
  uz: 1, kz: 1.3, ru: 1.6, kg: 0.9, tj: 0.8, tm: 1.1,
}

export function getMarketAnalysis() {
  const products = productTemplates.map(t => {
    const prices = {}
    const trends = {}
    const demands = {}
    let maxPrice = 0

    countries.forEach(c => {
      const p = rnd(t.base * countryPriceFactors[c.id], t.base * 0.4)
      prices[c.id] = p
      if (p > maxPrice) maxPrice = p
      trends[c.id] = trend()
      demands[c.id] = demandLevel()
    })

    const bestCountry = countries.reduce((best, c) => prices[c.id] < prices[best.id] ? c : best)
    const bestPrice = prices[bestCountry.id]

    return {
      name: t.name,
      category: t.cat,
      prices,
      trends,
      demands,
      bestCountry: bestCountry.id,
      bestPrice,
      maxPrice,
      avgPrice: Math.round(countries.reduce((s, c) => s + prices[c.id], 0) / countries.length),
    }
  })

  // Insights & recommendations
  const rising = products.filter(p => Object.values(p.trends).filter(t => t.dir === 'up').length >= 3)
  const shortages = products.filter(p => Object.values(p.trends).filter(t => t.dir === 'shortage').length >= 2)
  const highDemand = products.filter(p => Object.values(p.demands).filter(d => d.level === 'high').length >= 3)

  const recommendations = [
    ...rising.slice(0, 2).map(p => ({
      icon: '📈',
      text: `${p.name} narxi bir necha davlatlarda oshmoqda. Yetishtirish foydali bo'lishi mumkin.`,
    })),
    ...shortages.slice(0, 2).map(p => ({
      icon: '⚠️',
      text: `${p.name} bozorda tanqis. Narxlar yuqori, talab katta.`,
    })),
    ...highDemand.slice(0, 2).map(p => ({
      icon: '🔥',
      text: `${p.name} ga talab yuqori. Eksport qilish imkoniyatini ko'rib chiqing.`,
    })),
  ]

  if (recommendations.length === 0) {
    recommendations.push({
      icon: '📊',
      text: 'Bozor nisbatan barqaror. Mahsulot sifati va logistikaga e\'tibor qarating.',
    })
  }

  return { products, countries, categories, recommendations }
}
