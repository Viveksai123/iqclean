

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
// Simplified and Fixed Slider Implementation
document.addEventListener('DOMContentLoaded', () => {
    // Core elements
    const slider = document.getElementById('popularServicesSlider');
    const progressBar = document.getElementById('popularProgressBar');
    
    // State variables
    let currentIndex = 0;
    let autoSlideInterval;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let animationId = null;
    let dragThreshold = 5; // Minimum pixels to move before considering it a drag
    let preventClick = false; // Flag to prevent click after drag
    
    // --- UTILITY FUNCTIONS ---
    
    // Get card width including gap
    function getCardUnit() {
        const card = slider.querySelector('.popular-service-card');
        const cardWidth = card ? card.offsetWidth : 300;
        const style = window.getComputedStyle(slider);
        const gap = parseInt(style.columnGap || style.gap || 0);
        return { width: cardWidth, gap: gap, total: cardWidth + gap };
    }
    
    // Get number of visible cards based on container width
    function getVisibleCardsCount() {
        const container = slider.parentElement.offsetWidth;
        const { total } = getCardUnit();
        return Math.max(1, Math.floor(container / total));
    }
    
    // Get total number of cards
    function getTotalCards() {
        return slider.querySelectorAll('.popular-service-card').length;
    }
    
    // --- SLIDER POSITION FUNCTIONS ---
    
    // Calculate the target position based on current index
    function getTargetPosition() {
        const { total } = getCardUnit();
        return -currentIndex * total;
    }
    
    // Smoothly animate the slider to position
    function smoothScrollTo(targetPosition) {
        // Cancel any existing animation
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        const startPosition = getCurrentPosition();
        const distance = targetPosition - startPosition;
        const duration = 300; // ms
        const startTime = performance.now();
        
        function animation(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            // Easing function (ease-out)
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentPosition = startPosition + distance * ease;
            
            // Apply transform
            slider.style.transform = `translate3d(${currentPosition}px, 0px, 0px)`;
            
            // Continue animation if not finished
            if (progress < 1) {
                animationId = requestAnimationFrame(animation);
            } else {
                animationId = null;
                // Ensure we end exactly at target position
                slider.style.transform = `translate3d(${targetPosition}px, 0px, 0px)`;
            }
        }
        
        // Start animation
        animationId = requestAnimationFrame(animation);
    }
    
    // Get current slider position
    function getCurrentPosition() {
        const transform = window.getComputedStyle(slider).transform;
        if (transform === 'none') return 0;
        
        try {
            // Try to use matrix transform parse
            const matrix = new DOMMatrix(transform);
            return matrix.m41;
        } catch (e) {
            // Fallback for older browsers
            const values = transform.match(/matrix.*\((.+)\)/);
            if (values && values[1]) {
                return parseFloat(values[1].split(', ')[4]) || 0;
            }
            return 0;
        }
    }
    
    // Update the slider's transform position
    function updateSliderPosition(animate = true) {
        const targetPosition = getTargetPosition();
        
        // Update progress bar if it exists
        if (progressBar) {
            const totalCards = getTotalCards();
            const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }
        
        if (animate) {
            smoothScrollTo(targetPosition);
        } else {
            slider.style.transition = 'none';
            slider.style.transform = `translate3d(${targetPosition}px, 0px, 0px)`;
        }
    }
    
    // --- NAVIGATION FUNCTIONS ---
    
    // Go to next slide
    function goToNextSlide() {
        const totalCards = getTotalCards();
        const visibleCards = getVisibleCardsCount();
        const maxIndex = Math.max(0, totalCards - visibleCards);
        
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to start
        }
        
        updateSliderPosition();
    }
    
    // Go to previous slide
    function goToPrevSlide() {
        const totalCards = getTotalCards();
        const visibleCards = getVisibleCardsCount();
        const maxIndex = Math.max(0, totalCards - visibleCards);
        
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex; // Loop to end
        }
        
        updateSliderPosition();
    }
    
    // --- DRAGGING FUNCTIONS ---
    
    // Start dragging
    function dragStart(e) {
        // Skip if not left mouse button (for mouse events)
        if (e.type === 'mousedown' && e.button !== 0) return;
        
        // Capture this event so we handle it before links
        e.stopPropagation();
        
        // Don't prevent default on initial touch to allow native scrolling
        // We'll prevent it once we know it's a deliberate horizontal drag
        if (e.type !== 'touchstart') {
            e.preventDefault();
        }
        
        clearInterval(autoSlideInterval);
        
        // Get starting positions
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startScrollLeft = getCurrentPosition();
        isDragging = true;
        preventClick = false;
        slider.style.cursor = 'grabbing';
        
        // Stop any ongoing animation
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    // During drag
    function drag(e) {
        if (!isDragging) return;
        
        // Get current position
        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const dragDelta = currentX - startX;
        
        // Only prevent default once we know it's a deliberate horizontal drag
        if (Math.abs(dragDelta) > dragThreshold) {
            e.preventDefault();
            
            // Set flag to prevent click after drag
            if (Math.abs(dragDelta) > 10) {
                preventClick = true;
            }
            
            // Calculate new position with edge resistance
            let newPosition = startScrollLeft + dragDelta;
            const { total } = getCardUnit();
            const maxCards = getTotalCards();
            const visibleCards = getVisibleCardsCount();
            const maxOffset = -(maxCards - visibleCards) * total;
            
            // Add resistance if trying to drag past limits
            if (newPosition > 0) {
                // Resistance when dragging past start
                newPosition = dragDelta * 0.2;
            } else if (newPosition < maxOffset) {
                // Resistance when dragging past end
                newPosition = maxOffset + (dragDelta * 0.2);
            }
            
            // Apply transform
            slider.style.transform = `translate3d(${newPosition}px, 0px, 0px)`;
        }
    }
    
    // End dragging
    function dragEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        slider.style.cursor = 'grab';
        
        // Calculate final position
        const currentPosition = getCurrentPosition();
        const dragDistance = currentPosition - startScrollLeft;
        
        // Determine target slide
        const { total } = getCardUnit();
        if (Math.abs(dragDistance) > total * 0.2) { // 20% threshold
            if (dragDistance < 0) {
                // Dragged left - go to next slide
                currentIndex = Math.min(
                    currentIndex + Math.ceil(Math.abs(dragDistance) / total),
                    getTotalCards() - getVisibleCardsCount()
                );
            } else {
                // Dragged right - go to previous slide
                currentIndex = Math.max(
                    currentIndex - Math.ceil(Math.abs(dragDistance) / total),
                    0
                );
            }
        }
        
        // Update slider position
        updateSliderPosition();
        
        // Restart auto slide
        startAutoSlide();
    }
    
    // Cancel drag on escape key
    function cancelDrag() {
        if (isDragging) {
            isDragging = false;
            slider.style.cursor = 'grab';
            updateSliderPosition();
            startAutoSlide();
        }
    }
    
    // --- CLICK INTERCEPTOR ---
    
    // Prevent clicks immediately after dragging
    function handleCardClick(e) {
        if (preventClick) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    
    // --- AUTO SLIDE ---
    
    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(goToNextSlide, 5000);
    }
    
    // --- RESPONSIVE HANDLING ---
    
    function handleResize() {
        // Adjust currentIndex to prevent showing empty space
        const maxIndex = getTotalCards() - getVisibleCardsCount();
        if (currentIndex > maxIndex) {
            currentIndex = Math.max(0, maxIndex);
        }
        
        updateSliderPosition(false);
    }
    
    // --- SETUP & INITIALIZATION ---
    
    // Add event listeners for dragging
    function setupEvents() {
        // Mouse events with capture to intercept before links
        slider.addEventListener('mousedown', dragStart, { passive: false, capture: true });
        window.addEventListener('mousemove', drag, { passive: false });
        window.addEventListener('mouseup', dragEnd);
        
        // Touch events with capture
        slider.addEventListener('touchstart', dragStart, { passive: true, capture: true });
        window.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchend', dragEnd);
        window.addEventListener('touchcancel', cancelDrag);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToPrevSlide();
                clearInterval(autoSlideInterval);
                startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                goToNextSlide();
                clearInterval(autoSlideInterval);
                startAutoSlide();
            } else if (e.key === 'Escape') {
                cancelDrag();
            }
        });
        
        // Window resize with debouncing
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 100);
        });
        
        // Prevent link clicks after drag
        const cards = slider.querySelectorAll('.popular-service-card');
        cards.forEach(card => {
            const links = card.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', handleCardClick, { capture: true });
            });
        });
        
        // Add arrow button event listeners
        const prevButton = document.getElementById('popularPrevBtn');
        const nextButton = document.getElementById('popularNextBtn');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                goToPrevSlide();
                clearInterval(autoSlideInterval);
                startAutoSlide();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                goToNextSlide();
                clearInterval(autoSlideInterval);
                startAutoSlide();
            });
        }
    }
    
    // Create and add the arrow buttons to the DOM
    function createArrowButtons() {
        // Create the control container
        const arrowControls = document.createElement('div');
        arrowControls.className = 'popular-arrow-controls';
        
        // Create previous button
        const prevButton = document.createElement('button');
        prevButton.id = 'popularPrevBtn';
        prevButton.setAttribute('aria-label', 'Previous slide');
        prevButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        // Create next button
        const nextButton = document.createElement('button');
        nextButton.id = 'popularNextBtn';
        nextButton.setAttribute('aria-label', 'Next slide');
        nextButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        // Add buttons to container
        arrowControls.appendChild(prevButton);
        arrowControls.appendChild(nextButton);
        
        // Find the popular-controls-container
        const controlsContainer = document.querySelector('.popular-controls-container');
        if (controlsContainer) {
            // Insert after the progress container but before the get started button
            const progressContainer = controlsContainer.querySelector('.popular-progress-container');
            if (progressContainer) {
                progressContainer.after(arrowControls);
            } else {
                // If no progress container, prepend to controls container
                controlsContainer.prepend(arrowControls);
            }
        }
    }
    
    // Add necessary styles
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Hide unwanted elements */
            img[alt="window"], .window-icon, .window-element,
            .popular-services-navigation, .popular-nav-button {
                display: none !important;
            }
            
            /* Slider styling */
            #popularServicesSlider {
                will-change: transform;
                touch-action: pan-y;
                user-select: none;
                cursor: grab;
                transition: none;
            }
            
            /* Prevent image dragging */
            .popular-service-image img, .popular-arrow-icon {
                pointer-events: none;
            }
            
            /* Fix anchor tag behavior during drag */
            .popular-service-card a {
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
            }
            
            /* When dragging, disable all links */
            .dragging .popular-service-card a {
                pointer-events: none;
            }
            
            /* Override for card interactions */
            .popular-service-card {
                touch-action: pan-y;
                will-change: transform;
            }
            
            /* Simple styling for arrow buttons */
            .popular-arrow-controls {
                display: flex;
                gap: 10px;
                margin: 0 15px;
            }
            
            .popular-arrow-controls button {
                background: none;
                border: 1px solid currentColor;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #333;
                padding: 0;
                transition: background-color 0.3s ease;
            }
            
            .popular-arrow-controls button:hover {
                background-color: rgba(0,0,0,0.05);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize everything
    function init() {
        addStyles();
        createArrowButtons(); // Create and add the arrow buttons
        setupEvents();
        updateSliderPosition(false);
        startAutoSlide();
        
        // Add class to body during drag to disable links
        slider.addEventListener('mousedown', () => {
            if (!isDragging) return;
            document.body.classList.add('dragging');
        });
        
        window.addEventListener('mouseup', () => {
            document.body.classList.remove('dragging');
            // Reset prevent click after a short delay
            setTimeout(() => {
                preventClick = false;
            }, 300);
        });
    }
    
    // Start the slider
    init();
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



document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const track = document.getElementById('iqhc5ServicesTrack');
    const progressBar = document.getElementById('iqhc5ProgressBar');
    const prevBtn = document.getElementById('iqhc5PrevBtn');
    const nextBtn = document.getElementById('iqhc5NextBtn');
    
    // Get all cards
    const cards = track.querySelectorAll('.iqhc5_service_card');
    const totalCards = cards.length;
    
    // Settings
    const autoScrollDelay = 5000;
    
    // Variables
    let currentIndex = 0;
    let autoScrollInterval;
    
    // Init
    initCarousel();
    
    // Event listeners
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);
    window.addEventListener('resize', updateCarouselDisplay);
    
    // Initialize carousel
    function initCarousel() {
        updateCarouselDisplay();
        setActiveCard(0);
        startAutoScroll();
    }
    
    // Update display based on screen size
    function updateCarouselDisplay() {
        // Reset transitions during resize
        track.style.transition = 'none';
        
        // We always display the full available width
        updateCardPositions();
        
        // After positioning, restore transition
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease';
        }, 50);
    }
    
    // Go to previous slide
    function goToPrev() {
        stopAutoScroll();
        
        if (currentIndex <= 0) {
            setActiveCard(totalCards - 1);
        } else {
            setActiveCard(currentIndex - 1);
        }
        
        restartAutoScroll();
    }
    
    // Go to next slide
    function goToNext() {
        stopAutoScroll();
        
        if (currentIndex >= totalCards - 1) {
            setActiveCard(0);
        } else {
            setActiveCard(currentIndex + 1);
        }
        
        restartAutoScroll();
    }
    
    // Set active card
    function setActiveCard(index) {
        currentIndex = index;
        updateCardPositions();
        updateProgressBar();
    }
    
    // Update positions of all cards
    function updateCardPositions() {
        // Calculate card width based on actual card
        const card = cards[0];
        const cardStyle = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth;
        const cardMarginRight = parseInt(cardStyle.marginRight) || 20;
        const totalCardWidth = cardWidth + cardMarginRight;
        
        // Set transform position
        track.style.transform = `translateX(-${currentIndex * totalCardWidth}px)`;
    }
    
    // Update progress bar
    function updateProgressBar() {
        const percentage = (currentIndex / (totalCards - 1)) * 100;
        progressBar.style.width = `${percentage}%`;
    }
    
    // Auto-scroll functions
    function startAutoScroll() {
        autoScrollInterval = setInterval(goToNext, autoScrollDelay);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    function restartAutoScroll() {
        stopAutoScroll();
        autoScrollInterval = setInterval(goToNext, autoScrollDelay);
    }
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].clientX;
        stopAutoScroll();
    }, { passive: true });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
        restartAutoScroll();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (diff > swipeThreshold) {
            // Swipe left - go next
            goToNext();
        } else if (diff < -swipeThreshold) {
            // Swipe right - go prev
            goToPrev();
        }
    }
});
