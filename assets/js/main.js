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

async function initializeSearchOverlay() {
    const overlay = document.getElementById("kbar");
    const kbarInput = document.getElementById("kbar-input");
    const searchbox = document.getElementById("searchbox");
    const resultsContainer = document.getElementById("kbar-results");

    if (!overlay || !kbarInput || !searchbox || !resultsContainer) {
        return;
    }

    let previousFocus = null;
    let latestQuery = "";

    const setResultsMessage = (message) => {
        resultsContainer.innerHTML = `<p class="text-sm text-text-muted">${message}</p>`;
    };

    // adding this as variable so eslint will treat the target
    // as dynamic and not try to add it in compile time
    const PAGEFIND_MODULE_PATH = "/pagefind/pagefind.js";
    const pagefind = await import(PAGEFIND_MODULE_PATH);
    pagefind.init();

    async function performSearch(term) {
        const query = term.trim();
        latestQuery = query;

        if (!query) {
            setResultsMessage("Start typing to search…");
            return;
        }

        try {
            const search = await pagefind.search(query);

            if (latestQuery !== query) {
                return;
            }

            if (!search?.results?.length) {
                setResultsMessage("No results yet. Try another phrase.");
                return;
            }
            console.log(search.results)

            const entries = await Promise.all(
                search.results.slice(0, 10).map(async (hit) => {
                    const data = await hit.data();
                    const title = data.meta?.title ?? data.url;
                    const excerpt = data.excerpt ?? data.meta?.description ?? "";
                    return `
                        <a href="${data.url}"
                           class="block rounded-xl border border-border/40 p-3 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-primary">
                            <p class="font-medium">${title}</p>
                            ${excerpt ? `<p class="text-xs text-text-muted">${excerpt}</p>` : ""}
                        </a>`;
                })
            );

            if (latestQuery === query) {
                resultsContainer.innerHTML = entries.join("");
            }
        } catch (error) {
            console.error("Pagefind search failed", error);
            setResultsMessage("Search is temporarily unavailable.");
        }
    };

    function openKbar() {
        if (overlay.classList.contains("flex")) return;
        previousFocus = document.activeElement;
        overlay.classList.remove("hidden");
        overlay.classList.add("flex");
        kbarInput.value = "";
        setResultsMessage("Start typing to search…");
        kbarInput.focus();
    }

    function closeKbar() {
        if (!overlay.classList.contains("flex")) return;
        overlay.classList.remove("flex");
        overlay.classList.add("hidden");
        if (previousFocus && previousFocus !== searchbox && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        } else {
            searchbox.blur();
        }
    };

    function isTypingField() {
        const active = document.activeElement;
        if (!active) return false;
        const tag = active.tagName?.toLowerCase();
        return active.isContentEditable || tag === "input" || tag === "textarea";
    };

    function toggleKBar(event) {
        const key = event.key.toLowerCase();
        const typedCtrlK = (event.ctrlKey || event.metaKey) && key === "k";
        const typedSlash = !isTypingField() && key === "/";
        const typedEsc = key === "escape";
        const typedCtrlC = (event.ctrlKey || event.metaKey) && key === "c";

        if (typedCtrlK || typedSlash) {
            event.preventDefault();
            openKbar();
            return;
        }

        if ((typedEsc || typedCtrlC) && overlay.classList.contains("flex")) {
            event.preventDefault();
            closeKbar();
        }
    }

    document.addEventListener("keydown", toggleKBar);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeKbar();
        }
    });

    const focusSearchbox = () => {
        openKbar();
        searchbox.blur();
    };

    searchbox.addEventListener("focus", focusSearchbox);
    searchbox.addEventListener("click", focusSearchbox);

    kbarInput.addEventListener("input", (event) => {
        performSearch(event.target.value);
    });
}

function supportsViewTransitions() {
    return 'startViewTransition' in document;
}

function handleNavigation(e) {
    const link = e.target.closest('a');
    
    // Only handle internal links
    if (!link || link.origin !== location.origin || link.target === '_blank') {
        return;
    }
    
    // Skip if user is doing special navigation
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
    }
    
    e.preventDefault();
    
    if (supportsViewTransitions()) {
        document.startViewTransition(() => {
            window.location.href = link.href;
        });
    } else {
        window.location.href = link.href;
    }
}

document.addEventListener("DOMContentLoaded", async (_e) => {
     if (supportsViewTransitions()) {
        document.startViewTransition();
    }
    initializeTheme();
    initializeHamburgerMenu();
    await initializeSearchOverlay();

     document.addEventListener('click', handleNavigation);
});