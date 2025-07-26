/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYPAL_CLIENT_ID: string
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
