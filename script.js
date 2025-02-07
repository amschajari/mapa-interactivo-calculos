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
    draw: {
        polygon: false,
        polyline: false,
        rectangle: false, 
        circle: false, 
        circlemarker: false,
        marker: true
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);



  // Función para buscar una ubicación
  const searchLocation = async () => {
    // ... (Código de la función searchLocation - sin cambios) ...
  };
   document.getElementById('search-button').addEventListener('click', searchLocation);

// Dibujar Marcador
document.getElementById('draw-marker').addEventListener('click', () => {
    new L.Draw.Marker(map, drawControl.options.marker).enable();
    map.off('draw:created');//desactiva eventos anteriores si existen
    
     // Evento para cuando se termina de dibujar el marcador
     map.on('draw:created', function (e) {
        let layer = e.layer;
        drawnItems.addLayer(layer);        
    });
});

// Calcular Distancia (y dibujar polilínea)
document.getElementById('calculate-distance').addEventListener('click', () => {    
    new L.Draw.Polyline(map, drawControl.options.polyline).enable();
    map.off('draw:created');//desactiva eventos anteriores si existen

      // Evento para cuando se termina de dibujar la línea
     map.on('draw:created', function (e) {
         let layer = e.layer;
         drawnItems.addLayer(layer);    
         calcularDistancia();   
     });
});


calcularDistancia = () => {  
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

// Calcular Área (y dibujar polígono)
document.getElementById('calculate-area').addEventListener('click', () => {
  new L.Draw.Polygon(map, drawControl.options.polygon).enable();
  map.off('draw:created');//desactiva eventos anteriores si existen

 // Evento para cuando se termina de dibujar el polígono
 map.on('draw:created', function (e) {        
     let layer = e.layer;
     drawnItems.addLayer(layer);
     calcularArea();
 });
});


calcularArea = () => {
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


//Calcular Coordenadas
document.getElementById('calculate-coordinates').addEventListener('click', calculateCoordinates);
 //Funcionalidad del Boton Editar
 document.getElementById('edit').addEventListener('click', function() {
    map.off('draw:created');//desactiva eventos anteriores si existen
    map.on('draw:created', function(event) {
         drawnItems.addLayer(event.layer);
     });
     
     // Inicializa la edición si hay elementos dibujados
     if (drawnItems.getLayers().length > 0) {
         map.removeControl(drawControl); // Eliminar control de dibujo
         var editControl = new L.EditToolbar.Edit(map, {
             featureGroup: drawnItems,             
         });
         editControl.enable();     
     } else {
       alert('No hay elementos para editar.'); // Mostrar mensaje si no hay elementos
     }
 });

 //Funcionalidad del Boton Limpiar Marcadores
 document.getElementById('clear-markers').addEventListener('click', () => {
  map.off('draw:created');//desactiva eventos anteriores si existen
   drawnItems.clearLayers();
     if (map.hasLayer(drawnItems)) {
         map.removeLayer(drawnItems);
     }
     drawnItems = new L.FeatureGroup();
     map.addLayer(drawnItems);
     map.addControl(drawControl);
 });


calculateCoordinates = () => {
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