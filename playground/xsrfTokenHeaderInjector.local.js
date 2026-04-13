import * as xsrfToken from "../mocks/xsrfToken.js";

const csrfTokenHeader = "X-CSRF-TOKEN";

const handleAjaxSend = (settings = {}) => {
  const currentToken = xsrfToken.getToken();
  const shouldAttach = xsrfToken.requiresXsrf(settings.type, settings.url);
  if (!currentToken || !shouldAttach) {
    return {};
  }
  return { [csrfTokenHeader]: currentToken };
};

const initialize = () => {
  if (!globalThis.window) {
    globalThis.window = {};
  }
  window.__mockAjaxSend = handleAjaxSend;
};

export default {
  initialize,
  handleAjaxSend,
};
