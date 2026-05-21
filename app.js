// Core Dashboard Logic for Dehqon AI

document.addEventListener('DOMContentLoaded', () => {
    // 1. Session Verification & Mock Auto-login
    let currentUser = JSON.parse(localStorage.getItem('dehqon_currentUser'));
    
    if (!currentUser) {
        // Enforce mock auto-login for testing convenience so the page is instantly functional,
        // but users can still sign out and test sign-in / sign-up.
        currentUser = {
            fullName: "Rustam Karimov",
            phone: "+998 90 123 45 67",
            location: "Toshkent viloyati, Qibray",
            role: "fermer",
            joinedDate: "12/05/2023",
            deliveries: 85,
            experience: "3 Yrs"
        };
        localStorage.setItem('dehqon_currentUser', JSON.stringify(currentUser));
        
        // Let's also save this user in users database if not present
        const users = JSON.parse(localStorage.getItem('dehqon_users') || '[]');
        if (!users.some(u => u.phone === currentUser.phone)) {
            currentUser.password = "password123";
            users.push(currentUser);
            localStorage.setItem('dehqon_users', JSON.stringify(users));
        }
    }

    // Update profile displays based on current user
    updateProfileUI(currentUser);

    // 2. Navigation & View Switcher
    const sidebarMenuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    const mobileTabItems = document.querySelectorAll('.mobile-nav-bar .tab-item');
    const views = document.querySelectorAll('.dashboard-view');
    const headerTitle = document.getElementById('header-title');

    const viewTitles = {
        'home': 'Mening Mahsulotlarim',
        'market': 'Qishloq xo\'jaligi bozori',
        'prices': 'Narxlar Tahlili',
        'logistics': 'Logistika & Transport',
        'profile': 'Dehqon Profili'
    };

    function switchTab(tabId) {
        // Update sidebar menu items active class
        sidebarMenuItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update mobile nav bar items active class
        mobileTabItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Switch visible view
        views.forEach(view => {
            view.classList.remove('active');
        });
        const activeView = document.getElementById(`${tabId}-view`);
        if (activeView) {
            activeView.classList.add('active');
        }

        // Update header title
        if (headerTitle && viewTitles[tabId]) {
            headerTitle.textContent = viewTitles[tabId];
        }
    }

    // Set up click handlers for desktop sidebar navigation
    sidebarMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Set up click handlers for mobile bottom navigation bar
    mobileTabItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Link in home view (Bozor Narxlari -> Batafsil)
    const homePricesLink = document.getElementById('home-prices-link');
    if (homePricesLink) {
        homePricesLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('prices');
        });
    }

    // Link in home view (AI Recommendation Banner -> Tahlilni ko'rish)
    const aiBannerActionBtn = document.getElementById('ai-banner-action-btn');
    if (aiBannerActionBtn) {
        aiBannerActionBtn.addEventListener('click', () => {
            switchTab('prices');
            // Switch prices view to AI analytics
            switchPricesSubview('analytics');
        });
    }

    // 3. Prices View Sub-tabs Switching
    const pricesToggleBtns = document.querySelectorAll('.prices-toggle-btn');
    const pricesSubviews = document.querySelectorAll('.prices-subview');

    function switchPricesSubview(subviewId) {
        pricesToggleBtns.forEach(btn => {
            if (btn.getAttribute('data-subview') === subviewId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        pricesSubviews.forEach(view => {
            if (view.getAttribute('id') === `prices-${subviewId}`) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });
    }

    pricesToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const subviewId = btn.getAttribute('data-subview');
            switchPricesSubview(subviewId);
        });
    });

    // 4. Toast Notifications Manager
    const toastContainer = document.getElementById('toast-container');
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
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    // 5. Products Database (Home view)
    // Default initial items
    const defaultCrops = [
        { id: 'crop-1', name: 'Pomidor', price: 4500, qty: 2.5, image: 'images/tomatoes.png', trend: 'up', percentage: '12%' },
        { id: 'crop-2', name: 'Kartoshka', price: 3200, qty: 5.0, image: 'images/potatoes.png', trend: 'down', percentage: '3%' }
    ];

    function loadUserCrops() {
        const crops = JSON.parse(localStorage.getItem(`dehqon_crops_${currentUser.phone}`) || '[]');
        if (crops.length === 0) {
            localStorage.setItem(`dehqon_crops_${currentUser.phone}`, JSON.stringify(defaultCrops));
            return defaultCrops;
        }
        return crops;
    }

    function renderCrops() {
        const crops = loadUserCrops();
        const container = document.getElementById('crop-cards-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        crops.forEach(crop => {
            const trendIcon = crop.trend === 'up' ? 
                `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>` : 
                `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>`;

            const cropCard = document.createElement('div');
            cropCard.className = 'product-card';
            cropCard.innerHTML = `
                <div class="product-card-top">
                    <div class="product-img-wrapper">
                        <img src="${crop.image}" alt="${crop.name}" class="product-img" onerror="this.src='images/tomatoes.png'">
                    </div>
                    <span class="trend-badge ${crop.trend}">
                        ${trendIcon}
                        ${crop.percentage}
                    </span>
                </div>
                <h3 class="product-title">${crop.name}</h3>
                <span class="product-price">${Number(crop.price).toLocaleString()} UZS/kg</span>
                <span class="product-quantity">Hajm: ${crop.qty} tonna</span>
            `;
            container.appendChild(cropCard);
        });
    }

    renderCrops();

    // Add Crop Modal
    const addProductModal = document.getElementById('add-product-modal');
    const openAddProductBtn = document.getElementById('open-add-product-btn');
    const closeAddModalBtn = document.getElementById('close-add-modal-btn');
    const addProductForm = document.getElementById('add-product-form');

    if (openAddProductBtn && addProductModal) {
        openAddProductBtn.addEventListener('click', () => {
            addProductModal.style.display = 'flex';
        });
    }

    if (closeAddModalBtn && addProductModal) {
        closeAddModalBtn.addEventListener('click', () => {
            addProductModal.style.display = 'none';
        });
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const cropType = document.getElementById('modal-crop-select').value;
            const cropName = document.getElementById('modal-crop-name').value.trim();
            const cropPrice = parseFloat(document.getElementById('modal-crop-price').value);
            const cropQty = parseFloat(document.getElementById('modal-crop-qty').value);

            if (!cropName || isNaN(cropPrice) || isNaN(cropQty)) {
                showToast("Barcha maydonlarni to'g'ri to'ldiring.", 'error');
                return;
            }

            // Map crop type to correct image asset
            let cropImage = 'images/tomatoes.png';
            if (cropType === 'kartoshka') cropImage = 'images/potatoes.png';
            if (cropType === 'karam') cropImage = 'images/cabbage.png';
            if (cropType === 'olma') cropImage = 'images/cabbage.png'; // default fallback or other

            const newCrop = {
                id: 'crop-' + Date.now(),
                name: cropName,
                price: cropPrice,
                qty: cropQty,
                image: cropImage,
                trend: Math.random() > 0.5 ? 'up' : 'down',
                percentage: Math.floor(Math.random() * 15 + 1) + '%'
            };

            const crops = loadUserCrops();
            crops.push(newCrop);
            localStorage.setItem(`dehqon_crops_${currentUser.phone}`, JSON.stringify(crops));
            
            renderCrops();
            
            addProductForm.reset();
            addProductModal.style.display = 'none';
            showToast("Ekin muvaffaqiyatli qo'shildi!");
        });
    }

    // 6. Market Counters & Ordering (Market View)
    const marketCards = document.querySelectorAll('.market-card');
    marketCards.forEach(card => {
        const minusBtn = card.querySelector('.minus-btn');
        const plusBtn = card.querySelector('.plus-btn');
        const counterVal = card.querySelector('.counter-value');
        const orderBtn = card.querySelector('.btn-market-order');

        if (minusBtn && plusBtn && counterVal) {
            minusBtn.addEventListener('click', () => {
                let val = parseInt(counterVal.getAttribute('data-val'));
                if (val > 1) {
                    val--;
                    counterVal.setAttribute('data-val', val);
                    counterVal.textContent = val;
                }
            });

            plusBtn.addEventListener('click', () => {
                let val = parseInt(counterVal.getAttribute('data-val'));
                val++;
                counterVal.setAttribute('data-val', val);
                counterVal.textContent = val;
            });
        }

        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                const productName = orderBtn.getAttribute('data-product');
                const quantity = counterVal ? counterVal.textContent : '1';
                showToast(`Buyurtma qabul qilindi: ${quantity} tonna ${productName}`, 'success');
            });
        }
    });

    // 7. Live Pricing Update System (Prices View)
    const editPriceModal = document.getElementById('edit-price-modal');
    const closePriceModalBtn = document.getElementById('close-price-modal-btn');
    const editPriceForm = document.getElementById('edit-price-form');
    const editPriceCropId = document.getElementById('edit-price-crop-id');
    const editPriceInput = document.getElementById('edit-price-input');
    const priceModalTitle = document.getElementById('price-modal-title');

    // Default My Prices setup
    const defaultMyPrices = {
        pomidor: 12000,
        kartoshka: 4500,
        olma: null
    };

    function loadMyPrices() {
        const myPrices = JSON.parse(localStorage.getItem(`dehqon_myprices_${currentUser.phone}`));
        if (!myPrices) {
            localStorage.setItem(`dehqon_myprices_${currentUser.phone}`, JSON.stringify(defaultMyPrices));
            return defaultMyPrices;
        }
        return myPrices;
    }

    function renderMyPrices() {
        const myPrices = loadMyPrices();
        
        // Update Tomato
        const pomidorEl = document.getElementById('my-price-pomidor');
        if (pomidorEl) {
            pomidorEl.textContent = myPrices.pomidor ? `${myPrices.pomidor.toLocaleString()} UZS` : 'O\'rnatilmagan';
        }
        
        // Update Potato
        const kartoshkaEl = document.getElementById('my-price-kartoshka');
        if (kartoshkaEl) {
            kartoshkaEl.textContent = myPrices.kartoshka ? `${myPrices.kartoshka.toLocaleString()} UZS` : 'O\'rnatilmagan';
        }

        // Update Apples
        const olmaEl = document.getElementById('my-price-olma');
        if (olmaEl) {
            if (myPrices.olma) {
                olmaEl.textContent = `${myPrices.olma.toLocaleString()} UZS`;
                olmaEl.style.color = 'var(--text-main)';
                olmaEl.style.fontWeight = '700';
                // replace "Add Price" button with edit icon if price exists
                const parent = olmaEl.parentElement;
                const addBtn = parent.querySelector('.btn-add-price');
                if (addBtn) {
                    addBtn.className = 'btn-edit-price';
                    addBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                    `;
                    // reattach edit listener
                    addBtn.addEventListener('click', () => openEditPriceModal('olma'));
                }
            } else {
                olmaEl.textContent = 'O\'rnatilmagan';
                olmaEl.style.color = 'var(--text-muted)';
                olmaEl.style.fontWeight = 'normal';
            }
        }
    }

    renderMyPrices();

    function openEditPriceModal(cropId) {
        if (!editPriceModal) return;
        const myPrices = loadMyPrices();
        editPriceCropId.value = cropId;
        
        const cropNames = {
            pomidor: 'Red Tomatoes',
            kartoshka: 'Potatoes',
            olma: 'Apples (Fuji)'
        };
        
        priceModalTitle.textContent = `${cropNames[cropId] || 'Mahsulot'} Narxini Tahrirlash`;
        editPriceInput.value = myPrices[cropId] || '';
        editPriceModal.style.display = 'flex';
    }

    // Attach listeners to all edit buttons
    const editPriceBtns = document.querySelectorAll('.btn-edit-price, .btn-add-price');
    editPriceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cropId = btn.getAttribute('data-crop');
            openEditPriceModal(cropId);
        });
    });

    if (closePriceModalBtn && editPriceModal) {
        closePriceModalBtn.addEventListener('click', () => {
            editPriceModal.style.display = 'none';
        });
    }

    if (editPriceForm) {
        editPriceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cropId = editPriceCropId.value;
            const priceVal = parseInt(editPriceInput.value);

            if (isNaN(priceVal) || priceVal <= 0) {
                showToast("To'g'ri narx kiriting.", "error");
                return;
            }

            const myPrices = loadMyPrices();
            myPrices[cropId] = priceVal;
            localStorage.setItem(`dehqon_myprices_${currentUser.phone}`, JSON.stringify(myPrices));
            
            renderMyPrices();
            editPriceModal.style.display = 'none';
            showToast("Sizning narxingiz yangilandi!");
        });
    }

    // 8. Logged-in User Profile UI Sync
    function updateProfileUI(user) {
        // Sidebar profile panel
        const sidebarName = document.getElementById('sidebar-user-name');
        const sidebarRole = document.getElementById('sidebar-user-role');
        const sidebarAvatar = document.getElementById('sidebar-user-avatar');
        
        if (sidebarName) sidebarName.textContent = user.fullName;
        if (sidebarRole) sidebarRole.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        if (sidebarAvatar && user.role === 'fermer') {
            sidebarAvatar.src = 'images/farmer_avatar.png';
        }

        // Profile view panel
        const profileName = document.getElementById('profile-user-name');
        const profileLocation = document.getElementById('profile-user-location');
        const profileDeliveries = document.getElementById('profile-user-deliveries');
        const profileExperience = document.getElementById('profile-user-experience');
        const profileAvatar = document.getElementById('profile-user-avatar');

        if (profileName) profileName.textContent = user.fullName;
        if (profileLocation) profileLocation.textContent = user.location || 'O\'zbekiston';
        if (profileDeliveries) {
            profileDeliveries.textContent = user.deliveries !== null ? user.deliveries : '-';
        }
        if (profileExperience) {
            profileExperience.textContent = user.experience !== null ? user.experience : '-';
        }
        if (profileAvatar && user.role === 'fermer') {
            profileAvatar.src = 'images/farmer_avatar.png';
        }
    }

    // 9. Sign Out Action handlers
    function handleSignout() {
        localStorage.removeItem('dehqon_currentUser');
        showToast("Tizimdan chiqdingiz.", "info");
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 1000);
    }

    const sidebarSignoutBtn = document.getElementById('sidebar-signout-btn');
    if (sidebarSignoutBtn) {
        sidebarSignoutBtn.addEventListener('click', handleSignout);
    }

    const mobileSignoutBtn = document.getElementById('mobile-signout-btn');
    if (mobileSignoutBtn) {
        mobileSignoutBtn.addEventListener('click', handleSignout);
    }

    // 10. Click notification bell simulation
    const bellBtn = document.getElementById('notification-bell-btn');
    if (bellBtn) {
        bellBtn.addEventListener('click', () => {
            showToast("Yangi bildirishnomalar yo'q.", "info");
            const badge = bellBtn.querySelector('.bell-badge');
            if (badge) badge.remove(); // clear badge on click
        });
    }
});
