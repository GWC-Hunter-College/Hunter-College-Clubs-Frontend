import './App.css'
import { AuthenticationForm } from './mantine-components/AuthenticationForm';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } from './config.ts';
import '@mantine/core/styles.css';

import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    auth.signoutRedirect({
      post_logout_redirect_uri: COGNITO_REDIRECT_URI, // keep the standard param
      extraQueryParams: {
        client_id: COGNITO_CLIENT_ID,             // required by Cognito
        logout_uri: COGNITO_REDIRECT_URI              // required by Cognito
      },
    });
  };
  
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
      <AuthenticationForm>
      </AuthenticationForm>
    </div>
  );
}

export default App
