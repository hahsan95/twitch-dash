/**
 * Demo mode bootstrap. Imported first in client/index.js; does nothing unless
 * the bundle was built with DEMO_MODE=true (see demo.config.js).
 *
 * Replaces the axios adapter so every call the app makes to its own backend
 * (/auth/*, /api/*) is answered in the browser, while any other request
 * (e.g. static files like /gameboy/index.html) passes through untouched.
 */
import axios from 'axios'
import { DEMO_MODE } from './config'
import { consumeTokenFromUrl, clearToken, fetchTwitchUser } from './auth'

// Mirrors bin/data/modules.json; IDs match client/allModules.js registration.
const MODULES = [
  { id: 1, name: 'Spotify', description: 'Placeholder description about this super awesome Spotify integration that gives your viewers the chance to dictate what songs are playing on stream.', image: 'spotify' },
  { id: 2, name: 'Gameboy', description: 'Placeholder description about a Gameboy emulator that is controlled by Twitch chat.', image: 'game' },
  { id: 3, name: 'Whiteboard', description: 'Placeholder description about a whiteboard component that allows you to draw and leave notes to be rendered on screen.', image: 'pencil' },
  { id: 4, name: 'PayPal', description: 'Placeholder description about a PayPal donations widget that lets viewers send donations that appear on stream.', image: 'paypal' }
]

const MODULE_STATE_KEY = 'demo-module-state'
const defaultModuleState = { active: [2, 3], deactivated: [1] }

function loadModuleState() {
  try {
    const saved = window.localStorage.getItem(MODULE_STATE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (err) {
    // fall through to default
  }
  return { ...defaultModuleState }
}

function saveModuleState(state) {
  window.localStorage.setItem(MODULE_STATE_KEY, JSON.stringify(state))
  return state
}

// Same semantics as server/api/users.js: POST activates a new module,
// PUT toggles an existing one between active and deactivated.
function activateModule(moduleId) {
  const state = loadModuleState()
  if (!state.active.includes(moduleId)) state.active.push(moduleId)
  state.deactivated = state.deactivated.filter(id => id !== moduleId)
  return saveModuleState(state)
}

function toggleModule(moduleId) {
  const state = loadModuleState()
  if (state.active.includes(moduleId)) {
    state.active = state.active.filter(id => id !== moduleId)
    state.deactivated.push(moduleId)
  } else {
    state.deactivated = state.deactivated.filter(id => id !== moduleId)
    state.active.push(moduleId)
  }
  return saveModuleState(state)
}

function parseBody(config) {
  if (!config.data) return {}
  try {
    return typeof config.data === 'string' ? JSON.parse(config.data) : config.data
  } catch (err) {
    return {}
  }
}

// Returns the mocked response data for app-backend routes, or undefined to
// pass the request through to the network.
async function handleRoute(method, path, config) {
  if (path === '/auth/me') {
    return (await fetchTwitchUser()) || ''
  }
  if (path === '/auth/logout' && method === 'post') {
    clearToken()
    return ''
  }
  if (path === '/api/modules') {
    return MODULES
  }
  if (path === '/api/users/me/modules') {
    if (method === 'post') return activateModule(Number(parseBody(config).moduleId))
    if (method === 'put') return toggleModule(Number(parseBody(config).moduleId))
    return loadModuleState()
  }
  // Spotify + votecycle endpoints: the Spotify widget is gated on a Spotify
  // access token that never exists in demo mode, so harmless empty answers
  // are enough to keep any stray calls from blowing up.
  if (path.startsWith('/api/users/me/playlists')) return {}
  if (path.startsWith('/api/users/me/player')) return {}
  if (path.startsWith('/api/votecycles') || path.startsWith('/api/votechoices') || path.startsWith('/api/votes')) return ''
  if (path.startsWith('/auth/') || path.startsWith('/api/')) return ''
  return undefined
}

function install() {
  consumeTokenFromUrl()

  const networkAdapter = axios.getAdapter(['xhr', 'fetch'])

  axios.defaults.adapter = async config => {
    const url = config.url || ''
    // Only intercept same-origin app routes; let absolute URLs and static
    // assets hit the network.
    if (url.startsWith('/auth/') || url.startsWith('/api/')) {
      const method = (config.method || 'get').toLowerCase()
      const data = await handleRoute(method, url.split('?')[0], config)
      if (data !== undefined) {
        return {
          data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {}
        }
      }
    }
    return networkAdapter(config)
  }
}

if (DEMO_MODE) install()
