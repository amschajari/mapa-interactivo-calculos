// Inicializar el mapa con OpenStreetMap como capa base
const map = L.map('map').setView([-34.6037, -58.3816], 13); // Coordenadas de Buenos Aires

// Definir las capas base
const baseLayers = {
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }),
  "Satélite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
  })
};

// Añadir la capa base inicial (OpenStreetMap)
baseLayers["OpenStreetMap"].addTo(map);

// Crear el control de capas
const layerControl = L.control.layers(baseLayers, null, {
  collapsed: true // Panel colapsado
}).addTo(map);

// Función para buscar una ubicación
const searchLocation = async () => {
  const query = document.getElementById('search-input').value;
  if (!query) return;

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      map.setView([lat, lon], 13); // Centrar el mapa en la ubicación buscada

      // Agregar un marcador en la ubicación buscada
      L.marker([lat, lon]).addTo(map)
        .bindPopup(`Ubicación: ${query}`)
        .openPopup();
    } else {
      alert('Ubicación no encontrada');
    }
  } catch (error) {
    console.error('Error al buscar la ubicación:', error);
    alert('Error al buscar la ubicación');
  }
};

// Asignar la función de búsqueda al botón
document.getElementById('search-button').addEventListener('click', searchLocation);