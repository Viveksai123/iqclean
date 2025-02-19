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