import { addExternal, addLegacyExternal } from "../mocks/externals.js";
import * as xsrfToken from "../mocks/xsrfToken.js";
import xsrfTokenHeaderInjector from "./xsrfTokenHeaderInjector.local.js";
import xsrfTokenFormInjector from "./xsrfTokenFormInjector.local.js";

addExternal(["Roblox", "core-scripts", "auth", "xsrfToken"], xsrfToken);
addLegacyExternal(["Roblox", "XsrfToken"], xsrfToken);
addLegacyExternal(["Roblox", "XsrfTokenFormInjector"], xsrfTokenFormInjector);

xsrfTokenHeaderInjector.initialize();
xsrfTokenFormInjector.initialize();

export const bootstrap = () => ({
  token: xsrfToken.getToken(),
  hasRobloxGlobal: Boolean(globalThis.window?.Roblox),
});
