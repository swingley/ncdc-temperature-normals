'use strict'

const fs = require('fs')
const path = require('path')
const constants = require('./ncdc-constants').stations
const allStations = constants.source

fs.readFile(allStations, 'utf8', (err, data) => {
  let {id, lat, lon, ele, state, name, gsn, hcn, wmoid} = constants.positions
  let rows = data.split('\n').filter(r => r.length)
  console.log(`Processing ${rows.length} station records.`)
  let stations = {}
  rows.forEach(row => {
    let sId = row.slice(id[0], id[1])
    if ( stations.hasOwnProperty(sId) ) {
      console.log('Duplicate station ID:  ', sId)
    } else {
      let la = parseFloat(row.slice(lat[0], lat[1]))
      let lo = parseFloat(row.slice(lon[0], lon[1]))
      stations[sId] = {
        id: sId,
        latitude: la,
        longitude: lo,
        elevation: parseFloat(row.slice(ele[0], ele[1])),
        state: row.slice(state[0], state[1]),
        name: row.slice(name[0], name[1]).trim(),
        gsnflag: row.slice(gsn[0], gsn[1]).trim(),
        hcnflag: row.slice(hcn[0], hcn[1]).trim(),
        wmoid: row.slice(wmoid[0], wmoid[1]).trim(),
        location: {
          type: 'Point',
          coordinates: [ lo, la ]
        }
      }
    }
  })
  console.log(`Found ${Object.keys(stations).length} stations.`)
  let stringified = JSON.stringify(stations, null, 2)
  fs.writeFile('json/stations.json', stringified, err => {
    if ( err ) {
      console.log('err writing stations.json', err)
    }
    console.log('Finished with stations.')
  })
})
