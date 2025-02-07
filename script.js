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

// Control de Dibujo
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


// Agregar el control de dibujo al mapa *DESPUÉS* de haberlo configurado
map.addControl(drawControl);


//Esta linea elimina los botones de la barra superior
map.removeControl(map.drawing.getToolbar());



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
    // ... (Código de la función calcularDistancia - sin cambios ) ...
}

// Calcular Área (y dibujar polígono)
document.getElementById('calculate-area').addEventListener('click', () => {
  // ... (Código de la función calcularArea - sin cambios) ...
});


calcularArea = () => {
    // ... (Código de la función calcularArea- sin cambios) ...
}


//Calcular Coordenadas
document.getElementById('calculate-coordinates').addEventListener('click', calculateCoordinates);
 //Funcionalidad del Boton Editar
 document.getElementById('edit').addEventListener('click', function() {
    //.. (Código de la función Editar - sin cambios) ...
 });

 //Funcionalidad del Boton Limpiar Marcadores
 document.getElementById('clear-markers').addEventListener('click', () => {
   //.. (Código de la función Limpiar Marcadores - sin cambios) ...
 });


calculateCoordinates = () => {
 //.. (Código de la función Calcular Coordenadas - sin cambios) ...
}