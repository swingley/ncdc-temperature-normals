'use strict'

const fs = require('fs')
const parser = require('./parse-normals')
const dataFiles = require('./ncdc-constants').normals.source
let normalsJsonFile = 'json/temperature-normals.json'
let normals = {}

let write = (err, info) => {
  if ( err ) { console.log('Error passed to write', err) }

  normals[info.statistic] = info
  let processed = Object.keys(normals)
  if ( processed.length === dataFiles.length ) {
    console.log(`Processed all...writing ${normalsJsonFile}`)
    fs.writeFile(normalsJsonFile, JSON.stringify(normals), (err) => {
      console.log('...wrote file.')
    })
  } else {
    console.log('Still processing...finished:  ', processed.join(', '))
  }
}

dataFiles.forEach(df => {
  parser(df.name, df.type, write)
})
