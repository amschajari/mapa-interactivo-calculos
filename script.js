// Inicializar el mapa
const map = L.map('app').setView([-34.6037, -58.3816], 13); // Coordenadas de Buenos Aires

// Añadir capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Añadir un marcador
L.marker([-34.6037, -58.3816]).addTo(map)
  .bindPopup('¡Hola! Este es un marcador en Buenos Aires.')
  .openPopup();