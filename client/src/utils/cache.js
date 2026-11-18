const CACHE_KEY = "dataCache";

// טעינת ה-cache מ-sessionStorage (נשמר בריענון, נמחק בסגירת הלשונית)
function loadCache() {
  try {
    return JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

let cache = loadCache();

function persist() {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // אם אין מקום - ממשיכים בלי לשמור
  }
}

export function getCache(key) {
  return cache[key];
}

export function setCache(key, entry) {
  cache[key] = entry;
  persist();
}

// מוחק את כל הרשימות של resource מסוים, חוץ מהרשימה הנוכחית
export function clearResource(resource, exceptKey) {
  Object.keys(cache).forEach((key) => {
    if (key.split(/[?|]/)[0] === resource && key !== exceptKey) {
      delete cache[key];
    }
  });
  persist();
}

// מחיקת הכול (ביציאה / בכניסה)
export function clearCache() {
  cache = {};
  sessionStorage.removeItem(CACHE_KEY);
}
