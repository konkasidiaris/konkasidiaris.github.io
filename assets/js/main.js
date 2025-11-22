function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.style.colorScheme === 'dark';
    const button = document.getElementById("dark-mode-toggle");

    if (isDark) {
        html.style.colorScheme = 'light';
        localStorage.setItem('theme', 'light');
        button.classList.remove("dark");
        button.setAttribute("aria-label", "Enable dark mode");
    } else {
        html.style.colorScheme = 'dark';
        button.classList.add("dark");
        localStorage.setItem('theme', 'dark');
        button.setAttribute("aria-label", "Enable light mode");
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const button = document.getElementById("dark-mode-toggle");

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    if (theme === 'dark') {
        document.documentElement.style.colorScheme = 'dark';
        button.classList.add("dark");
        button.setAttribute("aria-label", "Enable light mode");
    } else {
        document.documentElement.style.colorScheme = 'light';
        button.setAttribute("aria-label", "Enable dark mode");
    }

    document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);
}

function initializeHamburgerMenu() {
    document.getElementById("hamburger").addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("open");
    });
}

document.addEventListener("DOMContentLoaded", (_e) => {
    initializeTheme();
    initializeHamburgerMenu();
});

const overlay = document.getElementById("kbar");
const kbarInput = document.getElementById("kbar-input");
const searchbox = document.getElementById("searchbox");

function openKbar() {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    kbarInput.focus();
}

function closeKbar() {
    overlay.classList.remove("flex");
    overlay.classList.add("hidden");
};

document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k" || e.key === "/") {
        e.preventDefault();
        openKbar();
    }
    if ((e.key === "Escape" || (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") && overlay.classList.contains("flex")) {
        closeKbar();
    }
});

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        closeKbar();
    }
});

searchbox.addEventListener("focus", () => {
    openKbar();
    searchbox.blur();
});