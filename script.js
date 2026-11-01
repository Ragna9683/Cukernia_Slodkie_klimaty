/* ==========================================================================
   Cukiernia Słodkie Klimaty Radzymin - Core JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. CANVAS: Soft Floating Particles --- */
    const canvas = document.getElementById('canvas-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            const particleCount = window.innerWidth < 768 ? 30 : 60;
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 3 + 1,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx = -p.vx;
                if (p.y < 0 || p.y > height) p.vy = -p.vy;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(214, 51, 108, ${p.opacity})`; // Berry tint
                ctx.fill();
            });
            requestAnimationFrame(drawParticles);
        }

        initCanvas();
        drawParticles();
        window.addEventListener('resize', initCanvas);
    }

    /* --- 2. MOBILE MENU BURGER --- */
    const burgerBtn = document.getElementById('burger-btn');
    const mainNav = document.getElementById('main-nav');
    if (burgerBtn && mainNav) {
        burgerBtn.addEventListener('click', () => mainNav.classList.toggle('active'));
        mainNav.querySelectorAll('.nav__link, .btn').forEach(link => {
            link.addEventListener('click', () => mainNav.classList.remove('active'));
        });
    }

    /* --- 3. CAKE CALCULATOR LOGIC --- */
    const portionSlider = document.getElementById('portion-slider');
    const sliderDisplay = document.getElementById('slider-val-display');
    const flavorSelect = document.getElementById('flavor-select');
    const calcEstimatedPrice = document.getElementById('calc-estimated-price');
    const orderDetailsInput = document.getElementById('order-details');
    
    // Base price per kg
    const PRICE_PER_KG = 90; 

    function updateCalculator() {
        if(!portionSlider || !sliderDisplay) return;
        
        const weight = parseFloat(portionSlider.value);
        const guestsMin = Math.floor(weight * 6);
        const guestsMax = Math.floor(weight * 7.5);
        
        // Update display text
        sliderDisplay.textContent = `${weight.toFixed(1)} kg (ok. ${guestsMin}-${guestsMax} porcji)`;
        
        // Calculate price
        const price = Math.round(weight * PRICE_PER_KG);
        calcEstimatedPrice.textContent = `ok. ${price} zł`;
        
        // Pre-fill drawer text area
        const flavor = flavorSelect.options[flavorSelect.selectedIndex].text;
        const notes = document.getElementById('calc-notes').value;
        if(orderDetailsInput) {
            orderDetailsInput.value = `TORT: ${weight.toFixed(1)} kg\nSMAK: ${flavor}\nCENA SZACUNKOWA: ok. ${price} zł${notes ? '\nUWAGI: ' + notes : ''}`;
        }
    }

    if(portionSlider) {
        portionSlider.addEventListener('input', updateCalculator);
        flavorSelect.addEventListener('change', updateCalculator);
        document.getElementById('calc-notes').addEventListener('input', updateCalculator);
        updateCalculator(); // init
    }

    /* --- 4. CATALOG TABS --- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });

    /* --- 5. FAQ SEARCH ACCORDION --- */
    const searchInput = document.getElementById('faq-search-input');
    const faqItems = document.querySelectorAll('.faq-item');

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            faqItems.forEach(item => {
                const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
                const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
                
                if(questionText.includes(term) || answerText.includes(term)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            faqItems.forEach(other => {
                if(other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    /* --- 6. DRAWER (Order Form Modal) --- */
    const drawer = document.getElementById('drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');
    
    document.querySelectorAll('.open-drawer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // If button has product data, update the form
            if(e.currentTarget.dataset.product && orderDetailsInput) {
                orderDetailsInput.value = `ZAPYTANIE O WYPIEK: ${e.currentTarget.dataset.product}`;
            }
            
            if(drawer && drawerOverlay) {
                drawer.classList.add('active');
                drawerOverlay.classList.add('active');
            }
        });
    });
    
    // Also bind the calculator submit button
    const calcSubmitBtn = document.getElementById('calc-submit-btn');
    if(calcSubmitBtn) {
        calcSubmitBtn.addEventListener('click', () => {
            if(drawer && drawerOverlay) {
                drawer.classList.add('active');
                drawerOverlay.classList.add('active');
            }
        });
    }

    function closeDrawer() {
        if(drawer && drawerOverlay) {
            drawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        }
    }

    if(drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if(drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    /* Form Validation inside Drawer */
    const orderForm = document.getElementById('order-drawer-form');
    if(orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const honeypot = orderForm.querySelector('.honeypot');
            if(honeypot && honeypot.value !== "") return; // Bot protection

            let isValid = true;
            const nameInput = document.getElementById('order-name');
            const phoneInput = document.getElementById('order-phone');
            const dateInput = document.getElementById('order-date');

            if(!nameInput.value.trim()) { nameInput.parentElement.classList.add('error'); isValid = false; }
            else { nameInput.parentElement.classList.remove('error'); }

            const phoneRegex = /^[0-9+\s()-]{9,15}$/;
            if(!phoneRegex.test(phoneInput.value.trim())) { phoneInput.parentElement.classList.add('error'); isValid = false; }
            else { phoneInput.parentElement.classList.remove('error'); }

            if(!dateInput.value) { dateInput.parentElement.classList.add('error'); isValid = false; }
            else { dateInput.parentElement.classList.remove('error'); }

            if(isValid) {
                const successMsg = document.getElementById('form-success');
                successMsg.style.display = 'block';
                orderForm.querySelector('button[type="submit"]').style.display = 'none';
                
                setTimeout(() => {
                    closeDrawer();
                    successMsg.style.display = 'none';
                    orderForm.reset();
                    orderForm.querySelector('button[type="submit"]').style.display = 'block';
                }, 3000);
            }
        });
    }

    /* --- 7. LIGHTBOX GALLERY --- */
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    
    document.querySelectorAll('.open-lightbox').forEach(item => {
        item.addEventListener('click', () => {
            if(lightboxModal && lightboxTitle && lightboxDesc) {
                lightboxTitle.textContent = item.dataset.title;
                lightboxDesc.textContent = item.dataset.desc;
                lightboxModal.classList.add('active');
            }
        });
    });

    document.getElementById('lightbox-close')?.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
    });

    /* --- 8. DYNAMIC REVIEWS ENGINE (0 Baseline) --- */
    let reviewsData = []; // Start with 0 reviews
    
    const openReviewFormBtn = document.getElementById('open-review-form-btn');
    const reviewFormWrapper = document.getElementById('review-form-wrapper');
    const addReviewForm = document.getElementById('add-review-form');
    const emptyStateBox = document.getElementById('reviews-empty-state');
    const reviewsContainer = document.getElementById('reviews-container');
    
    function getStarsHTML(rating) {
        let stars = '';
        for(let i=1; i<=5; i++) {
            stars += i <= rating ? '★' : '☆';
        }
        return stars;
    }

    function renderReviews() {
        if(!reviewsContainer) return;
        
        if(reviewsData.length === 0) {
            emptyStateBox.style.display = 'block';
            reviewsContainer.style.display = 'none';
            document.getElementById('rating-score').textContent = '0.0';
            document.getElementById('rating-stars').textContent = '☆☆☆☆☆';
            document.getElementById('rating-count').textContent = '(0 opinii)';
            return;
        }

        emptyStateBox.style.display = 'none';
        reviewsContainer.style.display = 'grid';
        reviewsContainer.innerHTML = '';
        
        let totalScore = 0;

        reviewsData.forEach(rev => {
            totalScore += rev.rating;
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="review-card__stars">${getStarsHTML(rev.rating)}</div>
                <p>"${rev.text}"</p>
                <span class="review-card__author">— ${rev.author}</span>
            `;
            reviewsContainer.appendChild(card);
        });

        const avgScore = (totalScore / reviewsData.length).toFixed(1);
        document.getElementById('rating-score').textContent = avgScore;
        document.getElementById('rating-stars').textContent = getStarsHTML(Math.round(avgScore));
        document.getElementById('rating-count').textContent = `(${reviewsData.length} opinii)`;
    }

    if(openReviewFormBtn) {
        openReviewFormBtn.addEventListener('click', () => {
            reviewFormWrapper.style.display = 'block';
            openReviewFormBtn.style.display = 'none';
        });
    }

    if(addReviewForm) {
        addReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const author = document.getElementById('review-author').value.trim();
            const rating = parseInt(document.getElementById('review-stars-input').value);
            const text = document.getElementById('review-text').value.trim();

            if(author && text) {
                reviewsData.unshift({ author, rating, text });
                renderReviews();
                addReviewForm.reset();
                reviewFormWrapper.style.display = 'none';
                openReviewFormBtn.style.display = 'inline-flex';
            }
        });
    }

    // Initialize 0-state
    renderReviews();

});