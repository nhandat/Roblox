let token = "mock-xsrf-token";
let tokenTimestamp = new Date();

export const getToken = () => token;

export const setToken = nextToken => {
  token = nextToken;
  tokenTimestamp = new Date();
};

export const getTokenTimestamp = () => tokenTimestamp;

export const requiresXsrf = (method = "GET", url = "") => {
  const normalized = String(method).toUpperCase();
  const safeMethods = ["GET", "HEAD", "OPTIONS", "TRACE"];
  if (safeMethods.includes(normalized)) {
    return false;
  }
  return !/^https?:\/\//i.test(String(url)) || String(url).includes("roblox.com");
};
