document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("[data-include]").forEach(el => {
        fetch(el.getAttribute("data-include"))
            .then(response => response.text())
            .then(html => el.innerHTML = html);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector(".footer-section");
    if (footer) {
        const disclaimer = document.createElement("div");
        disclaimer.className = "site-disclaimer";
        disclaimer.innerHTML = `
            This website is for <strong>FiveM and GTA V roleplay purposes only</strong>.<br>
            It is not affiliated with, endorsed by, or representing the real Florida Highway Patrol.
        `;
        footer.parentNode.insertBefore(disclaimer, footer);
    }
    
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileNavClose = document.querySelector(".mobile-nav-close");
    const mobileDropdownToggles = document.querySelectorAll(".mobile-dropdown-toggle");
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener("click", () => {
            mobileNav.classList.add("active");
            document.body.classList.add("menu-open");
            document.body.style.overflow = "hidden";
        });
    }
    
    if (mobileNavClose && mobileNav) {
        mobileNavClose.addEventListener("click", () => {
            mobileNav.classList.remove("active");
            document.body.classList.remove("menu-open");
            document.body.style.overflow = "";
        });
    }
    
    // Close menu when clicking outside
    if (mobileNav) {
        mobileNav.addEventListener("click", (e) => {
            if (e.target === mobileNav) {
                mobileNav.classList.remove("active");
                document.body.classList.remove("menu-open");
                document.body.style.overflow = "";
            }
        });
        
        // Close menu when clicking a link
        mobileNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileNav.classList.remove("active");
                document.body.classList.remove("menu-open");
                document.body.style.overflow = "";
            });
        });
    }
    
    // Mobile dropdown toggles
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const dropdown = toggle.parentElement;
            dropdown.classList.toggle("active");
            toggle.classList.toggle("active");
        });
    });
});
