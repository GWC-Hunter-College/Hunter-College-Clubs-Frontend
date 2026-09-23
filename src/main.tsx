import { StrictMode } from 'react'
import type { ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import './index.css'
import App from './App.tsx'
import { theme } from './theme.ts';

import { AuthProvider } from "react-oidc-context";
import type { AuthProviderProps } from "react-oidc-context";
import { COGNITO_ISSUER, COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI, USE_MOCK_API } from './config.ts';


const cognitoAuthConfig = {
  // authority: `https://${COGNITO_DOMAIN}`,
  authority: COGNITO_ISSUER,
  client_id: COGNITO_CLIENT_ID,
  redirect_uri: COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "email openid profile",

  // sign out stufff
  // metadata: { end_session_endpoint: `https://${COGNITO_DOMAIN}/logout` },
  // post_logout_redirect_uri: COGNITO_REDIRECT_URI,
  popup_redirect_uri: COGNITO_REDIRECT_URI,

};


async function bootstrap() {
  let AuthenticationProvider: ComponentType<AuthProviderProps> = AuthProvider;
  // USE_MOCK_API is config.ts's single read of the design-mode toggle (defaults to off,
  // and is compiled to `false` outside dev mode), so this stays the only place that acts
  // on it instead of re-parsing the env var here too. Keeping the check here, rather than
  // always importing './mocks/browser', is what lets Vite's dead-code elimination drop the
  // mock module from production/staging builds when USE_MOCK_API compiles down to `false`.
  if (USE_MOCK_API) {
    const { startDesignMode } = await import('./mocks/browser');
    AuthenticationProvider = await startDesignMode();
  }

  createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="dark"
      theme={theme}>
      <AuthenticationProvider {...cognitoAuthConfig}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthenticationProvider>
    </MantineProvider>
  </StrictMode>,

  
  )
}

// Fail closed if mock startup fails: never mount the real auth/API path as a fallback.
void bootstrap().catch((error: unknown) => {
  console.error('Frontend startup failed', error);
  document.getElementById('root')!.textContent = 'Unable to start the frontend. Check the browser console.';
});
