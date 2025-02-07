// Inicializar el mapa con OpenStreetMap como capa base
const map = L.map('map').setView([-34.6037, -58.3816], 13);

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
const layerControl = L.control.layers(baseLayers, null, { collapsed: true }).addTo(map);

// Función para buscar una ubicación
const searchLocation = async () => {
  const query = document.getElementById('search-input').value;
  if (!query) return;

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      map.setView([lat, lon], 13);
      
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

// Agregar herramientas de medición y dibujo con Leaflet.draw
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    remove: true
  },
  draw: {
    polygon: true,
    polyline: true,
    rectangle: false,
    circle: false,
    marker: true
  }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (event) {
  const layer = event.layer;
  drawnItems.addLayer(layer);
});

// Exportar coordenadas a CSV
const exportCoordinates = () => {
  let csvContent = "Latitude,Longitude\n";
  drawnItems.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      const { lat, lng } = layer.getLatLng();
      csvContent += `${lat},${lng}\n`;
    }
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'coordenadas.csv';
  link.click();
};

document.getElementById('export-coordinates').addEventListener('click', exportCoordinates);
