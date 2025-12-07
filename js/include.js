// Function to set up mobile menu
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileNav = document.getElementById("mobileNav");
    const mobileNavClose = document.querySelector(".mobile-nav-close");
    
    // Only proceed if elements exist and haven't been set up yet
    if (!mobileMenuToggle || !mobileNav) {
        return false;
    }
    
    // Check if already set up by looking for data attribute
    if (mobileMenuToggle.dataset.setup === "true") {
        return true;
    }
    
    // Mark as set up
    mobileMenuToggle.dataset.setup = "true";
    
    // Mobile menu toggle - toggle open/close
    mobileMenuToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isActive = mobileNav.classList.contains("active");
        if (isActive) {
            // Close menu
            mobileNav.classList.remove("active");
            document.body.classList.remove("menu-open");
            document.body.style.overflow = "";
        } else {
            // Open menu
            mobileNav.classList.add("active");
            document.body.classList.add("menu-open");
            document.body.style.overflow = "hidden";
        }
    });
    
    // Close button
    if (mobileNavClose) {
        mobileNavClose.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            mobileNav.classList.remove("active");
            document.body.classList.remove("menu-open");
            document.body.style.overflow = "";
        });
    }
    
    // Close menu when clicking outside
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
    
    // Mobile dropdown toggles
    const mobileDropdownToggles = document.querySelectorAll(".mobile-dropdown-toggle");
    mobileDropdownToggles.forEach(toggle => {
        if (toggle.dataset.setup === "true") return;
        toggle.dataset.setup = "true";
        
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = toggle.parentElement;
            dropdown.classList.toggle("active");
            toggle.classList.toggle("active");
        });
    });
    
    return true;
}

document.addEventListener("DOMContentLoaded", function() {
    const includePromises = [];
    
    document.querySelectorAll("[data-include]").forEach(el => {
        const promise = fetch(el.getAttribute("data-include"))
            .then(response => response.text())
            .then(html => {
                el.innerHTML = html;
                // Set up mobile menu after header is loaded
                setupMobileMenu();
            });
        includePromises.push(promise);
    });
    
    // Also set up mobile menu after all includes are done (in case header loads first)
    Promise.all(includePromises).then(() => {
        setupMobileMenu();
    });
});

// Event delegation as fallback (works even if elements are added later)
document.addEventListener("click", (e) => {
    // Handle mobile menu toggle - toggle open/close
    if (e.target.classList.contains("mobile-menu-toggle") || e.target.closest(".mobile-menu-toggle")) {
        const mobileNav = document.getElementById("mobileNav");
        if (mobileNav) {
            e.preventDefault();
            e.stopPropagation();
            const isActive = mobileNav.classList.contains("active");
            if (isActive) {
                // Close menu
                mobileNav.classList.remove("active");
                document.body.classList.remove("menu-open");
                document.body.style.overflow = "";
            } else {
                // Open menu
                mobileNav.classList.add("active");
                document.body.classList.add("menu-open");
                document.body.style.overflow = "hidden";
            }
        }
    }
    
    // Handle mobile menu close
    if (e.target.classList.contains("mobile-nav-close") || e.target.closest(".mobile-nav-close")) {
        const mobileNav = document.getElementById("mobileNav");
        if (mobileNav) {
            e.preventDefault();
            e.stopPropagation();
            mobileNav.classList.remove("active");
            document.body.classList.remove("menu-open");
            document.body.style.overflow = "";
        }
    }
    
    // Handle mobile dropdown toggles
    if (e.target.classList.contains("mobile-dropdown-toggle") || e.target.closest(".mobile-dropdown-toggle")) {
        const toggle = e.target.classList.contains("mobile-dropdown-toggle") ? e.target : e.target.closest(".mobile-dropdown-toggle");
        if (toggle) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = toggle.parentElement;
            dropdown.classList.toggle("active");
            toggle.classList.toggle("active");
        }
    }
    
    // Close menu when clicking a link inside mobile nav
    if (e.target.closest("#mobileNav") && e.target.tagName === "A") {
        const mobileNav = document.getElementById("mobileNav");
        if (mobileNav) {
            setTimeout(() => {
                mobileNav.classList.remove("active");
                document.body.classList.remove("menu-open");
                document.body.style.overflow = "";
            }, 100);
        }
    }
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
    
    // Try to set up mobile menu immediately (in case header is already loaded)
    setupMobileMenu();
    
    // Also try after delays to catch async loads
    setTimeout(setupMobileMenu, 100);
    setTimeout(setupMobileMenu, 300);
    setTimeout(setupMobileMenu, 500);
    setTimeout(setupMobileMenu, 1000);
});
