// tiny Zustand persist wrapper that is safe in SSR/offline
export const persist = (config, { name }) => (set, get, api) =>
  config(
    (args) => {
      set(args);
      try {
        const json = JSON.stringify(get());
        localStorage.setItem(name, json);
      } catch {}
    },
    get,
    api
  );

export function rehydrate(name) {
  try {
    const raw = localStorage.getItem(name);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}
