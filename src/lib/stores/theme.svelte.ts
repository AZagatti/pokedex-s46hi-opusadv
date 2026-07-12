const STORAGE_KEY = "pokedex-theme";

function createThemeStore() {
  let isDark = $state(false);

  function init() {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      isDark = saved === "dark";
    } else {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    applyTheme();
  }

  function applyTheme() {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", isDark);
  }

  function toggle() {
    isDark = !isDark;
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    applyTheme();
  }

  return {
    get isDark() {
      return isDark;
    },
    init,
    toggle,
  };
}

export const theme = createThemeStore();
