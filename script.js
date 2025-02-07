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


//Variables para las capas dibujadas
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

let drawControl = new L.Control.Draw({
    draw : {
        polygon : true,
        polyline : true,
        rectangle : false, // Desactivamos los rectángulos
        circle : false, // Desactivamos los círculos
        circlemarker:false,
        marker: true
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer;

    if (type === 'marker') {
      layer.bindPopup('Un marcador!');  
    }

  drawnItems.addLayer(layer);
});


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
  
  //Asociar eventos a los botones
document.getElementById('draw-polyline').addEventListener('click', () => {    
    new L.Draw.Polyline(map, drawControl.options.polyline).enable();
 });
 document.getElementById('draw-polygon').addEventListener('click', () => {
     new L.Draw.Polygon(map, drawControl.options.polygon).enable();
 });
 document.getElementById('draw-marker').addEventListener('click', () => {
     new L.Draw.Marker(map, drawControl.options.marker).enable();
 });


 //Funcionalidad del Boton Editar
 document.getElementById('edit').addEventListener('click', function() {
    map.on('draw:created', function(event) {
         drawnItems.addLayer(event.layer);
     });
     
     // Inicializa la edición si hay elementos dibujados
     if (drawnItems.getLayers().length > 0) {
      map.removeControl(drawControl); // Eliminar control de dibujo
         var editControl = new L.EditToolbar.Edit(map, {
             featureGroup: drawnItems,
             selectedPathOptions: drawControl.options.edit.selectedPathOptions
         });
         editControl.enable();         
     } else {
       alert('No hay elementos para editar.'); // Mostrar mensaje si no hay elementos
     }
 });

 //Funcionalidad del Boton Limpiar Marcadores
 document.getElementById('clear-markers').addEventListener('click', () => {
   drawnItems.clearLayers();
     if (map.hasLayer(drawnItems)) {
         map.removeLayer(drawnItems);
     }
     drawnItems = new L.FeatureGroup();
     map.addLayer(drawnItems);
     map.addControl(drawControl);
 });


  // Función para calcular y mostrar el área
  function calculateArea() {

    let area = 0;  
    if (drawnItems.getLayers().length > 0) {
      drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
          area += L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        }
      });
    
      area = (area / 1000000).toFixed(2); // Convertir a km² y redondear a 2 decimales
       alert(`Área total: ${area} km²`);
    } else {
      alert('Dibuje un polígono para calcular el área.');
    }
  }
  
  // Función para calcular distancia
  function calculateDistance() {
    if(drawnItems.getLayers().length > 0) {
      let distance = 0;
      drawnItems.eachLayer(function(layer) {
          if(layer instanceof L.Polyline) {
            distance += L.GeometryUtil.length(layer);
          }
      });
    
      distance = (distance / 1000).toFixed(2);
      alert(`Distancia total:  ${distance} km`);
    
    } else {
      alert('Dibuje una línea para calcular la distancia.');
    }  
  }
    
    // Función para calcular coordenadas
    function calculateCoordinates() {
    if (drawnItems.getLayers().length > 0) {
      let coordinates = "";
          drawnItems.eachLayer(function (layer) {
            if(layer instanceof L.Marker){
            coordinates += `Latitud: ${layer.getLatLng().lat.toFixed(6)}, Longitud: ${layer.getLatLng().lng.toFixed(6)} \n`;  
            } else if (layer instanceof L.Polyline || layer instanceof L.Polygon) {
              const latlngs = layer.getLatLngs();
                  if (Array.isArray(latlngs) && latlngs.length > 0) { 
                      latlngs.forEach(latlng => {
                        if (Array.isArray(latlng)) { // Verificar si es un polígono
                          latlng.forEach(point => coordinates += `Latitud: ${point.lat.toFixed(6)}, Longitud: ${point.lng.toFixed(6)}\n`);
                        } else { 
                          coordinates += `Latitud: ${latlng.lat.toFixed(6)}, Longitud: ${latlng.lng.toFixed(6)}\n`;
                        }
                      });
                    } else {
                      alert('No se pudieron obtener coordenadas del objeto.');
                    }
            }
          });
          alert(coordinates); // Mostrar las coordenadas en un alert
    } else {
      alert('Dibuje un marcador, una línea o un polígono para obtener coordenadas.');
    }
  }
  
  //Asociar eventos a los botones de calculo
  document.getElementById('calculate-area').addEventListener('click', calculateArea);
  document.getElementById('calculate-distance').addEventListener('click', calculateDistance);
  document.getElementById('calculate-coordinates').addEventListener('click', calculateCoordinates);