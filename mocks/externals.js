const ensureWindow = () => {
  if (!globalThis.window) {
    globalThis.window = {};
  }
  return globalThis.window;
};

const setPath = (target, path, value) => {
  let current = target;
  path.forEach((segment, index) => {
    if (index === path.length - 1) {
      current[segment] = value;
    } else {
      current[segment] = current[segment] || {};
      current = current[segment];
    }
  });
};

export const addExternal = (path, value) => {
  const win = ensureWindow();
  setPath(win, path, value);
};

export const addLegacyExternal = (pathOrKey, value) => {
  const win = ensureWindow();
  if (Array.isArray(pathOrKey)) {
    setPath(win, pathOrKey, value);
    return;
  }
  win[pathOrKey] = value;
};
