export const COGNITO_DOMAIN = `https://${import.meta.env.VITE_COGNITO_DOMAIN}`;
export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID as string;
export const COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI as string;
export const COGNITO_ISSUER = import.meta.env.VITE_COGNITO_ISSUER as string;

// export function getLogoutUrl() {
//   const url = new URL(`${COGNITO_DOMAIN}/logout`);
//   url.searchParams.set('client_id', COGNITO_CLIENT_ID);
//   url.searchParams.set('logout_uri', window.location.origin + '/');
//   return url.toString();
// }
