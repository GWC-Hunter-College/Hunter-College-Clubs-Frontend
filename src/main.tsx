import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { AuthProvider } from "react-oidc-context";
import { COGNITO_ISSUER, COGNITO_CLIENT_ID, COGNITO_REDIRECT_URI } from './config.ts';

const cognitoAuthConfig = {
  // authority: `https://${COGNITO_DOMAIN}`,
  authority: COGNITO_ISSUER,
  client_id: COGNITO_CLIENT_ID,
  redirect_uri: COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "email openid profile",
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
