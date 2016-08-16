#!/Users/derek/.nvm/v6.3.1/bin/node

'use strict'

const fs = require('fs')
const path = require('path')
const constants = require('./ncdc-constants').normals

let parser = (fileName, statisticType, callback) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    let {station, month, value, flag, step} = constants.positions
    // Ignore empty rows.
    let rows = data.split('\n').filter(r => r.length)
    let normals = {}
    let flagInfo = { multiple: 0 }
    rows.forEach(row => {
      let dStation = row.slice(station[0], station[1])
      if ( !normals.hasOwnProperty(dStation) ) {
        normals[dStation] = { values: [] }
      }
      let start = value[0]
      let end = value[1]
      while ( (start + step - 1) <= row.length ) {
        let avg = parseInt(row.slice(start, end).trim(), 10) / 10
        let flag = row.slice(end, end + 1)
        // If flag is empty or value is < 0 then it's not a valid data point.
        if ( flag !== '' && avg > -1 ) {
          normals[dStation].values.push({
            avg: avg,
            flag: flag
          })
        }
        start += step
        end += step
      }
    })
    // Change format of station.values from array of objects to array of numbers
    // and add a flag property, count occurences of various flags.
    let stationIds = Object.keys(normals)
    stationIds.forEach(n => {
      let nums = normals[n].values.map(val => val.avg)
      // Get unique values of an array with new Set().
      let flags = [...new Set(normals[n].values.map(val => val.flag))]
      normals[n].values = nums
      normals[n].flags = flags
      if ( flags.length === 1 ) {
        if ( !flagInfo.hasOwnProperty(flags[0]) ) {
          flagInfo[flags[0]] = 0
        }
        flagInfo[flags[0]] += 1
      }
      if ( flags.length > 1 ) {
        // console.log('Multiple flags for ', n)
        flagInfo.multiple += 1
      }
    })
    console.log(`Flag counts for ${statisticType}:\n`, JSON.stringify(flagInfo, null, 2))
    normals.flagInfo = flagInfo
    normals.statistic = statisticType
    callback(null, normals)
  })
}

module.exports = parser
