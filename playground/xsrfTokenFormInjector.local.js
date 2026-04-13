import * as xsrfToken from "../mocks/xsrfToken.js";

const initialize = () => {
  if (!globalThis.window) {
    return;
  }
  window.Roblox = window.Roblox || {};
  window.Roblox.mockFormToken = xsrfToken.getToken();
};

export default {
  initialize,
};
