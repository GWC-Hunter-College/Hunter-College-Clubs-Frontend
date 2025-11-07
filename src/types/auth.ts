// auth.ts
import { COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } from "../config";
import { useMemo } from "react";
import { useAuth } from "react-oidc-context";

export type AuthInfo = {
  email?: string;
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;

  accessToken?: string;
  getAccessToken: () => string | null;
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
      ? () =>
          auth.signoutRedirect({
            post_logout_redirect_uri: COGNITO_REDIRECT_URI,
            extraQueryParams: {
              client_id: COGNITO_CLIENT_ID,
              logout_uri: COGNITO_REDIRECT_URI,
            },
          })
      : () => {};

  // react-oidc-context / oidc-client-ts keeps the token here
  const accessToken = auth?.user?.access_token ?? undefined;

  const getAccessToken = () => auth?.user?.access_token ?? null;

  return {
    email,
    signedIn: Boolean(auth?.isAuthenticated),
    signIn,
    signOut,
    accessToken,
    getAccessToken,
  };
}

export function useAuthInfo(): AuthInfo {
  const raw = useAuth();
  return useMemo(
    () => deriveAuthInfo(raw),
    [raw.isAuthenticated, raw.user] // recompute when auth state or user (tokens) change
  );
}
