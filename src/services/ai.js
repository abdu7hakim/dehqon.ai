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
