import {SpotifyDashboard, SpotifyOverlay} from './components/widgets/spotify'
import {WhiteboardDashboard, WhiteboardOverlay} from './components/widgets/whiteboard'
import {GameboyDashboard, GameboyOverlay} from './components/widgets/gameboy'
import PayPalDashboard from './components/widgets/paypal/paypal-dashboard'
import PayPalOverlay from './components/widgets/paypal/paypal-overlay'
import axios from 'axios'

let allModules = {}

function registerModule (id, moduleSpec) {
  allModules[id] = moduleSpec;
}

// Hard-code registerModules here:
registerModule(1, { moduleId: 1,
  dashboardComponent: SpotifyDashboard, overlayComponent: SpotifyOverlay })
registerModule(2, { moduleId: 2,
  dashboardComponent: GameboyDashboard, overlayComponent: GameboyOverlay })
registerModule(3, { moduleId: 3,
  dashboardComponent: WhiteboardDashboard, overlayComponent: WhiteboardOverlay })
// PayPal is a work in progress: only expose it in development builds
if (process.env.NODE_ENV === 'development') {
  registerModule(4, { moduleId: 4,
    dashboardComponent: PayPalDashboard, overlayComponent: PayPalOverlay })
}


// TODO: get all modules and load them into allModules
axios.get('/api/modules')
  .then((res) => {
    return res.data.forEach((module) => {
      // DB may contain modules not registered in this build (e.g. PayPal in prod)
      if (!allModules[module.id]) return
      allModules[module.id].name = module.name
      allModules[module.id].description = module.description
      allModules[module.id].image = module.image
    })
  })

export { allModules, registerModule }

