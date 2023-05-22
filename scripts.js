document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("generalFilter").addEventListener("change", function() {
        var selectedFilter = this.value;
        const table = document.getElementById('goleadoresBody');
        table.innerHTML = "";
        // Adquirir los elementos
        var categoriasContainer = document.getElementById("categoriasContainer");
        var divisionContainer = document.getElementById("divisionContainer");
        var generoContainer = document.getElementById("generoContainer");
        var clubesContainer = document.getElementById("clubesContainer");
        var jugadorContainer = document.getElementById("jugadorContainer");

        // Primero, oculta todos
        categoriasContainer.classList.add('d-none');
        divisionContainer.classList.add('d-none');
        generoContainer.classList.add('d-none');
        clubesContainer.classList.add('d-none');
        jugadorContainer.classList.add('d-none');

        const headerCategoria = document.getElementById('headerCategoria');
        const headerDivision = document.getElementById('headerDivision');
        if (selectedFilter === "categorias") {
            // Muestra los dropdown de Categoría, División y Rama
            categoriasContainer.classList.remove('d-none');
            divisionContainer.classList.remove('d-none');
            generoContainer.classList.remove('d-none');
            headerCategoria.classList.add('d-none');
            headerDivision.classList.add('d-none');
        }
        else if (selectedFilter === "equipo") {
            // Muestra los dropdown de Categoría, División, Rama y Clubes
            categoriasContainer.classList.remove('d-none');
            divisionContainer.classList.remove('d-none');
            generoContainer.classList.remove('d-none');
            clubesContainer.classList.remove('d-none');
            headerCategoria.classList.add('d-none');
            headerDivision.classList.add('d-none');
        }
        else if (selectedFilter === "jugador") {
            // Muestra el input de búsqueda
            jugadorContainer.classList.remove('d-none');
            headerCategoria.classList.remove('d-none');
            headerDivision.classList.remove('d-none');
        }

        
    });
});
// Supongamos que estos son tus clubes
// var clubes = ["Sedalo", "Cideco", "Muñiz"];
let clubes = [];
// const endpointEquipos = 'http://localhost:3000/equipo';
const endpointEquipos = 'https://api-goleadores.handball-metropolitano.com/equipo';
fetch(endpointEquipos)
        .then(response => response.json())
        .then(data => {
            // Adquiere el select de clubes
            var clubesDropdown = document.getElementById("clubesDropdown");

            // Limpia el dropdown
            clubesDropdown.innerHTML = "";

            var defaultOption = document.createElement("option");
            defaultOption.selected = true;
            defaultOption.textContent = "Elegir club...";
            clubesDropdown.appendChild(defaultOption);

            data.forEach(function(equipo) {
                clubes.push(equipo);
            });
            // Ordena los clubes alfabéticamente
            clubes.sort(function(a, b) {
                return a.nombre.localeCompare(b.nombre);
            });
            for (var i = 0; i < clubes.length; i++) {
                var option = document.createElement("option");
                option.value = clubes[i]._id;
                option.textContent = clubes[i].nombre;
                clubesDropdown.appendChild(option);
            }
            console.log(clubes)
        })
        .catch(error => {
            console.error('Error:', error);
        });

// Inicializar Select2 en el elemento select
$(document).ready(function() {
    var select2Element = $('#clubesDropdown').select2({
        placeholder: "Elegir club...",
        allowClear: true,
        width: '100%'
    });

    // Añadir la clase al elemento del contenedor de Select2
    // select2Element.data('select2').$container.addClass('form-control-personalized');
});


var categoriasDropdown = document.getElementById('categoriasDropdown');
var categorias = ['Mayores', 'Junior', 'Juveniles', 'Cadetes', 'Menores', 'Infantiles'];
categorias.forEach(function(categoria) {
    var option = document.createElement('option');
    option.textContent = categoria;
    categoriasDropdown.appendChild(option);
});

// Cargar opciones de divisiones
var divisionDropdown = document.getElementById('divisionDropdown');
var divisionesMayores = ['Liga de Honor Oro', 'Liga de Honor Plata', '1°', '2°', '3°'];
var divisionesMenores = [ 'A', 'B', 'C', 'D'];
divisionesMayores.forEach(function(division) {
    var option = document.createElement('option');
    option.textContent = division;
    divisionDropdown.appendChild(option);
});

// Evento para cambiar las divisiones
categoriasDropdown.addEventListener('change', function() {
    var categoria = this.value; // la categoría seleccionada
    divisionDropdown.innerHTML = '<option selected>Elegir división...</option>'; // limpiar las opciones actuales

    var divisiones = categoria === 'Mayores' ? divisionesMayores : divisionesMenores;

    divisiones.forEach(function(division) {
        var option = document.createElement('option');
        option.textContent = division;
        divisionDropdown.appendChild(option);
    });
});

