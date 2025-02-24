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

const services = [
    {
        title: "Permanent Lighting",
        description: "Illuminate your home year-round with beautiful, low-maintenance lighting that fits every occasion."
    },
    {
        title: "Move In/Out Cleaning",
        description: "Make your move stress-free with a deep, detailed clean before or after your big day."
    },
    {
        title: "House Wash",
        description: "Refresh your home's exterior with a gentle, thorough wash that restores its original charm."
    },
    {
        title: "Window Cleaning",
        description: "Enjoy crystal-clear views with streak-free, professionally cleaned windows inside and out."
    },
    {
        title: "Holiday Lighting",
        description: "Celebrate with ease—let us design, install, and remove stunning holiday lighting for you."
    },
    {
        title: "Recurring Home Cleaning",
        description: "Keep your interior effortlessly clean with flexible, routine cleanings tailored to your needs."
    },
    {
        title: "Pressure Washing",
        description: "Erase dirt, grime, and stains from surfaces with powerful yet safe pressure washing."
    },
    {
        title: "Paver Sealing",
        description: "Protect and enhance your pavers with professional sealing for a polished, long-standing finish."
    },
    {
        title: "Landscape & Patio Lighting",
        description: "Add ambiance and security to your outdoor spaces with custom-designed lighting solutions."
    }
];

const slider = document.getElementById('popularServicesSlider');
const progressBar = document.getElementById('popularProgressBar');
let currentIndex = 0;

function createServiceCards() {
    services.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = 'popular-service-card';
        card.innerHTML = `
            <div class="popular-service-image">
                <span class="popular-service-image-text">Service-specific Image</span>
            </div>
            <div class="popular-service-content">
                <h3 class="popular-service-title">${service.title}</h3>
                <p class="popular-service-description">${service.description}</p>
                <div class="popular-service-arrow">
                    <svg class="popular-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        `;
        slider.appendChild(card);
    });
}

function updateProgress() {
    const progress = (currentIndex / (services.length - 3)) * 100;
    progressBar.style.width = `${progress}%`;
}

function moveSlider() {
    currentIndex = (currentIndex + 1) % (services.length - 2);
    const offset = currentIndex * -322;
    slider.style.transform = `translateX(${offset}px)`;
}

function initCarousel() {
    createServiceCards();
    updateProgress();
    setInterval(() => {
        moveSlider();
        updateProgress();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', initCarousel);

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.carousel-card');
    const prevArrow = document.querySelector('.carousel-arrow.prev');
    const nextArrow = document.querySelector('.carousel-arrow.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let cardWidth;
    let visibleCards;
    let totalSlides;
    
    // Initialize dots
    function initDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    // Calculate dimensions based on viewport
    function calculateDimensions() {
        const containerWidth = carousel.parentElement.clientWidth;
        if (window.innerWidth >= 992) {
            visibleCards = 3;
        } else if (window.innerWidth >= 768) {
            visibleCards = 2;
        } else {
            visibleCards = 1;
        }
        
        cardWidth = containerWidth / visibleCards;
        
        // Set card widths
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
            card.style.minWidth = `${cardWidth}px`;
        });
        
        totalSlides = Math.ceil(cards.length - visibleCards) + 1;
        
        // Reinitialize dots when dimensions change
        initDots();
        
        // Reset to first slide
        currentIndex = 0;
        updateCarousel();
    }
    
    // Update carousel position
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update active dot
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Enable/disable arrows
        prevArrow.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextArrow.style.opacity = currentIndex === totalSlides - 1 ? '0.5' : '1';
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // Event listeners for arrows
    prevArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextArrow.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Initialize
    calculateDimensions();
    
    // Handle window resize
    window.addEventListener('resize', calculateDimensions);
    
    // Touch events for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            }
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }
    }
});