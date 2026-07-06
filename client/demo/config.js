/**
 * Demo mode: a serverless build of the app for static hosting (e.g.
 * Cloudflare Pages). Twitch login uses the client-side implicit grant flow
 * and all server API calls are answered locally (see ./setup.js).
 *
 * Both values are baked in at build time by webpack's DefinePlugin
 * (see demo.config.js / prod.config.js / webpack.config.js).
 */
export const DEMO_MODE = process.env.DEMO_MODE === 'true'
export const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || ''