// Cargar opciones de géneros
var generoDropdown = document.getElementById('generoDropdown');
var generos = ['Masculino', 'Femenino'];
generos.forEach(function(genero) {
    var option = document.createElement('option');
    option.textContent = genero;
    generoDropdown.appendChild(option);
});

document.getElementById('filterButton').addEventListener('click', function() {
    var generalFilter = document.getElementById('generalFilter').value;
    var endpoint = "";

    if (generalFilter === "categorias") {
        var categoria = document.getElementById('categoriasDropdown').value;
        var division = document.getElementById('divisionDropdown').value;
        var genero = document.getElementById('generoDropdown').value;

        if (categoria === 'Elegir categoría...' || division === 'Elegir división...' || genero === 'Elegir rama...') {
            document.getElementById('errorAlert').classList.remove('d-none');
            return; // esto termina la ejecución de la función si las condiciones no son satisfechas
        }
        document.getElementById('errorAlert').classList.add('d-none');
        // endpoint = 'http://localhost:3000/jugador/categoria/' + division + '/' + categoria + '/' + genero;
        endpoint = 'https://api-goleadores.handball-metropolitano.com/jugador/categoria/' + division + '/' + categoria + '/' + genero;

    } else if (generalFilter === "equipo") {
        var club = document.getElementById('clubesDropdown').value;
        var categoria = document.getElementById('categoriasDropdown').value;
        var division = document.getElementById('divisionDropdown').value;
        var genero = document.getElementById('generoDropdown').value;
        if (club === 'Elegir club...') {
            document.getElementById('errorAlert').classList.remove('d-none');
            return;
        }
        if (categoria === 'Elegir categoría...' || division === 'Elegir división...' || genero === 'Elegir rama...') {
            document.getElementById('errorAlert').classList.remove('d-none');
            return; // esto termina la ejecución de la función si las condiciones no son satisfechas
        }
        document.getElementById('errorAlert').classList.add('d-none');
        endpoint = 'https://api-goleadores.handball-metropolitano.com/jugador/equipo/' + club + '/' + division + '/' + categoria + '/' + genero;
        // endpoint = 'http://localhost:3000/jugador/equipo/' + club + '/' + division + '/' + categoria + '/' + genero;
        console.log(endpoint);

    } else if (generalFilter === "jugador") {
        var jugador = document.getElementById('jugadorSearch').value;

        if (!jugador) {
            document.getElementById('errorAlert').classList.remove('d-none');
            return;
        }
        document.getElementById('errorAlert').classList.add('d-none');
        endpoint = 'https://api-goleadores.handball-metropolitano.com/jugador/nombre/' + jugador;
        // endpoint = 'http://localhost:3000/jugador/nombre/' + jugador;
    }

    fetch(endpoint)
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data)
        var tableBody = document.getElementById('goleadoresBody');
        tableBody.innerHTML = '';

        // Comprobar si los datos están vacíos
        if (data.goleadores.length === 0) {
            // Agregar un mensaje amigable en la tabla
            var row = document.createElement('tr');
            var cell = document.createElement('td');

            cell.innerHTML = "No hay datos para el filtro seleccionado";
            // Especifique que esta celda debe abarcar todas las columnas
            cell.colSpan = 5; 

            row.appendChild(cell);
            tableBody.appendChild(row);
        } else {
            // Mostrar la marca de agua
            // var watermark = document.getElementById('watermark');
            
            const selectedFilter = document.getElementById("generalFilter").value;
            data.goleadores.forEach(function(goleador) {
                var row = document.createElement('tr');
                var nameCell = document.createElement('td');
                var goalsCell = document.createElement('td');
                var teamCell = document.createElement('td');
                if(selectedFilter === "jugador"){

                    const categoriaCell = document.createElement('td');
                    const divisionCell = document.createElement('td');
                    categoriaCell.innerHTML = goleador.categoria;
                    divisionCell.innerHTML = goleador.division;
                    row.appendChild(categoriaCell);
                    row.appendChild(divisionCell);
                    tableBody.classList.add('watermark');
                    tableBody.classList.remove('watermark-equipo');
                }else if(selectedFilter === "equipo"){
                    tableBody.classList.add('watermark-equipo');
                    tableBody.classList.remove('watermark');
                }else{
                    tableBody.classList.remove('watermark-equipo');
                    tableBody.classList.add('watermark');
                }
                nameCell.innerHTML = goleador.nombre;
                goalsCell.innerHTML = goleador.goles;
                teamCell.innerHTML = goleador.equipo ? goleador.equipo.nombre : 'N/A';

                row.appendChild(nameCell);
                row.appendChild(goalsCell);
                row.appendChild(teamCell);

                tableBody.appendChild(row);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// $(document).ready(function() {
//     $('#goleadoresTable').DataTable({
//         "pageLength": 10
//     });
// });
