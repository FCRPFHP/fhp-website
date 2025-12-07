// Function to set up mobile menu dropdown toggles only
// Note: Toggle button, close button, and link clicks are handled by event delegation
// to avoid duplicate handlers when content loads asynchronously
function setupMobileMenu() {
    const mobileNav = document.getElementById("mobileNav");
    
    // Only proceed if mobile nav exists
    if (!mobileNav) {
        return false;
    }
    
    // Close menu when clicking outside (only set up once)
    if (!mobileNav.dataset.outsideClickSetup) {
        mobileNav.dataset.outsideClickSetup = "true";
        mobileNav.addEventListener("click", (e) => {
            if (e.target === mobileNav) {
                mobileNav.classList.remove("active");
                document.body.classList.remove("menu-open");
                document.body.style.overflow = "";
            }
        });
    }
    
    // Mobile dropdown toggles - set up direct listeners to avoid conflicts with delegation
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
// This is the PRIMARY handler for toggle, close, and link clicks to avoid duplicates
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
        return; // Exit early to prevent other handlers
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
        return; // Exit early to prevent other handlers
    }
    
    // Close menu when clicking a link inside mobile nav
    if (e.target.closest("#mobileNav") && e.target.tagName === "A") {
        // Don't close if clicking on dropdown toggle (handled separately)
        if (!e.target.closest(".mobile-dropdown-toggle")) {
            const mobileNav = document.getElementById("mobileNav");
            if (mobileNav) {
                e.stopPropagation(); // Prevent bubbling to avoid duplicate handlers
                // Close immediately (no setTimeout delay)
                mobileNav.classList.remove("active");
                document.body.classList.remove("menu-open");
                document.body.style.overflow = "";
            }
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
