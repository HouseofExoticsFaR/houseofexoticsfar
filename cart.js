// Function to update the cart display
function updateCartDisplay() {
    const cartContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("total-price-container");
    
    if (!cartContainer || !totalContainer) {
        console.error("Required elements not found");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalContainer.innerHTML = "<h3>Total Price: $0.00</h3>";
        return;
    }

    let total = 0;
    const cartHTML = cart.map((item, index) => {
        const price = parseFloat(item.price);
        const quantity = item.quantity || 1;
        const itemTotal = price * quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price-text">Price: $${price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <p class="subtotal-text">Subtotal: $${itemTotal.toFixed(2)}</p>
                </div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
    }).join('');

    cartContainer.innerHTML = cartHTML;
    totalContainer.innerHTML = `<h3>Total Price: $${total.toFixed(2)}</h3>`;
    setupCartControls();
}

function setupCartControls() {
    // Setup remove buttons
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const index = parseInt(event.target.dataset.index);
            removeFromCart(index);
        });
    });

    // Setup quantity buttons
    document.querySelectorAll(".quantity-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const index = parseInt(event.target.dataset.index);
            const isIncrement = event.target.classList.contains("plus");
            updateQuantity(index, isIncrement);
        });
    });
}

function updateQuantity(index, isIncrement) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (index >= 0 && index < cart.length) {
        if (isIncrement) {
            cart[index].quantity = (cart[index].quantity || 1) + 1;
        } else {
            cart[index].quantity = Math.max(1, (cart[index].quantity || 1) - 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Function to remove item from cart
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (index >= 0 && index < cart.length) {
        // Restore stock when removing item
        const removedItem = cart[index];
        incrementStock(removedItem.name);
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
        updateButtonStates(); // Update buttons if on product page
    }
}

// Function to handle checkout
function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    window.location.href = "checkout.html";
}

// Add this function to handle order submission
function handleOrderSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const specialInstructions = document.getElementById('message').value;
    
    // Get cart items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Format cart items for email
    let cartItemsList = cart.map(item => 
        `${item.name} - Quantity: ${item.quantity} - Price: $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Prepare email template parameters
    const templateParams = {
        subject: "New Order Request", // Add subject line
        customer_name: name,          // Changed from from_name to customer_name
        to_name: "House of Exotics",
        customer_email: email,
        customer_phone: phone,
        special_instructions: specialInstructions || "None",
        order_details: cartItemsList,
        total_amount: total.toFixed(2),
        reply_to: email
    };

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Send email using your actual service ID and updated template ID
    emailjs.send("service_kgsk6vg", "template_hh1n6ul", templateParams)
        .then(function(response) {
            console.log("SUCCESS!", response.status, response.text);
            alert('Order submitted successfully! We will contact you soon to arrange pickup.');
            // Clear cart
            localStorage.removeItem('cart');
            // Redirect to home page
            window.location.href = 'index.html';
        }, function(error) {
            console.error("FAILED...", error);
            alert('Failed to submit order. Please try again.');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
}

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", () => {
    updateCartDisplay();
    
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", handleCheckout);
    }
});

// Make functions available globally
window.updateCartDisplay = updateCartDisplay;
