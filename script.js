// Inicializar el mapa con OpenStreetMap como capa base
const map = L.map('app').setView([-34.6037, -58.3816], 13); // Coordenadas de Buenos Aires

// Definir las capas base
const baseLayers = {
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }),
  "Satélite": L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=TU_TOKEN_MAPBOX', {
    attribution: '© Mapbox'
  }),
  "Terreno": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenTopoMap contributors'
  })
};

// Añadir la capa base inicial (OpenStreetMap)
baseLayers["OpenStreetMap"].addTo(map);

// Añadir un marcador
L.marker([-34.6037, -58.3816]).addTo(map)
  .bindPopup('¡Hola! Este es un marcador en Buenos Aires.')
  .openPopup();

// Cambiar el mapa base al hacer clic en los botones
document.getElementById('osm-button').addEventListener('click', () => {
  map.eachLayer(layer => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });
  baseLayers["OpenStreetMap"].addTo(map);
});

document.getElementById('satellite-button').addEventListener('click', () => {
  map.eachLayer(layer => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });
  baseLayers["Satélite"].addTo(map);
});

document.getElementById('terrain-button').addEventListener('click', () => {
  map.eachLayer(layer => {
    if (layer instanceof L.TileLayer) {
      map.removeLayer(layer);
    }
  });
  baseLayers["Terreno"].addTo(map);
});