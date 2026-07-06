/**
 * Client-side Twitch OAuth (implicit grant) for demo mode.
 *
 * Twitch redirects back to the site root with the access token in the URL
 * fragment (#access_token=...). We stash it in sessionStorage and query the
 * Helix API directly from the browser for the user's identity — no backend.
 */
import { TWITCH_CLIENT_ID } from './config'

const TOKEN_KEY = 'demo-twitch-token'

// If we just landed back from Twitch, capture the token, clean the URL, and
// land on /home (the server flow's callback redirected there too). This runs
// before React Router mounts, so the router boots directly on /home.
export function consumeTokenFromUrl() {
  if (!window.location.hash.includes('access_token=')) return
  const params = new URLSearchParams(window.location.hash.slice(1))
  const token = params.get('access_token')
  if (token) {
    window.sessionStorage.setItem(TOKEN_KEY, token)
    window.history.replaceState(null, '', '/home')
  }
}

export const getToken = () => window.sessionStorage.getItem(TOKEN_KEY)
export const clearToken = () => window.sessionStorage.removeItem(TOKEN_KEY)

// The redirect URI must be registered in the Twitch dev console
// (e.g. https://twitchdash.app/ and http://localhost:4200/ for local testing).
export function loginUrl() {
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    redirect_uri: window.location.origin + '/',
    response_type: 'token',
    scope: 'user:read:email'
  })
  return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
}

/**
 * Fetch the logged-in user from the Twitch Helix API and shape it like the
 * user object the rest of the client expects (see server/db/models/user.js).
 * Returns null when logged out or the token has expired.
 */
export async function fetchTwitchUser() {
  const token = getToken()
  if (!token) return null
  try {
    const res = await window.fetch('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': TWITCH_CLIENT_ID
      }
    })
    if (!res.ok) {
      clearToken()
      return null
    }
    const body = await res.json()
    const twitchUser = body.data && body.data[0]
    if (!twitchUser) {
      clearToken()
      return null
    }
    return {
      id: Number(twitchUser.id),
      twitchId: twitchUser.id,
      twitchLogin: twitchUser.display_name || twitchUser.login,
      twitchImg: twitchUser.profile_image_url,
      email: twitchUser.email
    }
  } catch (err) {
    console.error('Demo mode: could not reach the Twitch API', err)
    return null
  }
}
