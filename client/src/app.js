// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import React, { Component } from 'react'
import styled from 'styled-components'
import window from 'global/window'
import { connect } from 'react-redux'

import Banner from './components/banner'
import Announcement from './components/announcement'
import Firenet from './components/Firenet'
import Button from './components/Button'
import downloadJsonFile from "./components/file-download"

import { loadSampleConfigurations } from './actions'
import { replaceLoadDataModal } from './factories/load-data-modal'

import KeplerGlSchema from 'kepler.gl/schemas'
const KeplerGl = require('kepler.gl/components').injectComponents([
  replaceLoadDataModal()
])
const MAPBOX_TOKEN ='pk.eyJ1IjoicnRpcHBldHRzIiwiYSI6ImNpb2huaWtuNDAwNnF1NW0xNWFhYXJiM20ifQ.-c3uBsqfQoJgd3gG4TbNLw#0/0/0/0' // eslint-disable-line

// Sample data
// import lightning from './data/test2.csv'
// import lightningConfig from './data/lightning-config.json'

/* eslint-disable no-unused-vars */
import sampleTripData from './data/sample-trip-data'
import sampleGeojson from './data/sample-geojson.json'
import sampleIconCsv, { config as savedMapConfig } from './data/sample-icon-csv'
import { updateVisData, addDataToMap } from 'kepler.gl/actions'
import Processors from 'kepler.gl/processors'
/* eslint-enable no-unused-vars */

const bannerHeight = 30

const GlobalStyleDiv = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif
  font-weight: 400
  font-size: 0.875em
  line-height: 1.71429

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    box-sizing: border-box
  }
`

class App extends Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight
  }

  componentWillMount() {
    // if we pass an id as part of the url
    // we try to fetch along map configurations
    const { params: { id: sampleMapId } = {} } = this.props
    this.props.dispatch(loadSampleConfigurations(sampleMapId))
    window.addEventListener('resize', this._onResize)
    this._onResize()
  }

  componentDidMount() {
    // delay 2s to show the banner
    if (!window.localStorage.getItem('kgHideBanner')) {
      window.setTimeout(this._showBanner, 3000)
    }
    // load sample data
    // this._loadSampleData()
    // const data = Processors.processCsvData(lightning)
    // Create dataset structure
    // const dataset = {
    //   data,
    //   info: {
    //     // `info` property are optional, adding an `id` associate with this dataset 
    //     // makes it easier to replace later
    //     id: 'my_data'
    //   }
    // }
    // addDataToMap action to inject dataset into kepler.gl instance
    // this.props.dispatch(addDataToMap({ datasets: dataset, config: nycConfig }))
    // this.props.dispatch(addDataToMap({ datasets: dataset }))
    // this.props.dispatch(addDataToMap({ datasets: dataset, config: lightningConfig }))
  }

  componentWillUnmount() {
    window.remmoveEventListener('resize', this._onResize)
  }

  _onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  _showBanner = () => {
    this.setState({showBanner: true})
  }

  _hideBanner = () => {
    this.setState({showBanner: false})
  }

  _disableBanner = () => {
    this._hideBanner()
    window.localStorage.setItem('kgHideBanner', 'true')
  }

  _loadSampleData() {
    this.props.dispatch(
      updateVisData(
        // datasets
        {
          info: {
            label: 'Sample Taxi Trips in New York City',
            id: 'test_trip_data'
          },
          data: sampleTripData
        },
        // option
        {
          centerMap: true,
          readOnly: false
        },
        // config
        {
          filters: [
            {
              id: 'me',
              dataId: 'test_trip_data',
              name: 'tpep_pickup_datetime',
              type: 'timeRange',
              enlarged: true
            }
          ]
        }
      )
    )

    // load icon data and config and process csv file
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Icon Data',
              id: 'test_icon_data'
            },
            data: Processors.processCsvData(sampleIconCsv)
          }
        ],
        options: {
          centerMap: false
        },
        config: savedMapConfig
      })
    )

    // load geojson
    this.props.dispatch(
      updateVisData({
        info: {label: 'SF Zip Geo'},
        data: Processors.processGeojson(sampleGeojson)
      })
    )
  }
  // This method is used as reference to show how to export the current kepler.gl instance configuration
  // Once exported the configuration can be imported using parseSavedConfig or load method from KeplerGlSchema
  getMapConfig() {
    // retrieve kepler.gl store
    console.log(this.props)
    const { keplerGl } = this.props.demo;
    // retrieve current kepler.gl instance store
    const { map } = keplerGl;

    // create the config object
    return KeplerGlSchema.getConfigToSave(map)
  }

  // This method is used as reference to show how to export the current kepler.gl instance configuration
  // Once exported the configuration can be imported using parseSavedConfig or load method from KeplerGlSchema
  exportMapConfig = () => {
    // create the config object
    const mapConfig = this.getMapConfig();
    // save it as a json file
    downloadJsonFile(mapConfig, 'lightning-config.json')
  }

  replaceData = () => {
    const data = Processors.processCsvData(lightning)
    const dataset = {
      data,
      info: {
        // this is used to match the dataId defined in lightning.json. For more details see API documentation.
        // It is paramount that this id mathces your configuration otherwise
        id: 'my_data'
      }
    }

    // read the current configuration
    const config = this.getMapConfig()

    // addDataToMap action to inject dataset into kepler.gl instance
    this.props.dispatch(addDataToMap({ datasets: dataset, config }))    
  }

  render() {
    const { showBanner, width, height } = this.state
    return (
      <GlobalStyleDiv>
        <Banner
          show={this.state.showBanner}
          height={bannerHeight}
          onClose={this._hideBanner}
        >
          <Announcement onDisable={this._disableBanner}/>
        </Banner>
        <div
          style={{
            transition: 'margin 1s, height 1s',
            position: 'absolute',
            width: '100%',
            height: showBanner ? `calc(100% - ${bannerHeight}px)` : '100%',
            minHeight: `calc(100% - ${bannerHeight}px)`,
            marginTop: showBanner ? `${bannerHeight}px` : 0
          }}
        >
        {/*
          <Button onClick={ this.exportMapConfig }>Export Config</Button>
          <Firenet />
        */}
          <KeplerGl
            mapboxApiAccessToken={MAPBOX_TOKEN}
            id='map'
            /*
             * Specify path to keplerGl state, because it is not mount at the root
             */
            getState={state => {
              console.log("state: ", state)
              return state.demo.keplerGl
            }}
            width={width}
            height={height - (showBanner ? bannerHeight : 0)}
          />

        </div>
      </GlobalStyleDiv>
    )
  }
}

const mapStateToProps = state => state
const dispatchToProps = dispatch => ({ dispatch })

export default connect(
  mapStateToProps,
  dispatchToProps
)(App)
