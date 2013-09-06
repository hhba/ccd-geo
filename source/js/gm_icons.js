var gmIcons = {
  prefectura: {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: '#B5D113',
    fillColor: '#B5D113',
    strokeWeight: 5,
    fillOpacity: 0.8,
    regExp: /prefectura/i,
    icon: 'img/prefectura.png'
  },
  ejercito: {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: '#00AD0C',
    fillColor: '#00AD0C',
    strokeWeight: 5,
    fillOpacity: 0.8,
    regExp: /ejercito/i,
    icon: 'img/ejercito.png'
  },
  policia: {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: 'blue',
    fillColor: 'blue',
    strokeWeight: 5,
    fillOpacity: 0.8,
    regExp: /policia/i,
    icon: 'img/policia.png'
  },
  marina: {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: 'white',
    fillColor: 'white',
    strokeWeight: 5,
    fillOpacity: 0.8,
    regExp: /marina/i,
    icon: 'img/marina.png'
  },
  penitenciaria: {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: '#3c3c3c',
    fillColor: '#3c3c3c',
    strokeWeight: 5,
    fillOpacity: 0.8,
    regExp: /peniten/i,
    icon: 'img/penitenciaria.png'
  },
  default: {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: 'yellow',
    fillColor: 'yellow',
    strokeWeight: 5,
    fillOpacity: 0.8,
    regExp: /./,
    icon: 'img/resto.png'
  }
}
