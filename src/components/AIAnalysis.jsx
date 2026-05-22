import { useState, useMemo } from 'react'
import { predictYield, detectDisease, getWeatherAdvisory, getMarketAnalysis } from '../services/ai'

const mainTabs = [
  { id: 'yield', label: 'Hosil bashorati' },
  { id: 'disease', label: 'Kasallik aniqlash' },
  { id: 'weather', label: 'Ob-havo maslahati' },
  { id: 'market', label: 'Bozor tahlili' },
]

const trendIcon = {
  up: 'M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18',
  down: 'M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3',
  stable: 'M3 12h18',
  shortage: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
}

export default function AIAnalysis() {
  const [tab, setTab] = useState('yield')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const [yieldForm, setYieldForm] = useState({ fieldArea: '', cropName: '' })
  const [diseaseImg, setDiseaseImg] = useState(null)
  const [weatherLoc, setWeatherLoc] = useState({ lat: 41.2995, lng: 69.2401 })
  const [marketCat, setMarketCat] = useState('all')

  const marketData = useMemo(() => getMarketAnalysis(), [])

  const runYield = (e) => {
    e.preventDefault()
    if (!yieldForm.fieldArea || !yieldForm.cropName) return
    setLoading(true); setResult(null)
    setTimeout(() => {
      setResult({ type: 'yield', data: predictYield(Number(yieldForm.fieldArea), yieldForm.cropName) })
      setLoading(false)
    }, 800)
  }

  const runDisease = () => {
    if (!diseaseImg) return
    setLoading(true); setResult(null)
    setTimeout(() => {
      setResult({ type: 'disease', data: detectDisease() })
      setLoading(false)
    }, 600)
  }

  const runWeather = () => {
    setLoading(true); setResult(null)
    setTimeout(() => {
      setResult({ type: 'weather', data: getWeatherAdvisory(weatherLoc.lat, weatherLoc.lng) })
      setLoading(false)
    }, 500)
  }

  const filteredProducts = marketCat === 'all'
    ? marketData.products
    : marketData.products.filter(p => p.category === marketCat)

  const maxPriceAll = Math.max(...marketData.products.map(p => p.maxPrice), 1)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">AI Tahlillari</h1>
        <p className="text-sm text-gray-500 mt-1">Sun'iy intellekt yordamida qishloq xo'jaligi tahlillari</p>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {mainTabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setResult(null) }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >{t.label}</button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        {/* ───── HOSIL BASHORATI ───── */}
        {tab === 'yield' && (
          <form onSubmit={runYield}>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Hosil bashorati</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Maydon (gektar)</label>
                <input type="number" step="0.1" value={yieldForm.fieldArea}
                  onChange={e => setYieldForm(p => ({ ...p, fieldArea: e.target.value }))}
                  placeholder="5.5" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Ekin nomi</label>
                <input type="text" value={yieldForm.cropName}
                  onChange={e => setYieldForm(p => ({ ...p, cropName: e.target.value }))}
                  placeholder="Bug'doy" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-medium rounded-xl transition-all"
            >{loading ? 'Hisoblanmoqda...' : 'Bashorat qilish'}</button>
          </form>
        )}

        {/* ───── KASALLIK ANIQLASH ───── */}
        {tab === 'disease' && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Kasallik aniqlash</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-28 h-28 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${diseaseImg ? 'border-emerald-200' : 'border-gray-200'}`}>
                {diseaseImg ? (
                  <img src={diseaseImg} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )}
              </div>
              <div>
                <input type="file" accept="image/*" id="diseaseImg" className="hidden"
                  onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setDiseaseImg(r.result); r.readAsDataURL(f) }} />
                <label htmlFor="diseaseImg" className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-all"
                >Rasm yuklash</label>
                {diseaseImg && <button onClick={() => setDiseaseImg(null)} className="block mt-2 text-xs text-red-500">O'chirish</button>}
              </div>
            </div>
            <button onClick={runDisease} disabled={loading || !diseaseImg}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-medium rounded-xl transition-all"
            >{loading ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}</button>
          </div>
        )}

        {/* ───── OB-HAVO MASLAHATI ───── */}
        {tab === 'weather' && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Ob-havo maslahati</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Kenglik (latitude)</label>
                <input type="number" step="0.0001" value={weatherLoc.lat}
                  onChange={e => setWeatherLoc(p => ({ ...p, lat: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Uzunlik (longitude)</label>
                <input type="number" step="0.0001" value={weatherLoc.lng}
                  onChange={e => setWeatherLoc(p => ({ ...p, lng: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400" />
              </div>
            </div>
            <button onClick={runWeather} disabled={loading}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-medium rounded-xl transition-all"
            >{loading ? 'Yuklanmoqda...' : 'Ma\'lumot olish'}</button>
          </div>
        )}

        {/* ───── BOZOR TAHLILI ───── */}
        {tab === 'market' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
              </svg>
              <h3 className="text-base font-semibold text-gray-900">Bozorlar tahlili</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4 ml-7">O'zbekiston, Qozog'iston, Rossiya va Markaziy Osiyo bozorlari narx tahlili</p>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">{marketData.countries.length}</p>
                <p className="text-[11px] text-gray-400 font-medium">Davlatlar</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M8.25 8.25l3-3 3 3m-3-3v12" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">{marketData.products.length}</p>
                <p className="text-[11px] text-gray-400 font-medium">Mahsulotlar</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">{marketData.categories.length}</p>
                <p className="text-[11px] text-gray-400 font-medium">Kategoriyalar</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-1.5 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">{marketData.recommendations.length}</p>
                <p className="text-[11px] text-gray-400 font-medium">Tavsiyalar</p>
              </div>
            </div>

            {/* Category filter */}
            <div className="flex gap-1.5 mb-5 overflow-x-auto">
              <button onClick={() => setMarketCat('all')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  marketCat === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>Hammasi</button>
              {marketData.categories.map(c => (
                <button key={c.id} onClick={() => setMarketCat(c.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                    marketCat === c.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>{c.icon} {c.label}</button>
              ))}
            </div>

            {/* Product table */}
            <div className="space-y-4">
              {filteredProducts.map(p => {
                const catMeta = marketData.categories.find(c => c.id === p.category)
                return (
                  <div key={p.name} className="border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-all">
                    {/* Product header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{catMeta?.icon || '📦'}</span>
                      <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                      <span className="text-[11px] text-gray-400 ml-auto">{p.avgPrice.toLocaleString()} so'm o'rtacha</span>
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Eng arzon: {marketData.countries.find(c => c.id === p.bestCountry)?.flag} {marketData.countries.find(c => c.id === p.bestCountry)?.name}
                      </span>
                    </div>

                    {/* Price bars per country */}
                    <div className="space-y-1.5">
                      {marketData.countries.map(c => {
                        const price = p.prices[c.id]
                        const tr = p.trends[c.id]
                        const dm = p.demands[c.id]
                        const barWidth = maxPriceAll > 0 ? (price / maxPriceAll) * 100 : 0
                        const isBest = c.id === p.bestCountry

                        return (
                          <div key={c.id} className="flex items-center gap-3">
                            <span className="w-7 text-center text-sm shrink-0">{c.flag}</span>
                            <span className="w-28 text-[11px] text-gray-500 shrink-0 truncate">{c.name}</span>
                            <div className="flex-1 h-6 bg-gray-50 rounded-lg overflow-hidden relative">
                              <div
                                className={`h-full rounded-lg transition-all duration-500 ${
                                  isBest ? 'bg-emerald-500' : tr.dir === 'down' ? 'bg-red-200' : tr.dir === 'shortage' ? 'bg-orange-200' : 'bg-gray-200'
                                }`}
                                style={{ width: `${barWidth}%` }}
                              />
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-gray-800 mix-blend-multiply">
                                {price.toLocaleString()} so'm
                              </span>
                            </div>
                            <svg className={`w-3.5 h-3.5 shrink-0 ${tr.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={trendIcon[tr.dir]} />
                            </svg>
                            <span className={`text-[11px] font-medium w-16 text-right shrink-0 ${tr.color}`}>{tr.label}</span>
                            <span className="text-[11px] text-gray-400 w-10 text-right shrink-0">Talab: {dm.pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recommendations */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-900">Dehqon uchun tavsiyalar</h4>
              </div>
              <div className="space-y-2.5">
                {marketData.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 bg-amber-50 rounded-xl p-3.5">
                    <span className="text-base shrink-0 mt-0.5">{r.icon}</span>
                    <p className="text-sm text-amber-900">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ───── RESULTS ───── */}
        {result && (tab === 'yield' || tab === 'disease' || tab === 'weather') && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            {result.type === 'yield' && (
              <div className="space-y-4">
                <div className="flex items-end gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bashorat qilingan hosil</p>
                    <p className="text-3xl font-bold text-gray-900">{result.data.predictedYieldKg.toLocaleString()} kg</p>
                  </div>
                  <div className="pb-1">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Ishonchlilik: {(result.data.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Tavsiyalar:</p>
                  <ul className="space-y-1.5">
                    {result.data.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {result.type === 'disease' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Aniqlangan kasallik</p>
                    <p className="text-lg font-semibold text-gray-900">{result.data.disease}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Ehtimollik</p>
                    <p className="text-xl font-bold text-gray-900">{(result.data.probability * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Davolash</p>
                    <p className="text-sm font-medium text-gray-900">{result.data.treatment}</p>
                  </div>
                </div>
              </div>
            )}
            {result.type === 'weather' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Harorat', value: `${result.data.temperature}°C`, icon: 'M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z' },
                    { label: 'Namlik', value: `${result.data.humidity}%`, icon: 'M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z' },
                    { label: 'Yog\'in', value: `${result.data.rainfallMm} mm`, icon: 'M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z' },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-emerald-700 mb-0.5">Maslahat</p>
                    <p className="text-sm text-emerald-800">{result.data.advisory}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
