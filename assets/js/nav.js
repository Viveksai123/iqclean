document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("scroll", function () {
        // Header element
        let header = document.querySelector(".th-header");
        // Navigation links
        let links = document.querySelectorAll(".nav-link");
        // Dropdown icons
        let dropdownIcons = document.querySelectorAll(".menu-item-has-children > a");
        // Logo elements
        let logoInitial = document.querySelector(".logo-initial");
        let logoScrolled = document.querySelector(".logo-scrolled");
        // Text elements
        let textLines = document.querySelectorAll(".text-wrapper p");

        if (window.scrollY > 50) {
            // Add scrolled class to header
            header.classList.add("scrolled");
            // Change links and icons text to black
            links.forEach(link => link.classList.add("text-black"));
            dropdownIcons.forEach(icon => icon.classList.add("text-black"));
            // Swap logos
            if (logoInitial && logoScrolled) {
                logoInitial.style.display = "none";
                logoScrolled.style.display = "block";
            }
            // Change text color to black
            textLines.forEach(text => (text.style.color = "black"));
        } else {
            // Remove scrolled class from header
            header.classList.remove("scrolled");
            // Reset links and icons text to default
            links.forEach(link => link.classList.remove("text-black"));
            dropdownIcons.forEach(icon => icon.classList.remove("text-black"));
            // Swap logos
            if (logoInitial && logoScrolled) {
                logoInitial.style.display = "block";
                logoScrolled.style.display = "none";
            }
            // Reset text color to default
            textLines.forEach(text => (text.style.color = ""));
        }
    });
});


// const textarea = document.getElementById("message");

// textarea.addEventListener("input", function () {
//     this.style.height = "auto"; 
//     this.style.height = this.scrollHeight + "px";
// });


const counter = document.querySelector('.iqhc-stats-number');
const target = 148;
let count = 0;

const updateCounter = () => {
    if (count < target) {
        count += Math.ceil(target / 100);
        counter.innerHTML = `${Math.min(count, target)}k<span class="iqhc-stats-plus">+</span>`;
        requestAnimationFrame(updateCounter);
    }
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(counter);

// Initialize variables
const slider = document.getElementById('popularServicesSlider');
const progressBar = document.getElementById('popularProgressBar');
let currentIndex = 0;
let autoSlideInterval;
let isDragging = false;
let startX = 0;
let currentX = 0;
let walk = 0;
let sliderPosition = 0;

function setupDragEvents() {
    // Add CSS to slider to ensure it can be dragged
    slider.style.cursor = 'grab';
    slider.style.userSelect = 'none';
    slider.style.touchAction = 'pan-y';
    
    // Mouse Events
    slider.addEventListener('mousedown', dragStart, { passive: false });
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('mousemove', drag, { passive: false });
    
    // Touch Events
    slider.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('touchcancel', dragEnd);
    window.addEventListener('touchmove', drag, { passive: false });
    
    // Prevent context menu
    slider.addEventListener('contextmenu', e => e.preventDefault());
}

function dragStart(e) {
    e.preventDefault();
    clearInterval(autoSlideInterval); // Stop auto sliding while dragging
    
    // Get initial position
    startX = getPositionX(e);
    isDragging = true;
    slider.style.cursor = 'grabbing';
    
    // Store the current slider position
    sliderPosition = getCurrentTranslate();
}

function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = getPositionX(e);
    walk = currentX - startX; // Calculate how far we've dragged
    
    // Apply the transform directly
    updateSliderTransform(sliderPosition + walk);
}

function dragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    slider.style.cursor = 'grab';
    
    // Calculate card width for snapping behavior
    const cardWidth = getCardWidth();
    const gap = getGapWidth();
    const totalWidth = cardWidth + gap;
    
    // Count total cards
    const cards = slider.querySelectorAll('.popular-service-card');
    const totalCards = cards.length;
    
    // Determine slide change based on drag distance
    if (Math.abs(walk) > totalWidth * 0.2) { // 20% threshold to change slide
        if (walk < 0) {
            // Dragged left - go to next slide
            currentIndex = Math.min(currentIndex + 1, totalCards - getVisibleCardsCount());
        } else {
            // Dragged right - go to previous slide
            currentIndex = Math.max(currentIndex - 1, 0);
        }
    }
    
    // Reset drag values
    startX = 0;
    currentX = 0;
    walk = 0;
    
    // Snap to the nearest slide
    updateSliderPosition();
    
    // Restart auto sliding
    startAutoSlide();
}

function getPositionX(e) {
    return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
}

function getCurrentTranslate() {
    const style = window.getComputedStyle(slider);
    const matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m41; // Get the translateX value
}

function updateSliderTransform(position) {
    slider.style.transform = `translate3d(${position}px, 0px, 0px)`;
}

