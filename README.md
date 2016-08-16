## ncdc-temperature-normals

The [National Climate Data Center (NCDC)](https://www.ncdc.noaa.gov/) [temperature normals](https://www.ncdc.noaa.gov/data-access/land-based-station-data/land-based-datasets/climate-normals/1981-2010-normals-data) dataset is a fantastic resource. It's available via a handful of portal-ish tools and also FTP (ftp://ftp.ncdc.noaa.gov/pub/data/normals/1981-2010/). To get big chunks or all of it, use FTP. The readme.txt (ftp://ftp.ncdc.noaa.gov/pub/data/normals/1981-2010/readme.txt) has a good break down of what's available.

The code here takes minimum, maximum and average temperature normals from the NCDC FTP server, converts it to JSON and loads it into [mongo](https://www.mongodb.com/). There's also a simple node + express script to serve the data out of mongo.

The source files from the NCDC FTP server are:

- from `products/temperature` (ftp://ftp.ncdc.noaa.gov/pub/data/normals/1981-2010/products/temperature/):  `dly-tmin-normal.txt`, `dly-tmax-normal.txt`, `dly-tavg-normal.txt`
- from `station-inventories/` (ftp://ftp.ncdc.noaa.gov/pub/data/normals/1981-2010/station-inventories/):  `allstations.txt`

Those files are also included in this repo in the [raw/](raw/) directory. 

The easiest way to use these scripts is via npm, assuming mongo is running and available  on port 27017:

```
npm install
npm run munge
npm run load
npm run start
```

Once those complete, an express app will be running on port 3006. Pull out some data by going to a url like `http://localhost:3006/ncdc/normals/40.2/-85.4/03-09`.