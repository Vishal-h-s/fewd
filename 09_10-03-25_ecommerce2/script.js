let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartCount();
}

function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.length;
}

function showCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>1</td>
            <td>$${item.price.toFixed(2)}</td>
        `;
        cartItems.appendChild(row);
    });
    new bootstrap.Modal(document.getElementById('cartModal')).show();
}

function checkout() {
    alert('Thank you for your purchase!');
    cart = [];
    updateCartCount();
    new bootstrap.Modal(document.getElementById('cartModal')).hide();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.navbar-nav .nav-link[href="#"]').addEventListener('click', showCart);
});