function getCardWidth() {
    const card = slider.querySelector('.popular-service-card');
    return card ? card.offsetWidth : 300; // Fallback to default if not found
}

function getGapWidth() {
    const style = window.getComputedStyle(slider);
    return parseInt(style.columnGap || style.gap || 0);
}

function updateSliderPosition() {
    const cardWidth = getCardWidth();
    const gap = getGapWidth();
    const position = -currentIndex * (cardWidth + gap);
    
    // Use smooth transition when updating position after drag
    slider.style.transition = 'transform 0.3s ease-out';
    updateSliderTransform(position);
    
    // Remove transition after it completes
    setTimeout(() => {
        slider.style.transition = 'none';
    }, 300);
    
    // Update progress bar
    if (progressBar) {
        const cards = slider.querySelectorAll('.popular-service-card');
        const totalCards = cards.length;
        const progress = ((currentIndex + 1) / totalCards) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function goToNextSlide() {
    const cards = slider.querySelectorAll('.popular-service-card');
    const totalCards = cards.length;
    const visibleCards = getVisibleCardsCount();
    
    if (currentIndex < totalCards - visibleCards) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back to start
    }
    
    updateSliderPosition();
}

function goToPrevSlide() {
    const cards = slider.querySelectorAll('.popular-service-card');
    const totalCards = cards.length;
    
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = totalCards - getVisibleCardsCount(); // Loop to end
    }
    
    updateSliderPosition();
}

function getVisibleCardsCount() {
    // Calculate how many cards are visible based on container width
    const containerWidth = slider.parentElement.offsetWidth;
    const cardWidth = getCardWidth();
    const gap = getGapWidth();
    
    return Math.max(1, Math.floor(containerWidth / (cardWidth + gap)));
}

// Calculate responsive settings based on viewport
function calculateResponsiveSettings() {
    const viewportWidth = window.innerWidth;
    
    // Reset current index when screen size changes drastically
    // This prevents the slider from showing empty space on resize
    const cards = slider.querySelectorAll('.popular-service-card');
    if (currentIndex > 0) {
        const maxVisibleIndex = cards.length - getVisibleCardsCount();
        if (currentIndex > maxVisibleIndex) {
            currentIndex = Math.max(0, maxVisibleIndex);
        }
    }
    
    updateSliderPosition();
}

function startAutoSlide() {
    clearInterval(autoSlideInterval); // Clear any existing interval
    autoSlideInterval = setInterval(goToNextSlide, 5000); // Change slide every 5 seconds
}

// MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Remove the window icon element if it exists
    const windowIcon = document.querySelector('.window-icon');
    if (windowIcon) {
        windowIcon.style.display = 'none';
    }
    
    // Setup drag functionality
    setupDragEvents();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrevSlide();
            clearInterval(autoSlideInterval);
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            goToNextSlide();
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
    });
    
    // Handle window resize with debouncing
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            calculateResponsiveSettings();
        }, 100);
    });
    
    // Initial position
    updateSliderPosition();
    
    // Start auto-sliding
    startAutoSlide();
    
    // Add CSS to hide window icon element and navigation buttons
    const style = document.createElement('style');
    style.textContent = `
        /* Hide the window icon/element if it appears in the page */
        img[alt="window"], .window-icon, .window-element {
            display: none !important;
        }
        
        /* Hide any existing navigation controls that might be present */
        .popular-services-navigation, .popular-nav-button {
            display: none !important;
        }
        
        /* Ensure all elements inside service cards can be dragged */
        .popular-service-card, .popular-service-image, .popular-service-content, 
        .popular-service-title, .popular-service-description, .popular-service-arrow {
            pointer-events: auto;
        }
        
        /* Make slider draggable */
        #popularServicesSlider {
            will-change: transform;
            touch-action: pan-y;
            user-select: none;
            -webkit-user-select: none;
        }
        
        /* Prevent image dragging in cards */
        .popular-service-image img {
            pointer-events: none;
        }
        
        /* Make sure arrow image doesn't get dragged */
        .popular-arrow-icon {
            pointer-events: none;
        }
        
        /* Add adaptive mobile styles */
        @media (max-width: 576px) {
            .popular-service-card {
                touch-action: pan-y;
            }
        }
    `;
    document.head.appendChild(style);
});


document.addEventListener('DOMContentLoaded', function() {
    // Select the badge
    const badge = document.querySelector('.experience-badge');
    
    // Make sure the badge exists before trying to animate it
    if (badge) {
        // Trigger the animation after a short delay
        setTimeout(function() {
            badge.style.opacity = 1;
            badge.style.transform = 'translateX(0)'; // Slide to final position
        }, 500);
    }
});