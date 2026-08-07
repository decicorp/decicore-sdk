// ============================================================
// DeciCore JS SDK — Server Configuration
// ============================================================
//
// Set the DECICORE_ENV environment variable to switch servers
// without touching application code.
//
//   DECICORE_ENV=local  node app.js   → http://localhost:5000
//   DECICORE_ENV=test   node app.js   → https://test-api.decicore.dev
//   DECICORE_ENV=prod   node app.js   → https://api.decicore.dev  (default)
//
// Valid values: "local" | "test" | "prod"
// ============================================================

export const DECICORE_ENV = (
  process.env.DECICORE_ENV || 'prod'
) as 'local' | 'test' | 'prod';

const SERVERS = {
  local: 'http://localhost:5000',
  test:  'https://test-api.decicore.dev',
  prod:  'https://api.decicore.dev',
} as const;

/**
 * Resolved base URL for the current environment.
 *
 * @example
 * import { DECICORE_BASE_URL } from './decicore.config';
 * console.log(DECICORE_BASE_URL); // https://api.decicore.dev
 */
export const DECICORE_BASE_URL: string = SERVERS[DECICORE_ENV];
