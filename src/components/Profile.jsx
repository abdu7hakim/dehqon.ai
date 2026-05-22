import { logout } from '../services/auth'

export default function Profile({ user, onLogout }) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-emerald-500 to-green-600" />
        <div className="px-6 pb-6">
          <div className="flex justify-center -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full bg-emerald-600 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {user.role === 'sotuvchi' ? 'Sotuvchi / Dehqon' : 'Haridor'}
            </span>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            {[
              ['Ism', user.firstName],
              ['Familiya', user.lastName],
              ['Email', user.email],
              ['Rol', user.role === 'sotuvchi' ? 'Sotuvchi' : 'Haridor'],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{val}</span>
              </div>
            ))}
          </div>

          <button onClick={() => { logout(); onLogout() }}
            className="w-full mt-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Tizimdan chiqish
          </button>
        </div>
      </div>
    </div>
  )
}
