'use strict'

const express = require('express')
const moment = require('moment')
const client = require('mongodb').MongoClient

const port = 3006
const removeables = ['gsnflag', 'hcnflag', 'wmoid', 'min-values', 'avg-values', 'max-values']
const ncdcConnection = 'mongodb://localhost:27017/ncdc'
const ncdcCollection = 'normals'

const app = express();
// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const checkParams = (params) => {
  // Expect lat, lon and day.
  // Day comes as a MM-DD string. Default to a leap year to calculate day of
  // of the year number since all staions have values for 366 days.
  let {lat, lon, day} = params
  if ( !lat ) { return 'lat' }
  if ( !lon ) { return 'lon' }
  if ( !day ) { return 'day' }

  lat = +lat
  lon = +lon
  day = '2016-' + day
  day = +moment(day, 'YYYY-MM-DD').format('DDD')
  if ( lat > 90.00 || lat < -90.00 ) {
    return 'lat'
  }
  if ( lon > 180.00 || lon < -180.00 ) {
    return 'lon'
  }
  if ( !day ) {
    return 'day'
  }
  if ( day < 0 || day > 366 ) {
    return 'day'
  }
  return { lat: lat, lon: lon, day: day }
}

app.get('/', (req, res) => {
  res.send('hi')
})

app.get('/count', (req, res) => {
  client.connect(ncdcConnection, (err, db) => {
    let collection = db.collection(ncdcCollection);
    collection.count({}, (err, count) => {
      // console.log(`Count:  ${count}`)
      db.close()
      let response = JSON.stringify({ 'count': count })
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Length', Buffer.byteLength(response))
      res.end(response)
    })
  })
})

app.get('/ncdc/normals/:lat/:lon/:day', (req, res) => {
  let original = req.params.day
  // Re-format and validate parameters from the URL.
  // Test path:  /ncdc/normals/40.2/-85.4/03-09
  let verified = checkParams(req.params)
  if ( typeof verified === 'string' ) {
    res.status(400).send(`Invalid ${verified} parameter.`)
  }
  let {lat, lon, day} = verified
  // console.log('params', lat, lon, day)
  // Build a query to find stations near the lat, lon.
  client.connect(ncdcConnection, (err, db) => {
    let collection = db.collection(ncdcCollection);
    collection.geoNear(lon, lat, { num: 10, spherical: true}, (err, docs) => {
      db.close()
      let {results} = docs
      // Add the date requested as a property, remove a bunch of stuff.
      results.forEach(r => {
        r.obj.properties[`min-temp`] = r.obj.properties['min-values'][day]
        r.obj.properties[`avg-temp`] = r.obj.properties['avg-values'][day]
        r.obj.properties[`max-temp`] = r.obj.properties['max-values'][day]
        removeables.forEach(re => delete r.obj.properties[re])
      })
      results = results.map(r => r.obj)
      let response = JSON.stringify({ 'results': results })
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Length', Buffer.byteLength(response))
      res.end(response)
    })
  })
})

app.listen(port);
console.log(`Listening on port ${port}`);
