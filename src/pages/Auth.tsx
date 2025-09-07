// src/pages/AuthPage.tsx
import '@mantine/core/styles.css';
import '../App.css'
import { useAuth } from "react-oidc-context";
import { COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } from "../config";
import AuthenticationForm from "../mantine-components/AuthenticationForm";

export default function Auth() {
  const auth = useAuth();

  const signOutRedirect = () => {
    auth.signoutRedirect({
      post_logout_redirect_uri: COGNITO_REDIRECT_URI,
      extraQueryParams: {
        client_id: COGNITO_CLIENT_ID,
        logout_uri: COGNITO_REDIRECT_URI,
      },
    });
  };

  const googlePopUp = () =>
    auth.signinPopup({
        // Force Google in the Hosted UI
      extraQueryParams: { identity_provider: "Google", prompt: "select_account" },
    });

    if (auth.isLoading) {
        return <div>Loading...</div>;
      }
    
    if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
    }
    if (auth.isAuthenticated) {
        return (
          <div>
            <pre> Hello: {auth.user?.profile.email} </pre>
            <pre> ID Token: {auth.user?.id_token} </pre>
            <pre> Access Token: {auth.user?.access_token} </pre>
            <pre> Refresh Token: {auth.user?.refresh_token} </pre>
    
            <button onClick={() => signOutRedirect()}>Sign out</button>
          </div>
        );
      }
      return (
        <div>
          <button onClick={() => auth.signinRedirect()}>Sign in</button>
          <AuthenticationForm onGoogleClick={googlePopUp}>
          </AuthenticationForm>
        </div>
      );
}
