declare interface Env extends NodeJS.ProcessEnv {
  NODE_ENV: 'development' | 'production'
  PORT: string
  DB_USER: string
  DB_PASS: string
  DB_URL_BASE: string
  JWT_SECRET: string
  JWT_EXPIRES: string
  BASE_URL: string
}
