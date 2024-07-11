export const CONFIG = {
  API_HOST: import.meta.env.VITE_API_HOST,
  // AUTH
  PRODUCTION: import.meta.env.VITE_PROD, // default Vite flag
  STS_AUTHORITY: import.meta.env.VITE_STS_AUTHORITY,
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  CLIENT_SECRET: import.meta.env.VITE_CLIENT_SECRET,
  CLIENT_ROOT: import.meta.env.VITE_CLIENT_ROOT,
  CLIENT_SCOPE: import.meta.env.VITE_CLIENT_SCOPE,
  QUOTE_HOST: import.meta.env.VITE_QUOTE_HOST,
  // GTAG
  GTAG_ENABLED: import.meta.env.VITE_GTAG_ENABLED === "true",
  GTAG_ID: import.meta.env.VITE_GTAG_ID,
};
