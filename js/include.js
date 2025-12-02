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
});
