/**
 * Copy this file to `secrets.js` (gitignored) and fill in real values.
 * In development, `server/index.js` requires `../secrets` to populate
 * process.env. In production, set these as real environment variables.
 *
 * Keep `secrets.js` and `secrets.example.js` in sync: everything except the
 * sensitive values (IDs, secrets, tokens) should be identical, so that
 * `diff secrets.js secrets.example.js` only shows the secret lines.
 */

// --- Required: Twitch OAuth login ---
// Register an application at https://dev.twitch.tv/console/apps
// OAuth Redirect URLs (register both):
//   local: http://localhost:4200/auth/twitch/callback
//   prod:  https://twitchdash.app/auth/twitch/callback
process.env.TWITCH_CLIENT_ID = ''
process.env.TWITCH_CLIENT_SECRET = ''
process.env.TWITCH_CALLBACK_URL = 'http://localhost:4200/auth/twitch/callback'

// --- Required for the Twitch chat bot (skipped if unset) ---
// An OAuth token for the bot account, in the form 'oauth:xxxxxxxxxxxx'.
// Generate one with the chat:read and chat:edit scopes.
process.env.TWITCH_OAUTH_TOKEN = ''
process.env.TWITCH_BOT_USERNAME = ''

// --- Session ---
// Generate random string with node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
process.env.SESSION_SECRET = ''

// --- Optional: base URL the bot uses to call back into this app ---
// Defaults to http://localhost:<PORT>; in production set to https://twitchdash.app
// process.env.APP_URL = ''

// --- Optional: database (defaults to postgres://localhost:5432/twitch-dash) ---
// process.env.DATABASE_URL = ''

// --- Optional: Spotify music voting (skipped if unset) ---
// Register at https://developer.spotify.com/dashboard
// Spotify no longer allows http://localhost redirect URIs, so use 127.0.0.1
// locally (and browse the app at http://127.0.0.1:4200 so the session cookie
// matches). Redirect URIs to register (register both):
//   local: http://127.0.0.1:4200/auth/spotify/callback
//   prod:  https://twitchdash.app/auth/spotify/callback
// process.env.SPOTIFY_CLIENT_ID = ''
// process.env.SPOTIFY_CLIENT_SECRET = ''
// process.env.SPOTIFY_CALLBACK_URL = 'http://127.0.0.1:4200/auth/spotify/callback'
// process.env.SPOTIFY_API_URL = 'https://api.spotify.com'

// --- Optional: PayPal donations, sandbox (skipped if unset) ---
// process.env.PAYPAL_CLIENT_ID = ''
// process.env.PAYPAL_CLIENT_SECRET = ''
// process.env.PAYPAL_CALLBACK_URL = 'http://localhost:4200/auth/paypal/callback'

// --- Optional: Google OAuth (skipped if unset) ---
// process.env.GOOGLE_CLIENT_ID = ''
// process.env.GOOGLE_CLIENT_SECRET = ''
// process.env.GOOGLE_CALLBACK = '/auth/google/callback'
