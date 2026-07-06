/**
 * Builds the static "demo mode" bundle for serverless hosting (e.g.
 * Cloudflare Pages). Same as the production build, except:
 *   - DEMO_MODE is baked in as true, which switches the client to
 *     client-side Twitch OAuth and locally-mocked API responses
 *     (see client/demo/).
 *   - TWITCH_CLIENT_ID is embedded in the bundle (client IDs are public).
 *
 * Build with: npm run build-demo
 * TWITCH_CLIENT_ID comes from the environment, falling back to secrets.js
 * locally. On Cloudflare Pages, set it as a build environment variable.
 */
const webpack = require('webpack')
const prodConfig = require('./prod.config')

if (!process.env.TWITCH_CLIENT_ID) {
  try {
    require('./secrets')
  } catch (err) {
    // no secrets.js: rely on the environment
  }
}

if (!process.env.TWITCH_CLIENT_ID) {
  throw new Error(
    'demo.config.js: TWITCH_CLIENT_ID is required (set it in the environment or secrets.js)'
  )
}

module.exports = {
  ...prodConfig,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.DEMO_MODE': '"true"',
      'process.env.TWITCH_CLIENT_ID': JSON.stringify(process.env.TWITCH_CLIENT_ID)
    }),
    // Keep every prod plugin except its DefinePlugin (replaced above).
    ...prodConfig.plugins.filter(p => !(p instanceof webpack.DefinePlugin))
  ]
}
