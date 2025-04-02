// Initialize inventory in localStorage if it doesn't exist
if (!localStorage.getItem('inventory')) {
    const initialInventory = {
        'Parrot Fish': {
            stock: 5,
            price: 100.00,
            id: 'parrot-fish'
        },
        'Betta Fish': {
            stock: 10,
            price: 12.00,
            id: 'betta-fish'
        },
        'Red Inferno Bearded Dragon': {
            stock: 3,
            price: 450.00,
            id: 'bearded-dragon'
        },
        'Super Fire Ball Python': {
            stock: 2,
            price: 350.00,
            id: 'ball-python'
        }
    };
    localStorage.setItem('inventory', JSON.stringify(initialInventory));
}

// Function to check if item is in stock
function checkStock(productName) {
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    return inventory[productName]?.stock > 0;
}

// Function to get current stock level
function getStockLevel(productName) {
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    return inventory[productName]?.stock || 0;
}

// Function to update stock when item is added to cart
function decrementStock(productName) {
    if (!productName || typeof productName !== 'string') {
        console.error('Invalid product name');
        return false;
    }

    const inventory = JSON.parse(localStorage.getItem('inventory'));
    if (!inventory || !inventory[productName]) {
        console.error('Product not found:', productName);
        return false;
    }

    if (inventory[productName].stock <= 0) {
        console.error('Product out of stock:', productName);
        return false;
    }

    inventory[productName].stock -= 1;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    return true;
}

// Function to restore stock when item is removed from cart
function incrementStock(productName) {
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    if (inventory[productName]) {
        inventory[productName].stock += 1;
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }
}

// Function to update button states based on inventory
function updateButtonStates() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const stockLevel = getStockLevel(productName);
        
        if (stockLevel === 0) {
            button.disabled = true;
            button.textContent = 'Out of Stock';
            button.classList.add('out-of-stock');
        } else {
            button.disabled = false;
            button.textContent = 'Add to Cart';
            button.classList.remove('out-of-stock');
            
            // Add stock level indicator
            const stockIndicator = productCard.querySelector('.stock-level') || document.createElement('div');
            stockIndicator.className = 'stock-level';
            stockIndicator.textContent = `${stockLevel} in stock`;
            if (!productCard.querySelector('.stock-level')) {
                productCard.insertBefore(stockIndicator, button);
            }
        }
    });
}

