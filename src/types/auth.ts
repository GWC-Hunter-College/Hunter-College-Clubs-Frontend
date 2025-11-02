// auth.ts 
import { COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } from "../config";

import { useAuth } from "react-oidc-context";

export type AuthInfo = {
  email?: string;
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

// Given raw react-oidc-context auth, normalize to our shape
export function deriveAuthInfo(auth: ReturnType<typeof useAuth>): AuthInfo {
  const email =
    auth?.user?.profile?.email ??
    auth?.user?.profile?.preferred_username ??
    auth?.user?.profile?.name ??
    undefined;

  const signIn =
    typeof auth?.signinRedirect === "function"
      ? () => auth.signinRedirect()
      : () => {};

  const signOut =
    typeof auth?.signoutRedirect === "function"
      ? () => auth.signoutRedirect({
          post_logout_redirect_uri: COGNITO_REDIRECT_URI,
          extraQueryParams: {
            client_id: COGNITO_CLIENT_ID,
            logout_uri: COGNITO_REDIRECT_URI,
          },
        })
      : () => {};

  return {
    email,
    signedIn: Boolean(auth?.isAuthenticated),
    signIn,
    signOut,
  };
}
