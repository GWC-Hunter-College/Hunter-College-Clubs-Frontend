import './App.css'
import { AuthenticationForm } from './mantine-components/AuthenticationForm';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { COGNITO_DOMAIN, COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } from './config.ts';
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

import { useAuth } from "react-oidc-context";

function App() {
    const auth = useAuth();

    const signOutRedirect = () => {
    const clientId = COGNITO_CLIENT_ID;
    const logoutUri = COGNITO_REDIRECT_URI;
    const cognitoDomain = `https://${COGNITO_DOMAIN}`;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };
  
  // return (
  //   <MantineProvider>
  //     <AuthenticationForm>
  //     </AuthenticationForm>
  //   </MantineProvider>
  // )
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

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}

export default App
