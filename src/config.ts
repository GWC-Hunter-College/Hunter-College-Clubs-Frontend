export const COGNITO_DOMAIN = `https://${import.meta.env.VITE_COGNITO_DOMAIN}`;
export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID as string;
export const COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI as string;
export const COGNITO_ISSUER = import.meta.env.VITE_COGNITO_ISSUER as string;
// Design mode is opt-in and cannot be enabled in a production/staging build.
export const USE_MOCK_API = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === "true";
export const API_BASE_URL = USE_MOCK_API
  ? "/__design_api"
  : import.meta.env.VITE_API_BASE_URL as string;
// export function getLogoutUrl() {
//   const url = new URL(`${COGNITO_DOMAIN}/logout`);
//   url.searchParams.set('client_id', COGNITO_CLIENT_ID);
//   url.searchParams.set('logout_uri', window.location.origin + '/');
//   return url.toString();
// }
