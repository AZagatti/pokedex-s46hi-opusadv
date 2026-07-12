const STORAGE_KEY = "pokedex-favorites";

function createFavoritesStore() {
  let ids = $state<number[]>([]);

  function init() {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      ids = saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      ids = [];
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  function toggle(id: number) {
    if (ids.includes(id)) {
      ids = ids.filter((x) => x !== id);
    } else {
      ids = [...ids, id];
    }
    persist();
  }

  function isFavorite(id: number): boolean {
    return ids.includes(id);
  }

  return {
    get ids() {
      return ids;
    },
    init,
    toggle,
    isFavorite,
  };
}

export const favorites = createFavoritesStore();
