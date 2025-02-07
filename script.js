// Inicializar el mapa con OpenStreetMap como capa base
const map = L.map('app').setView([-34.6037, -58.3816], 13); // Coordenadas de Buenos Aires

// Definir las capas base
const baseLayers = {
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }),
  "Satélite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
  }).addTo(map);
};

// Añadir la capa base inicial (OpenStreetMap)
baseLayers["OpenStreetMap"].addTo(map);

// Añadir un marcador
L.marker([-34.6037, -58.3816]).addTo(map)
  .bindPopup('¡Hola! Este es un marcador en Buenos Aires.')
  .openPopup();

// Crear el control de capas
const layerControl = L.control.layers(baseLayers, null, {
  collapsed: true // Panel colapsado
}).addTo(map);