// Authentication Manager for Dehqon AI

document.addEventListener('DOMContentLoaded', () => {
    // Shared Elements
    const passwordToggleBtn = document.getElementById('password-toggle-btn');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    const roleCards = document.querySelectorAll('.role-card');
    const toastContainer = document.getElementById('toast-container');
    
    let selectedRole = 'fermer'; // Default role

    // 1. Password Visibility Toggle
    if (passwordToggleBtn && passwordInput) {
        passwordToggleBtn.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Toggle eye icon appearance
            if (isPassword) {
                eyeIcon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                `;
            } else {
                eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                `;
            }
        });
    }

    // 2. Role Selector Actions
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedRole = card.getAttribute('data-role');
        });
    });

    // 3. Uzbek Phone Number Auto-formatter & Validator
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value;
            // Always ensure it starts with +998
            if (!value.startsWith('+998')) {
                value = '+998' + value.replace(/\D/g, '');
            }
            
            // Limit character length to Uzbek format standard length: +998 XX XXX XX XX (13 digits)
            let rawNumbers = value.substring(4).replace(/\D/g, '');
            if (rawNumbers.length > 9) {
                rawNumbers = rawNumbers.substring(0, 9);
            }
            
            // Format display for visual elegance: +998 (XX) XXX-XX-XX
            let formatted = '+998';
            if (rawNumbers.length > 0) {
                formatted += ' ' + rawNumbers.substring(0, 2);
            }
            if (rawNumbers.length > 2) {
                formatted += ' ' + rawNumbers.substring(2, 5);
            }
            if (rawNumbers.length > 5) {
                formatted += ' ' + rawNumbers.substring(5, 7);
            }
            if (rawNumbers.length > 7) {
                formatted += ' ' + rawNumbers.substring(7, 9);
            }
            
            e.target.value = formatted;
        });

        phoneInput.addEventListener('keydown', (e) => {
            // Prevent deleting +998
            const value = e.target.value;
            if (e.key === 'Backspace' && value.length <= 4) {
                e.preventDefault();
            }
        });
    }

    // 4. Toast Notifications System
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconSVG = type === 'success' ? 
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>` :
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
            
        toast.innerHTML = `
            <div class="toast-icon">${iconSVG}</div>
            <div class="toast-message">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 3.5 seconds with fade-out
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    // 5. Sign Up Processing
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phone').value.replace(/\s/g, ''); // strip spaces
            const region = document.getElementById('addressRegion').value.trim();
            const district = document.getElementById('addressDistrict').value.trim();
            const password = passwordInput.value;

            // Validation
            if (!fullName || fullName.length < 3) {
                showToast("Iltimos, to'liq ism va familiyangizni kiriting.", 'error');
                return;
            }
            if (phone.length < 13) {
                showToast("Telefon raqami noto'g'ri kiritilgan. (+998XXXXXXXXX)", 'error');
                return;
            }
            if (!region) {
                showToast("Iltimos, viloyatingizni kiriting.", 'error');
                return;
            }
            if (!district) {
                showToast("Iltimos, tuman yoki shahringizni kiriting.", 'error');
                return;
            }
            if (!password || password.length < 6) {
                showToast("Parol kamida 6 ta belgidan iborat bo'lishi kerak.", 'error');
                return;
            }

            // Retrieve existing users database
            const users = JSON.parse(localStorage.getItem('dehqon_users') || '[]');
            
            // Check if user already exists
            const userExists = users.some(u => u.phone === phone && u.role === selectedRole);
            if (userExists) {
                showToast("Ushbu raqam va rol bilan ro'yxatdan o'tilgan. Tizimga kiring.", 'error');
                return;
            }

            // Create new user profile
            const newUser = {
                fullName,
                phone,
                location: `${region}, ${district}`,
                role: selectedRole,
                password, // stored plain for demo mock auth purposes
                joinedDate: new Date().toLocaleDateString('uz-UZ'),
                deliveries: selectedRole === 'fermer' ? 0 : null,
                experience: selectedRole === 'fermer' ? 'Yangi' : null
            };

            users.push(newUser);
            localStorage.setItem('dehqon_users', JSON.stringify(users));
            
            // Log user in automatically
            localStorage.setItem('dehqon_currentUser', JSON.stringify(newUser));
            
            showToast("Muvaffaqiyatli ro'yxatdan o'tdingiz!", 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // 6. Sign In Processing
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const phone = document.getElementById('phone').value.replace(/\s/g, ''); // strip spaces
            const password = passwordInput.value;

            if (phone.length < 13) {
                showToast("Telefon raqami noto'g'ri kiritilgan.", 'error');
                return;
            }
            if (!password) {
                showToast("Iltimos, parolingizni kiriting.", 'error');
                return;
            }

            // Look up users in localStorage
            const users = JSON.parse(localStorage.getItem('dehqon_users') || '[]');
            
            // Add a mock default user (Rustam Karimov) if DB is empty to ease user testing
            if (users.length === 0) {
                const defaultUser = {
                    fullName: "Rustam Karimov",
                    phone: "+998901234567",
                    location: "Toshkent viloyati, Qibray",
                    role: "fermer",
                    password: "password123",
                    joinedDate: "12/05/2023",
                    deliveries: 85,
                    experience: "3 Yrs"
                };
                users.push(defaultUser);
                localStorage.setItem('dehqon_users', JSON.stringify(users));
            }

            // Find matching user with correct role, phone and password
            const user = users.find(u => u.phone === phone && u.password === password && u.role === selectedRole);

            if (!user) {
                showToast("Telefon raqami, parol yoki rol noto'g'ri kiritildi.", 'error');
                return;
            }

            // Success login session
            localStorage.setItem('dehqon_currentUser', JSON.stringify(user));
            showToast("Tizimga muvaffaqiyatli kirdingiz!", 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // 7. Forgot Password Trigger
    const forgotLink = document.getElementById('forgot-password-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast("Parolni tiklash kodi telefon raqamingizga yuborildi (Simulyatsiya).", 'info');
        });
    }
});
