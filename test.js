const axios = require('axios')
const fs = require('fs')
const Path = require('path')
const jsonStream = require('JSONStream')
// const ost = require('object-stream-tools')
const es = require('event-stream')
const Json2csvTransform = require('json2csv').Transform
const jg = require('json-to-geo')

const fields = ['TimeStamp', 'Longitude', 'Latitude', 'Current', 'icon']
const opts = { fields }
const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' }
const json2csv = new Json2csvTransform(opts, transformOpts)


async function getData() {
  console.time('apiTime')
  const api = 'https://lightningapi.nifc.gov/api/strike?'
  const start = `2018-07-08T12:00:01`
  const end = `2018-07-08T18:00:01`
  const url = `${api}startTime=${start}&endTime=${end}`
	const path = Path.resolve(__dirname, './data/test.csv')
  try {
  	const response = await axios({
  		method: 'GET',
  		url,
  		responseType: 'stream',
  		headers: { 
  			'Authorization': 'Basic bGlnaHRuaW5nOlN0ciFrZURAdGE=', 
  			'Accept': 'application/json' 
  		} 
  	})

    response.data
      .pipe(jsonStream.parse('strikes.*'))
      .pipe(jsonStream.stringify())
      .pipe(es.replace('Polarity', 'icon'))
      .pipe(es.replace('P', 'plus'))
      .pipe(es.replace('N', 'minus'))
      .pipe(json2csv)
      // .pipe(jg.transform())
      // .pipe(ost.map(obj => {  // doesn't work like you think it should
      //   const { Polarity, TimeStamp, ..._ } = obj
      //   console.log(_)
      //   return obj.Polarity = "P" 
      //     ? _icon = 'plus'
      //     : _.icon
      //   }
      // }))
      .pipe(fs.createWriteStream(path))  

    // return a promise and resolve when download finishes
    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
      	console.log('success')
      	console.timeEnd('apiTime')
        resolve()
      })
      response.data.on('error', () => {
        reject(new Error('failure'))
      })
    })

  }
  catch (err) {
    console.log(err)    
  }

}

getData()