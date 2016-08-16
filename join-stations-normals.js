'use strict'

// Read stations and averages file. Output geojson files.
const fs = require('fs')
const normalsFile = 'json/temperature-normals.json'
const stationsFile = 'json/stations.json'
const joinedFile = 'json/normals-stations.json'

// Structure of normals file:
// max: {
//   <station-id>: { <values>: [...], <flags>: [...] }
// },
// min: {
//   <station-id>: { <values>: [...], <flags>: [...] }
// },
// avg: {
//   <station-id>: { <values>: [...], <flags>: [...] }
// }
let normals = fs.readFileSync(normalsFile)
// Structure of stations file:
// {
//   <station-id>: {
//     ...several properties, including id again
//     location: {
//       ...geojson point
//     }
//   }
// }
let stations = fs.readFileSync(stationsFile)

normals = JSON.parse(normals)
stations = JSON.parse(stations)

let features = []
let clone = (obj) => JSON.parse(JSON.stringify(obj))
// Object to keep track of feature index in features.
let lookup = {}

Object.keys(normals).forEach(stat => {
  Object.keys(normals[stat]).forEach(station => {
    // Normals JSON includes a couple of non-stationID properties. Ignore those.
    if ( stations.hasOwnProperty(station) ) {
      let current = normals[stat][station]
      let feature
      if ( lookup.hasOwnProperty(station) ) {
        // Already created a feature for this station, grab it.
        feature = features[lookup[station]]
      } else {
        feature = {}
        lookup[station] = features.length
        features.push(feature)

        // Save the station's geojson point.
        feature.geometry = clone(stations[station].location)
        // Copy the station attributes to the new feature.
        feature.properties = clone(stations[station])
        delete feature.properties.location
      }
      // Bring in the average temps and the flags for this data.
      feature.properties[`${stat}-values`] = current.values
      feature.properties[`${stat}-flags`] = current.flags
    }
  })
})

fs.writeFile(joinedFile, JSON.stringify(features), err => {
  if ( err ) {
    console.log('err writing file', err)
  }
  console.log(`Finished joining, wrote ${joinedFile}`)
})
