import { useState } from 'react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if (isLogin) {
      console.log('Login attempt');
    } else {
      console.log('Signup attempt');
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setFormData(prev => ({
      ...prev,
      cardNumber: value
    }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setFormData(prev => ({
      ...prev,
      cardExpiry: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Side - Images and Logo */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-2">Dehqon AI</h1>
              <p className="text-emerald-100">Ziroatchilikni raqamlash</p>
            </div>
            
            {/* Placeholder for random agriculture image */}
            <div className="w-full h-64 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-6 backdrop-blur-sm">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-white mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
                <p className="text-sm text-emerald-100">Ziroatchilik rasmlari</p>
              </div>
            </div>

            <div className="w-full space-y-2 text-sm text-emerald-100">
              <p>✓ Mahsulotlarni savdosi</p>
              <p>✓ Sotuvchilar uchun himoya</p>
              <p>✓ Xavfsiz to'lovlar</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {/* Tab Switcher */}
            <div className="flex gap-0 mb-8 bg-gray-100 rounded-lg p-1 w-full">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    cardNumber: '',
                    cardExpiry: '',
                    cardCVC: '',
                  });
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  isLogin
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kirish
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    cardNumber: '',
                    cardExpiry: '',
                    cardCVC: '',
                  });
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                  !isLogin
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ro'yxatdan O'tish
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields - Only for signup */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ism
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Ism kiriting"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Familiya
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Familiya kiriting"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parol
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Parol kiriting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  required
                />
              </div>

              {/* Confirm Password - Only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parolni Tasdiqlang
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Parolni qayta kiriting"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    required
                  />
                </div>
              )}

              {/* Card Details - Only for signup */}
              {!isLogin && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">To'lov Kartasi Ma'lumotlari</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Karta Raqami
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      maxLength="19"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Muddati (MM/YY)
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                          setFormData(prev => ({
                            ...prev,
                            cardCVC: value
                          }));
                        }}
                        placeholder="000"
                        maxLength="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>{isLogin ? 'Kirish' : 'Ro\'yxatdan O\'tish'}</span>
              </button>

              {/* Toggle Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                {isLogin ? "Akkauntingiz yo'q? " : "Akkauntingiz bor? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                >
                  {isLogin ? 'Ro\'yxatdan O\'ting' : 'Kiring'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Logo - Shows only on mobile */}
      <div className="md:hidden fixed bottom-4 right-4 text-center">
        <h2 className="text-2xl font-bold text-white">Dehqon AI</h2>
        <p className="text-emerald-300 text-xs">Ziroatchilikni raqamlash</p>
      </div>
    </div>
  );
}
