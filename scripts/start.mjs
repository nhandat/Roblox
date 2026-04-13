globalThis.window = {
  location: { href: "https://www.roblox.com/home" },
};
globalThis.document = { nodeType: 9 };
Object.defineProperty(globalThis, "navigator", {
  value: { userAgent: "node" },
  configurable: true,
});
globalThis.HTMLFormElement = class HTMLFormElement {};

const { bootstrap } = await import("../playground/entry.local.js");
const result = bootstrap();

console.log("✅ Playground started");
console.log(`Token: ${result.token}`);
console.log(`window.Roblox ready: ${result.hasRobloxGlobal}`);
console.log("Tip: local mock runtime only (for analysis/testing). ");
