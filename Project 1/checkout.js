document.addEventListener("DOMContentLoaded", () => {
    const checkoutList = document.getElementById("checkoutCartList");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutForm = document.getElementById("checkoutForm");

    if (!checkoutList || !checkoutTotal) return;

    const CART_KEY = "simple-cart";
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (e) { cart = []; }

    let total = 0;
    checkoutList.innerHTML = "";

    cart.forEach(item => {
        const li = document.createElement("li");
        li.style.display = 'flex';
        li.style.gap = '12px';
        li.style.alignItems = 'center';
        li.style.marginBottom = '8px';

        li.innerHTML = `
            <img src="${item.img}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;" onerror="this.src='https://via.placeholder.com/48?text=No'" />
            <div style="flex:1">
                <div class="title">${item.title}</div>
                <div>Rp${item.price.toLocaleString('id-ID')} x ${item.qty}</div>
            </div>
            <div style="min-width:90px">Rp${(item.price * item.qty).toLocaleString('id-ID')}</div>
        `;

        checkoutList.appendChild(li);
        total += item.price * item.qty;
    });

    checkoutTotal.textContent = "Rp" + total.toLocaleString("id-ID");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            alert("Pesanan anda sudah diterima 🛍️\nTerima kasih telah berbelanja di Allesio!");

            try { localStorage.removeItem(CART_KEY); } catch (err) {}
            window.location.href = "index.html";
        });
    }
});
