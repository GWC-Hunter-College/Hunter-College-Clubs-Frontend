import { COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } from "../config";

export interface OidcAuthLike {
  signoutRedirect: (args?: {
    post_logout_redirect_uri?: string;
    extraQueryParams?: Record<string, string>;
  }) => void | Promise<void>;
}

/** Shared sign-out helper (matches your Auth.tsx redirect pattern). */
export function signOutRedirect(auth: OidcAuthLike) {
  return auth.signoutRedirect({
    post_logout_redirect_uri: COGNITO_REDIRECT_URI,
    extraQueryParams: {
      client_id: COGNITO_CLIENT_ID,
      logout_uri: COGNITO_REDIRECT_URI,
    },
  });
}
