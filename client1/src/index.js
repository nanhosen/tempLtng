import 'materialize-css/dist/css/materialize.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import reduxThunk from 'redux-thunk'
import { taskMiddleware } from 'react-palm'

import App from './components/App'
import reducers from './reducers'
import registerServiceWorker from './registerServiceWorker'

const middlewares = [
	reduxThunk,
]

const store = createStore(reducers, {}, applyMiddleware(...middlewares))

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>,
	document.getElementById('root')
)

registerServiceWorker()
