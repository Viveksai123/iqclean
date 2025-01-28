
document.addEventListener('DOMContentLoaded', function () {
    // Number animation function
    function animateNumber(element, target) {
      let current = 0;
      const increment = target / 100;
  
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          clearInterval(interval);
          current = target;
        }
        element.textContent = Math.floor(current);
      }, 15);
    }
  
    // Define elements for number animation
    const elementsToAnimate = [{
        id: "thirtyFive",
        target: 35
      },
      {
        id: "sixteenHundred",
        target: 1600
      },
      {
        id: "threeThousand",
        target: 3000
      },
      {
        id: "fiveHundred",
        target: 500
      },
      {
        id: "five",
        target: 5
      }
    ];
  
    // Function to reset and trigger CSS animations
    function resetAndTriggerAnimation(element) {
      const animations = Array.from(element.classList)
        .filter(cls => cls.startsWith('animate__') && cls !== 'animate__animated');
  
      // Remove animation classes
      element.classList.remove('animate__animated');
      animations.forEach(animation => element.classList.remove(animation));
  
      // Force reflow
      void element.offsetWidth;
  
      // Add animation classes back
      element.classList.add('animate__animated');
      animations.forEach(animation => element.classList.add(animation));
    }
  
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
  
          // Handle number animations
          const elementData = elementsToAnimate.find(el => el.id === element.id);
          if (elementData) {
            element.textContent = "0";
            animateNumber(element, elementData.target);
          }
  
          // Handle CSS animations
          if (element.classList.contains('animate__animated') ||
            Array.from(element.classList).some(cls => cls.startsWith('animate__'))) {
            resetAndTriggerAnimation(element);
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px'
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
      if (!elementsToAnimate.find(el => el.id === element.id)) { // Avoid double-observing
        observer.observe(element);
      }
    });
  
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        // Reset all animations when page becomes visible again
        document.querySelectorAll('[class*="animate__"]').forEach(element => {
          resetAndTriggerAnimation(element);
        });
      }
    });
  });