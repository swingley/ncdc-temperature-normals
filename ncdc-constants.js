module.exports = {
  'normals': {
    'positions': {
      'station': [0, 11],
      'month': [12, 14],
      'value': [18, 23],
      'flag': [23, 24],
      'step': 7
    },
    'flags': {
      'C': 'complete',
      'S': 'standard',
      'R': 'representative',
      'P': 'provisional',
      'Q': 'quasi-normal'
    },
    'source': [
      { 'name': 'raw/dly-tavg-normal.txt', 'type': 'avg' },
      { 'name': 'raw/dly-tmin-normal.txt', 'type': 'min' },
      { 'name': 'raw/dly-tmax-normal.txt', 'type': 'max' }
    ]
  },
  'stations': {
    'positions': {
      'id': [0, 11],
      'lat': [12, 20],
      'lon': [21, 30],
      'ele': [31, 37],
      'state': [38, 40],
      'name': [41, 71],
      'gsn': [72, 75],
      'hcn': [76, 79],
      'wmoid': [80, 85]
    },
    'source': 'raw/allstations.txt'
  }
}
