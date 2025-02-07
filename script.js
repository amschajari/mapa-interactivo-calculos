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
      const lat = layer.getLatLng().lat.toFixed(6);
      const lng = layer.getLatLng().lng.toFixed(6);
      layer.bindPopup(`Coordenadas: ${lat}, ${lng}`);
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
    // Deshabilitar otros modos de dibujo
    disableDrawModes();
     new L.Draw.Polygon(map, drawControl.options.polygon).enable();
     map.once('draw:created', function (e) {
        const layer = e.layer;
        const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        const km2 = (area / 1000000).toFixed(2);
        const m2 = area.toFixed(2);
        const center = layer.getBounds().getCenter();
        let popupContent = '';

        if (area >= 1000000) {
            popupContent = `Área: ${km2} km²`;
        } else {
            popupContent = `Área: ${m2} m²`;
        }

        L.popup({closeOnClick: false, autoClose: false})
            .setLatLng(center)
            .setContent(popupContent)
            .openOn(map);

          drawnItems.addLayer(layer);
    });
  }

  // Función para calcular distancia
  function calculateDistance() {
    // Deshabilitar otros modos de dibujo
    disableDrawModes();

    new L.Draw.Polyline(map, drawControl.options.polyline).enable();

    map.once('draw:created', function (e) {
        const layer = e.layer;
        const distance = L.GeometryUtil.length(layer);
        const km = (distance / 1000).toFixed(2);
        const m = distance.toFixed(2);
        const latlngs = layer.getLatLngs();
        const centerIndex = Math.floor(latlngs.length / 2);
        const center = latlngs[centerIndex];
        let popupContent = '';

        if (distance >= 1000) {
            popupContent = `Distancia: ${km} km`;
        } else {
            popupContent = `Distancia: ${m} m`;
        }

        L.popup({closeOnClick: false, autoClose: false})
            .setLatLng(center)
            .setContent(popupContent)
            .openOn(map);

          drawnItems.addLayer(layer);
    });
  }

    // Función para calcular coordenadas
    function calculateCoordinates() {
    // Deshabilitar otros modos de dibujo
    disableDrawModes();

    new L.Draw.Marker(map, drawControl.options.marker).enable();

    map.once('draw:created', function (e) {
        const layer = e.layer;
        const lat = layer.getLatLng().lat.toFixed(6);
        const lng = layer.getLatLng().lng.toFixed(6);
        layer.bindPopup(`Coordenadas: ${lat}, ${lng}`).openPopup();

      drawnItems.addLayer(layer);
    });
  }

  // Función para deshabilitar otros modos de dibujo
function disableDrawModes() {
    if (map.pm.globalDrawModeEnabled()) {
        map.pm.disableDraw('polyline');
        map.pm.disableDraw('polygon');
        map.pm.disableDraw('marker');
        map.pm.disableDraw('circle');
        map.pm.disableDraw('rectangle');
        map.pm.disableDraw('circlemarker');
    }
}

  //Asociar eventos a los botones de calculo
  document.getElementById('calculate-area').addEventListener('click', calculateArea);
  document.getElementById('calculate-distance').addEventListener('click', calculateDistance);
  document.getElementById('calculate-coordinates').addEventListener('click', calculateCoordinates);

  // Agrega esta función para hacer la conversion a UTM
function utmConverter(latitude, longitude) {
    const utmResult = utm.fromLatLon(latitude, longitude);
    return {
        UTMX: utmResult.easting,
        UTMY: utmResult.northing,
        ZonaUTM: utmResult.zoneNum + utmResult.zoneLetter
    };
}

