const fs = require('fs')
const client = require('mongodb').MongoClient

const dataFile = 'json/normals-stations.json'

console.log('Trying to insert ncdc normals, this will take a few seconds.')
client.connect('mongodb://localhost:27017/ncdc', (err, db) => {
  let collection = db.collection('normals')
  collection.deleteMany({})
  fs.readFile(dataFile, 'utf8', (err, data) => {
    if ( err ) {
      console.log('Error reading ncdc normals data file', err)
      return
    }
    data = JSON.parse(data)
    collection.insertMany(data, null, (err, result) => {
      console.log('Inserted ' + result.insertedCount + ' features.')
      collection.createIndex({ geometry:"2dsphere" }, null, (err, indexName) => {
        console.log('Created spatial index named ' + indexName)
        db.close()
        console.log('Closed the db connection.')
      })
    })
  })
})
