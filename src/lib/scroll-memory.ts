const STORAGE_KEY = "timect:scroll-map";

type ScrollMap = Record<string, number>;

let popped = false;

const POP_KEY = "timect:pop";

if (typeof window !== "undefined") {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.addEventListener("popstate", () => {
    popped = true;
    try {
      sessionStorage.setItem(POP_KEY, "1");
    } catch {
      /* ignore */
    }
  });
}

function readMap(): ScrollMap {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScrollMap) : {};
  } catch {
    return {};
  }
}

function writeMap(map: ScrollMap) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota / private mode */
  }
}

export function routeKey(path?: string, search?: string) {
  if (typeof window === "undefined") return path ?? "/";
  const nextPath = path ?? window.location.pathname;
  const nextSearch = search ?? window.location.search;
  return `${nextPath}${nextSearch}`;
}

export function currentScrollY() {
  if (typeof window === "undefined") return 0;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

/** Remember where the user is before a client navigation. */
export function saveScrollForCurrent() {
  if (typeof window === "undefined") return;
  const map = readMap();
  map[routeKey()] = currentScrollY();
  writeMap(map);
}

export function getSavedScroll(key: string): number | null {
  const y = readMap()[key];
  return typeof y === "number" && Number.isFinite(y) ? y : null;
}

export function isPopNav() {
  if (popped) return true;
  try {
    return sessionStorage.getItem(POP_KEY) === "1";
  } catch {
    return false;
  }
}

export function consumePopNav() {
  const was = isPopNav();
  popped = false;
  try {
    sessionStorage.removeItem(POP_KEY);
  } catch {
    /* ignore */
  }
  return was;
}

export function applyScroll(y: number) {
  if (typeof window === "undefined") return;
  const top = Math.max(0, y);
  window.scrollTo(0, top);
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
}

export function applyScrollTop() {
  applyScroll(0);
}
