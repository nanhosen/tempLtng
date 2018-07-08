import { combineReducers } from 'redux'
import authReducer from './authReducer'
// import keplerGlReducer from './keplerGlReducer'

export default combineReducers({
	auth: authReducer,
	// keplerGl: keplerGlReducer
})