// Función asíncrona para obtener la elevación
async function getElevation(latitude, longitude) {
    const apiUrl = `https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].elevation;
        } else {
            console.warn('Elevation not found for coordinates:', latitude, longitude);
            return null;
        }
    } catch (error) {
        console.error('Error fetching elevation:', error);
        return null;
    }
}

// Función para exportar las coordenadas a una tabla y permitir la descarga en CSV y GeoJSON
async function exportCoordinates() {
  let coordinatesData = []; // Array para almacenar los datos de las coordenadas
  let featureIndex = 1; // Contador para el índice de características

  // Desactivar temporalmente los eventos de dibujo
    map.off(L.Draw.Event.CREATED);

  drawnItems.eachLayer(async function (layer) {
      let featureType = '';
      let latlngs = [];

      if (layer instanceof L.Marker) {
          featureType = 'Punto';
          latlngs = [layer.getLatLng()];
      } else if (layer instanceof L.Polyline) {
          featureType = 'Línea';
          latlngs = layer.getLatLngs();
      } else if (layer instanceof L.Polygon) {
          featureType = 'Polígono';
          latlngs = layer.getLatLngs()[0];
          // Cerrar el polígono añadiendo el primer punto al final
          latlngs.push(latlngs[0]);
      }

      // Iterar sobre cada conjunto de coordenadas (vértices)
      for (let i = 0; i < latlngs.length; i++) {
          const latlng = latlngs[i];
          const latitude = latlng.lat;
          const longitude = latlng.lng;

          // Obtener la elevación
          const elevation = await getElevation(latitude, longitude);

          // Convertir a UTM
          const utm = utmConverter(latitude, longitude);

          // Crear objeto de datos de coordenadas
          const coordinate = {
              index: featureIndex++,
              type: featureType,
              vertex: i + 1,
              latitude: latitude.toFixed(6),
              longitude: longitude.toFixed(6),
              elevation: elevation !== null ? elevation.toFixed(2) : 'N/A',
              utmX: utm.UTMX.toFixed(2),
              utmY: utm.UTMY.toFixed(2),
              utmZone: utm.ZonaUTM
          };

          coordinatesData.push(coordinate);
      }
  });

  // Esperar a que todas las elevaciones se obtengan antes de proceder
  setTimeout(() => {
      // Generar la tabla HTML
      const tableHtml = generateTableHtml(coordinatesData);
      document.getElementById('coordinates-table-container').innerHTML = tableHtml;

      // Generar el GeoJSON
      const geoJsonData = generateGeoJson(coordinatesData);

      // Mostrar el modal
      document.getElementById('coordinates-modal').style.display = 'block';

      // Asignar eventos a los botones de descarga
      document.getElementById('download-csv').onclick = () => downloadCsv(coordinatesData);
      document.getElementById('download-geojson').onclick = () => downloadGeoJson(geoJsonData);

            // Reactivar los eventos de dibujo después de generar la tabla
            map.on(L.Draw.Event.CREATED, function (e) {
                var type = e.layerType,
                    layer = e.layer;

                if (type === 'marker') {
                    const lat = layer.getLatLng().lat.toFixed(6);
                    const lng = layer.getLatLng().lng.toFixed(6);
                    layer.bindPopup(`Coordenadas: ${lat}, ${lng}`);
                }

                drawnItems.addLayer(layer);
            });
  }, 1000); // Ajusta el tiempo de espera según sea necesario
}

// Función para generar la tabla HTML
function generateTableHtml(data) {
  let tableHtml = `
      <table id="coordinates-table">
          <thead>
              <tr>
                  <th>#</th>
                  <th>Tipo</th>
                  <th>Vértice</th>
                  <th>Latitud</th>
                  <th>Longitud</th>
                  <th>Elevación (m)</th>
                  <th>UTMX (m)</th>
                  <th>UTMY (m)</th>
                  <th>Zona UTM</th>
              </tr>
          </thead>
          <tbody>
  `;

  data.forEach(item => {
      tableHtml += `
          <tr>
              <td>${item.index}</td>
              <td>${item.type}</td>
              <td>${item.vertex}</td>
              <td>${item.latitude}</td>
              <td>${item.longitude}</td>
              <td>${item.elevation}</td>
              <td>${item.utmX}</td>
              <td>${item.utmY}</td>
              <td>${item.utmZone}</td>
          </tr>
      `;
  });

  tableHtml += `
          </tbody>
      </table>
  `;

  return tableHtml;
}

// Función para generar el GeoJSON
function generateGeoJson(data) {
  const geoJsonFeatures = data.map(item => {
      return {
          type: "Feature",
          geometry: {
              type: "Point",
              coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)]
          },
          properties: {
              index: item.index,
              type: item.type,
              vertex: item.vertex,
              elevation: item.elevation,
              utmX: item.utmX,
              utmY: item.utmY,
              utmZone: item.utmZone
          }
      };
  });

  return {
      type: "FeatureCollection",
      features: geoJsonFeatures
  };
}

// Función para descargar los datos en formato CSV
function downloadCsv(data) {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  data.forEach(item => {
      const values = headers.map(header => {
          let value = item[header];
          // Encerrar los valores en comillas dobles si contienen comas
          if (typeof value === 'string' && value.includes(',')) {
              value = `"${value}"}`;
          }
          return value;
      });
      csvRows.push(values.join(','));
  });

  const csvData = csvRows.join('\n');
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'coordenadas.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Función para descargar los datos en formato GeoJSON
function downloadGeoJson(geoJson) {
  const geoJsonString = JSON.stringify(geoJson, null, 2);
  const blob = new Blob([geoJsonString], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'coordenadas.geojson');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Función para geolocalizar al usuario
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                map.setView([lat, lng], 15); // Centrar el mapa en la ubicación del usuario

                // Opcional: Agregar un marcador en la ubicación del usuario
                L.marker([lat, lng]).addTo(map)
                    .bindPopup("Estás aquí!")
                    .openPopup();
            },
            function(error) {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Permiso de geolocalización denegado.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Información de ubicación no disponible.");
                        break;
                    case error.TIMEOUT:
                        alert("Tiempo de espera agotado para obtener la ubicación.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("Error desconocido al intentar obtener la ubicación.");
                        break;
                }
            }
        );
    } else {
        alert("Geolocalización no soportada por este navegador.");
    }
}

// Asignar evento al botón de exportar coordenadas
document.getElementById('export-coordinates').addEventListener('click', exportCoordinates);

// Asignar evento al botón de geolocalización
document.getElementById('locate-user').addEventListener('click', locateUser);

// Cerrar el modal
document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('coordinates-modal').style.display = 'none';
});

// Cierra el modal si se hace clic fuera del contenido
window.addEventListener('click', function(event) {
    const modal = document.getElementById('coordinates-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});