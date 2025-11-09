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