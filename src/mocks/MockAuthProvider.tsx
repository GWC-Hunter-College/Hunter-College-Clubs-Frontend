import { useMemo, useSyncExternalStore } from 'react';
import type { PropsWithChildren } from 'react';
import { AuthContext } from 'react-oidc-context';
import type { AuthContextProps } from 'react-oidc-context';
import { User } from 'oidc-client-ts';
import { getSignedIn, MOCK_ACCESS_TOKEN, setSignedIn, subscribeAuth } from './state';

const user = new User({
  access_token: MOCK_ACCESS_TOKEN,
  id_token: 'design-only-id-token',
  token_type: 'Bearer',
  scope: 'openid email profile',
  profile: {
    sub: 'design-demo-user', iss: 'local-design-mode', aud: 'local-design-mode',
    exp: 4_102_444_800, iat: 0,
    name: 'Alex Rivera', email: 'alex.rivera@example.test', preferred_username: 'alex.demo',
  },
});
const signIn = async () => { setSignedIn(true); };
const signOut = async () => { setSignedIn(false); };
const signInWithUser = async () => { setSignedIn(true); return user; };
const noop = async () => {};

// Implements the existing context, including /auth, without constructing a UserManager.
// No OIDC discovery, storage, redirects, token renewal, or Cognito requests occur.
export default function MockAuthProvider({ children }: PropsWithChildren) {
  const signedIn = useSyncExternalStore(subscribeAuth, getSignedIn);
  const value = useMemo<AuthContextProps>(() => ({
    isLoading: false, isAuthenticated: signedIn, user: signedIn ? user : null,
    settings: { authority: 'local-design-mode', client_id: 'local-design-mode', redirect_uri: '/' },
    // No current screen subscribes to OIDC lifecycle events. Fail explicitly if that changes.
    get events(): never { throw new Error('OIDC lifecycle events are not implemented in design mode'); },
    signinRedirect: signIn, signinPopup: signInWithUser, signinSilent: signInWithUser,
    signinResourceOwnerCredentials: signInWithUser,
    signoutRedirect: signOut, signoutPopup: signOut, signoutSilent: signOut, removeUser: signOut,
    clearStaleState: noop, revokeTokens: noop, querySessionStatus: async () => null,
    startSilentRenew: () => {}, stopSilentRenew: () => {},
  }), [signedIn]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
