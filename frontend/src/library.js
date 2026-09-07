export const filterLibraryItems = (items, { query = "" } = {}) => {
  const normalizedQuery = query.trim().toLocaleLowerCase("ja");
  return items.filter(item => {
    if (!normalizedQuery) return true;
    const haystack = [item.title, ...(item.tags || [])].join(" ").toLocaleLowerCase("ja");
    return haystack.includes(normalizedQuery);
  });
};

export const sortLibraryItems = (items, mode = "manual") => {
  if (mode === "manual") return items;
  const sorted = [...items];
  if (mode === "recent") {
    sorted.sort((left, right) => String(right.lastOpenedAt || "").localeCompare(String(left.lastOpenedAt || "")));
  } else if (mode === "added") {
    sorted.sort((left, right) => String(right.date || "").localeCompare(String(left.date || "")));
  } else if (mode === "title") {
    sorted.sort((left, right) => String(left.title || "").localeCompare(String(right.title || ""), "ja"));
  }
  return sorted;
};

export const shouldUseStaticLibrary = ({ mode = "", hostname = "" } = {}) =>
  mode === "static" || String(hostname).toLowerCase().endsWith(".r2.dev");
