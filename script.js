(function() {
    emailjs.init("7BJNA8f06oyvp9QlS");
    console.log("EmailJS initialized");
})();

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Get form data
            const templateParams = {
                from_name: document.getElementById('name').value,
                user_email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                to_name: "House of Exotics",
                reply_to: document.getElementById('email').value  // Make sure this is included
            };
            
            console.log("Sending email with params:", templateParams);

            emailjs.send("service_kgsk6vg", "template_9pwsdge", templateParams)
                .then(function(response) {
                    console.log("SUCCESS!", response.status, response.text);
                    alert('Message sent successfully!');
                    contactForm.reset();
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, function(error) {
                    console.error("FAILED...", error.text);
                    alert('Failed to send message. Error: ' + error.text);
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");
    
    // First make sure inventory is initialized
    if (!localStorage.getItem('inventory')) {
        console.log("Initializing inventory");
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

    // Now set up the button listeners
    const addToCartButtons = document.querySelectorAll(".buy-btn");
    console.log("Found buttons:", addToCartButtons.length);
    
    addToCartButtons.forEach(button => {
        console.log("Setting up button for:", button.closest('.product-card')?.querySelector('h3')?.textContent);
        button.addEventListener("click", handleAddToCart);
    });

    // Update initial button states
    updateButtonStates();
});

function handleAddToCart(event) {
    console.log("Add to cart clicked");
    event.preventDefault();
    
    const productCard = event.target.closest(".product-card");
    console.log("Product card found:", productCard);
    
    if (!productCard) {
        console.error("No product card found");
        return;
    }

    const productName = productCard.querySelector("h3")?.textContent.trim();
    console.log("Product name:", productName);
    
    const productPriceText = productCard.querySelector("p")?.textContent.trim();
    console.log("Price text:", productPriceText);
    
    const productImage = productCard.querySelector("img")?.src;
    console.log("Image source:", productImage);

    if (!productName || !productPriceText || !productImage) {
        console.error("Missing product details");
        return;
    }

    const productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, ''));
    console.log("Parsed price:", productPrice);

    if (isNaN(productPrice)) {
        console.error("Invalid price format");
        return;
    }

    // Check if item is in stock
    if (!checkStock(productName)) {
        alert('Sorry, this item is out of stock!');
        return;
    }

    // Decrement stock
    if (decrementStock(productName)) {
        // Get existing cart
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.name === productName);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
        } else {
            const item = { 
                name: productName, 
                price: productPrice, 
                image: productImage,
                quantity: 1
            };
            cart.push(item);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Cart updated:", cart);
        
        // Removed the confirmation dialog and directly redirect to cart page
        window.location.href = "cart.html";
    }
}

function buyItem(name) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the price based on the name
    let price;
    switch(name) {
        case 'Parrot Fish':
            price = 100.00;
            break;
        case 'Betta Fish':
            price = 12.00;
            break;
        case 'Bearded Dragon':
            price = 450.00;
            break;
        case 'Leopard Gecko':
            price = 350.00;
            break;
        default:
            price = 0;
    }

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item added to cart!');
}

async function getCareGuide() {
    const animalName = document.getElementById('animalName').value;
    const careResult = document.getElementById('careResult');
    const button = document.querySelector('.care-btn');
    const originalButtonText = button.textContent;

    if (!animalName) {
        alert('Please enter a pet name');
        return;
    }

    try {
        // Show loading state
        button.innerHTML = '<span class="loading"></span> Loading...';
        button.disabled = true;
        careResult.style.display = 'none';

        const response = await fetch('/api/care-guide', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ animalName })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch care information');
        }

        const data = await response.json();
        
        // Display the result
        careResult.textContent = data.careInfo;
        careResult.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        careResult.textContent = 'Sorry, failed to fetch care information. Please try again.';
        careResult.style.display = 'block';
    } finally {
        // Reset button state
        button.textContent = originalButtonText;
        button.disabled = false;
    }
}

function openOwnAI() {
    // Open a new window with specific dimensions
    window.open('https://flounder.ownai.com/', 'OwnAI Chat', 
        'width=800,height=600,resizable=yes,scrollbars=yes');
}

function closeOwnAI() {
    const ownAIWindow = document.getElementById('ownAIWindow');
    const ownAIFrame = document.getElementById('ownAIFrame');
    const overlay = document.getElementById('aiOverlay');
    
    ownAIFrame.src = 'about:blank';
    ownAIWindow.style.display = 'none';
    overlay.style.display = 'none';
}

// Close window when clicking outside
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('aiOverlay');
    if (e.target === overlay) {
        closeOwnAI();
    }
});
