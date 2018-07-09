


// async function getAll(array) {
//   array.map( async function (curr) {
//     // console.log(curr)
//       await getData(curr)

    
//   })
// }

// getAll(hrAr)


//  async function getAll() {
//   await getData(6) 
//   await getData(12)
//   await getData(24)
// }

// getAll()


async function getData(hours,hours1) {
const fs = require('fs')
const Path = require('path')
const axios = require('axios')
const jsonStream = require('JSONStream')
const es = require('event-stream')
const Json2csvTransform = require('json2csv').Transform
// const ost = require('object-stream-tools')
// const jg = require('json-to-geo')

const fields = ['TimeStamp', 'Longitude', 'Latitude', 'Current', 'icon']
const opts = { fields }
const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' }
const json2csv = new Json2csvTransform(opts, transformOpts)

const msHour =  60000 * 60;
// const hours = 12; 
var hrAr = [6,12]

// const end = new Date().toISOString()
const end = new Date((new Date().getTime()) - (hours1 * msHour)).toISOString().slice(0,23);
// const endLen = end.length
const start = new Date((new Date().getTime()) - (hours * msHour)).toISOString().slice(0,23);
console.log(end,start)
  console.time('apiTime')
  console.log(start,end)
  const api = 'https://lightningapi.nifc.gov/api/strike?'

  const url = `${api}startTime=${start}&endTime=${end}`
  console.log(url)
  const path = Path.resolve(__dirname, `./data/${hours}h_ltng.csv`)
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

// var array = [6,12,18,22,28,34,40,46,54,60,66,72]
// array.map((curr,i) => {
//   var second = i*6
//   getData(curr,second)
// })
var [x,n] = [0,6]
while (n<=72){
  var second = x*6
  getData(n,second)
  x=x+1
  n=n+6
}

// getData(6)
// getData(12)
