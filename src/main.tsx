import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"; 
import './index.css'
import App from './App.tsx'

import { AuthProvider } from "react-oidc-context";
import { COGNITO_ISSUER, COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } from './config.ts';

import { MantineProvider } from '@mantine/core';


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


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        fontFamily: "Inter, sans-serif",
        headings: { fontFamily: "Space Mono, monospace", fontWeight: "700" },
        primaryColor: "grape", // you can swap to a custom palette
        defaultRadius: "md",
        components: {
          Card: {
            defaultProps: { withBorder: true, radius: "lg", shadow: "sm" },
          },
          Button: {
            defaultProps: { radius: "xl" },
          },
        },
      }}>
      <AuthProvider {...cognitoAuthConfig}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,

  
)
