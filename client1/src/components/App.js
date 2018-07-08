import React, { Component } from 'react'
import {  BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'

import Header from './Header'

const routes = [
 // { path: '/signin',
 //  component: RequireUnauth(Signin),
 //  exact: true
 // },
 // { path: '/signout',
 //  component: Signout,
 //  exact: true
 // },
 // { path: '/signup',
 //   component: RequireUnauth(Signup),
 //   exact: true
 // },
 // { path: '/feature',
 //   component: RequireAuth(Feature),
 //   exact: true
 // },
 // { path: '/zonegroup',
 //   component: RequireAuth(ZoneGroup),
 //   exact: true
 // },
 // { path: '/map',
 //  component: MapContainer,
 //  exact: true
 // },
 // { path: '/',
 //  component: Header,
 //  exact: true
 // }, 
 // { 
 //   component: Home
 // },
]

const RouteWithSubRoutes = route => (
 <Route 
   path={route.path}
   render={props => (
     <route.component {...props} routes={route.routes} />
   )}
 />
)

class App extends Component {
  componentDidMount() {

  }
  render() {
    return (
      <div className='container'>
        <Header/>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </div>
    )
  }
}

export default connect(null, actions)(App)