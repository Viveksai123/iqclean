document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("scroll", function () {
        let header = document.querySelector(".th-header");
        let links = document.querySelectorAll(".nav-link");
        let dropdownIcons = document.querySelectorAll(".menu-item-has-children > a");
        let logoInitial = document.querySelector(".logo-initial");
        let logoScrolled = document.querySelector(".logo-scrolled");
        
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
            links.forEach(link => link.classList.add("text-black"));
            dropdownIcons.forEach(icon => icon.classList.add("text-black"));
            logoInitial.style.display = "none";
            logoScrolled.style.display = "block";
        } else {
            header.classList.remove("scrolled");
            links.forEach(link => link.classList.remove("text-black"));
            dropdownIcons.forEach(icon => icon.classList.remove("text-black"));
            logoInitial.style.display = "block";
            logoScrolled.style.display = "none";
        }
    });
});