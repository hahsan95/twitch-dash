// Must come first: in demo builds this intercepts all app API calls
// before any other module (e.g. allModules) fires a request.
import './demo/setup'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'

// establishes socket connection
// import './socket'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App className='app' />
    </Router>
  </Provider>,
  document.getElementById('app')
)
