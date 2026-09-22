/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_USE_MOCK_API?: string;
    readonly VITE_MOCK_ROLE?: "guest" | "user" | "member" | "eboard" | "owner";
    readonly VITE_API_BASE_URL: string;
    readonly VITE_COGNITO_DOMAIN: string;
    readonly VITE_COGNITO_CLIENT_ID: string;
    readonly VITE_COGNITO_REDIRECT_URI: string;
    readonly VITE_COGNITO_ISSUER: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
