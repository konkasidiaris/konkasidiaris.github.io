(function() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  if (theme === 'dark') {
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.style.colorScheme = 'light';
  }
})();

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.style.colorScheme === 'dark';
  
  if (isDark) {
    html.style.colorScheme = 'light';
    localStorage.setItem('theme', 'light');
  } else {
    html.style.colorScheme = 'dark';
    localStorage.setItem('theme', 'dark');
  }
}
