document.addEventListener('DOMContentLoaded', function () {
  // Number animation function
  function animateNumber(element, target) {
    let current = 0;
    const duration = 1500; // Animation duration in ms
    const steps = 60; // Number of steps
    const increment = target / steps;
    const stepTime = duration / steps;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(interval);
        element.textContent = Math.round(target);
      } else {
        element.textContent = Math.round(current);
      }
    }, stepTime);
  }

  // Define elements for number animation
  const elementsToAnimate = [
    { id: "thirtyFive", target: 35 },
    { id: "sixteenHundred", target: 1600 },
    { id: "threeThousand", target: 3000 },
    { id: "fiveHundred", target: 500 },
    { id: "five", target: 5 }
  ];

  // Create Intersection Observer with larger rootMargin to start animations earlier
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Only animate if not already animated
        if (!element.hasAttribute('data-animated')) {
          element.setAttribute('data-animated', 'true');
          
          // Handle number animations
          const elementData = elementsToAnimate.find(el => el.id === element.id);
          if (elementData) {
            animateNumber(element, elementData.target);
          }
          
          // Handle CSS animations
          if (element.classList.contains('animate__animated')) {
            // Remove any existing animation classes
            const currentAnimations = Array.from(element.classList)
              .filter(cls => cls.startsWith('animate__') && cls !== 'animate__animated');
            
            currentAnimations.forEach(animation => {
              element.classList.remove(animation);
            });
            
            // Add animations back after a brief delay
            requestAnimationFrame(() => {
              currentAnimations.forEach(animation => {
                element.classList.add(animation);
              });
            });
          }
        }
      }
    });
  }, {
    threshold: 0.2, // Trigger when 20% of element is visible
    rootMargin: '50px 0px', // Start animation slightly before element comes into view
  });

  // Start observing number elements
  elementsToAnimate.forEach(el => {
    const element = document.getElementById(el.id);
    if (element) {
      observer.observe(element);
    }
  });

  // Start observing animate.css elements
  document.querySelectorAll('[class*="animate__"]').forEach(element => {
    if (!elementsToAnimate.find(el => el.id === element.id)) {
      observer.observe(element);
    }
  });
});