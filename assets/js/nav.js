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
