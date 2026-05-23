(function(){
        const cardsEl = document.getElementById('cards');
        const cards = Array.from(cardsEl.children);
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pauseBtn = document.getElementById('pauseResume');
        const indicators = Array.from(document.querySelectorAll('.dot'));
        let current = 0;
        const total = cards.length;
        const intervalMs = 3500;
        let timer = null;

        function updatePosition() {
            const offset = -current * 100;
            cardsEl.style.transform = `translateX(${offset}%)`;
            indicators.forEach((d,i)=> d.classList.toggle('active', i===current));
        }

        function goto(index) {
            current = (index + total) % total;
            updatePosition();
        }

        function next(){ goto(current+1); }
        function prev(){ goto(current-1); }

        function startTimer(){
            stopTimer();
            timer = setInterval(next, intervalMs);
            if(pauseBtn){ pauseBtn.textContent = 'Pause'; pauseBtn.setAttribute('aria-pressed','false'); }
        }

        function stopTimer(){ if(timer){ clearInterval(timer); timer = null; } }

        if(nextBtn) nextBtn.addEventListener('click', ()=>{ next(); startTimer(); });
        if(prevBtn) prevBtn.addEventListener('click', ()=>{ prev(); startTimer(); });

        indicators.forEach(btn => {
            if(btn) btn.addEventListener('click', ()=>{ goto(Number(btn.dataset.index)); startTimer(); });
        });

        if(pauseBtn){
            pauseBtn.addEventListener('click', ()=>{
                if(timer){ stopTimer(); pauseBtn.textContent = 'Resume'; pauseBtn.setAttribute('aria-pressed','true'); }
                else { startTimer(); }
            });
        }

        const rotator = document.getElementById('rotator');
        if(rotator){
            rotator.addEventListener('mouseenter', ()=>{ stopTimer(); });
            rotator.addEventListener('mouseleave', ()=>{ startTimer(); });
        }

        updatePosition();
        startTimer();
        cards.forEach(imgWrap => { const img = imgWrap.querySelector('img'); if(img) img.addEventListener('error', ()=>{ img.src='https://via.placeholder.com/120?text=No+Image'; }); });
    })();

    (function(){
        const cartBtn = document.getElementById('cartBtn');
        const cartPanel = document.getElementById('cartPanel');
        const cartCountEl = document.getElementById('cartCount');
        const CART_KEY = 'simple-cart';
        let cart = [];
        function loadCart(){ try{ const raw = localStorage.getItem(CART_KEY); cart = raw ? JSON.parse(raw) : []; }catch(e){ cart = []; } updateCartUI(); }
        function saveCart(){ try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){} }
        function updateCartUI(){ if(cartCountEl) cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0); renderCart(); }
        function renderCart(){ if(!cartPanel) return; if(cart.length===0){ cartPanel.innerHTML = '<h3>Keranjang</h3><div class="empty">Belum ada item</div>'; return; }
            let html = '<h3>Keranjang</h3>';
            cart.forEach(it=>{
                html += `<div class="cart-item"><img src="${it.img}" alt="${it.title}" onerror="this.src='https://via.placeholder.com/48?text=No'" /><div class='meta'><strong>${it.title}</strong><div>Rp${it.price.toLocaleString('id-ID')} x ${it.qty}</div></div><button data-id="${it.id}" class="remove-btn">Hapus</button></div>`;
            });
            const total = cart.reduce((s,i)=>s + (i.price * i.qty),0);
            html += `<div class="cart-total">Total: Rp${total.toLocaleString('id-ID')}</div>`;
            html += `<button class="checkout-btn" type="button">Checkout</button>`;
            cartPanel.innerHTML = html;
            cartPanel.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (ev)=>{ const id = Number(btn.dataset.id); cart = cart.filter(c=>c.id!==id); saveCart(); updateCartUI(); }));
            const checkoutBtn = cartPanel.querySelector('.checkout-btn');
            if(checkoutBtn){
                checkoutBtn.addEventListener('click', ()=>{
                    try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){}
                    window.location.href = 'checkout.html';
                });
            }
        }
        if(cartBtn) cartBtn.addEventListener('click', ()=>{ if(!cartPanel) return; cartPanel.hidden = !cartPanel.hidden; });
        loadCart();

        const products = [
            {id:1, cat:'fashion', title:'Kemeja Batik Tulis', price:350000, rating:4.8, img:'images/batik.png'},
            {id:2, cat:'fashion', title:'Tas Anyaman Rotan', price:250000, rating:4.6, img:'images/tas_anyaman.jpeg'},
            {id:3, cat:'food', title:'Sambal Terasi Aceh (200g)', price:45000, rating:4.5, img:'images/sambal.png'},
            {id:4, cat:'food', title:'Kopi Gayo Orsinil (250g)', price:90000, rating:4.7, img:'images/gayo.png'},
            {id:5, cat:'food', title:'Kue Lapis Legit (potong)', price:60000, rating:4.4, img:'images/kue_lapis.webp'},
            {id:6, cat:'craft', title:'Mainan Kayu Puzzle', price:75000, rating:4.3, img:'images/mainan_kayu.webp'},
            {id:7, cat:'beauty', title:'Sabun Herbal Organik (3 pcs)', price:70000, rating:4.2, img:'images/sabun_herbal.png'},
        ];

        const categoriesEl = document.getElementById('categories');
        const itemsGrid = document.getElementById('itemsGrid');
        const sortSelect = document.getElementById('sortSelect');
        const searchItems = document.getElementById('searchItems');

        function renderItems(list){
            if(!itemsGrid) return;
            itemsGrid.innerHTML = '';
            if(list.length === 0){ itemsGrid.innerHTML = '<div class="empty">Tidak ada item</div>'; return; }
            list.forEach(p => {
                const el = document.createElement('div'); el.className = 'item-card';

                const img = document.createElement('img');
                img.alt = p.title;
                img.src = p.img;
                img.style.display = 'block';
                img.style.objectFit = 'contain';
                img.style.maxWidth = '120px';
                img.style.maxHeight = '120px';
                img.addEventListener('load', () => {
                    const maxW = 120, maxH = 120;
                    let w = img.naturalWidth || img.width || maxW;
                    let h = img.naturalHeight || img.height || maxH;
                    if(w === 0) w = maxW; if(h === 0) h = maxH;
                    if(w > maxW || h > maxH){
                        const scale = Math.min(maxW / w, maxH / h);
                        img.width = Math.round(w * scale);
                        img.height = Math.round(h * scale);
                    } else {
                        img.width = w;
                        img.height = h;
                    }
                });
                img.addEventListener('error', ()=>{ img.src = 'https://via.placeholder.com/120?text=No+Image'; });

                const meta = document.createElement('div'); meta.className = 'item-meta';
                meta.innerHTML = `
                    <strong>${p.title}</strong>
                    <div class="item-price">Rp${p.price.toLocaleString('id-ID')}</div>
                    <div class="item-rating">⭐ ${p.rating.toFixed(1)}</div>
                `;

                const right = document.createElement('div');
                right.className = 'item-right';

                const actionRow = document.createElement('div');
                actionRow.className = 'action-row';

                const likeBtn = document.createElement('button');
                likeBtn.className = 'like-btn';
                likeBtn.setAttribute('aria-pressed','false');
                likeBtn.title = 'Simpan';
                likeBtn.textContent = '♡';
                likeBtn.addEventListener('click', ()=>{
                    const was = likeBtn.getAttribute('aria-pressed') === 'true';
                    likeBtn.setAttribute('aria-pressed', String(!was));
                    likeBtn.textContent = !was ? '♥' : '♡';
                });

                const addBtn = document.createElement('button');
                addBtn.className = 'add-cart-btn';
                addBtn.textContent = '+';
                addBtn.setAttribute('aria-label', 'Tambah ke keranjang');
                addBtn.title = 'Tambah ke keranjang';
                addBtn.addEventListener('click', ()=>{
                    const existing = cart.find(c=>c.id===p.id);
                    if(existing) existing.qty += 1;
                    else cart.push({ id: p.id, title: p.title, price: p.price, img: p.img, qty: 1 });
                    saveCart(); updateCartUI();
                    if(cartPanel) cartPanel.hidden = false;
                });

                actionRow.appendChild(likeBtn);
                actionRow.appendChild(addBtn);

                right.appendChild(meta);
                right.appendChild(actionRow);

                el.appendChild(img);
                el.appendChild(right);
                itemsGrid.appendChild(el);
            });
        }

        function filterAndSort(){
            const activeCatBtn = categoriesEl ? categoriesEl.querySelector('.cat-btn.active') : null;
            const cat = activeCatBtn ? activeCatBtn.dataset.cat : 'all';
            const q = searchItems ? searchItems.value.trim().toLowerCase() : '';
            let list = products.slice();
            if(cat && cat !== 'all') list = list.filter(p => p.cat === cat);
            if(q) list = list.filter(p => p.title.toLowerCase().includes(q));
            const mode = sortSelect ? sortSelect.value : 'popular';
            if(mode === 'price-asc') list.sort((a,b)=>a.price-b.price);
            else if(mode === 'price-desc') list.sort((a,b)=>b.price-a.price);
            else list.sort((a,b)=>b.rating - a.rating);
            renderItems(list);
        }

        if(categoriesEl){
            categoriesEl.addEventListener('click', (ev)=>{
                const btn = ev.target.closest('.cat-btn');
                if(!btn) return;
                categoriesEl.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');
                filterAndSort();
            });
        }

        if(sortSelect) sortSelect.addEventListener('change', filterAndSort);
        if(searchItems) searchItems.addEventListener('input', filterAndSort);

        filterAndSort();

        document.querySelectorAll('.like-carousel').forEach(btn => btn.addEventListener('click', ()=>{
            const pressed = btn.getAttribute('aria-pressed') === 'true';
            btn.setAttribute('aria-pressed', String(!pressed));
            btn.textContent = !pressed ? '♥' : '♡';
        }));

        document.querySelectorAll('.add-cart-carousel').forEach(btn => {
            btn.addEventListener('click', ()=>{
                const id = Number(btn.dataset.id);
                const title = btn.dataset.title || 'Item';
                const price = Number(btn.dataset.price) || 0;
                const img = btn.dataset.img || '';
                const existing = cart.find(c=>c.id===id);
                if(existing) existing.qty += 1;
                else cart.push({ id, title, price, img, qty: 1 });
                saveCart(); updateCartUI();
                if(cartPanel) cartPanel.hidden = false;
            });
        });

    })();