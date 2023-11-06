//Creación de un WebSocket
const socket = new WebSocket ("ws://localhost:3000");
//Evento de apertura de la conexión
socket.addEventListener ("open", () => {
    console.log ("Esta conectado al servidor ws");
});

//Evento de recepción de mensajes
socket.addEventListener ("message", (event) => {//esto es un escuchador de eventos 
    const Data = JSON.parse(event.data);
    console.log ("Recive un mesaje de ws", Data);
    
    const PlayerContainer = document.getElementById ("players");
    /*const player = document.createElement("li");
    player.innerHTML = Data.Playername;
    PlayerContainer.appendChild (player);*/
    if (Data.tipo === 'dibujo') {
        if (Data.datos.clear) {
            clearCanvas();
        } else {
            ctx.strokeStyle = Data.datos.color;
            ctx.lineTo(Data.datos.x, Data.datos.y);
            ctx.stroke();
        }
    }
    if (Data.Playername) {
        const player = document.createElement("li");
        player.innerHTML = Data.Playername;
        PlayerContainer.appendChild(player);
    }

    if (Data.tipo === 'jugadores') {
        const PlayerContainer = document.getElementById("players");
        PlayerContainer.innerHTML = ''; // Limpiar la lista actual

        Data.jugadores.forEach((nombreJugador) => {
            const player = document.createElement("li");
            player.innerHTML = nombreJugador;
            PlayerContainer.appendChild(player);
        });
    }
    if (Data.tipo === 'cambiarColor') {
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.fillStyle = Data.color;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}
);

//Botón de unirse
const JoinButton = document.getElementById ("join-button");
JoinButton.addEventListener ("click", () => {
    console.log ("Esta funfionando el click");
    const PlayerName = document.getElementById ("player-name").value ;
    socket.send (JSON.stringify({"Playername": PlayerName}));

    // Añade esta línea para enviar el mensaje con el tipo 'nombreJugador'
    socket.send(JSON.stringify({ tipo: 'nombreJugador', Playername: PlayerName }));
});

//Agregar un lienzo al HTML 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


function cambiarDimensiones(ancho, alto) {
    canvas.width = ancho;
    canvas.height = alto;
}

// Llamar a la función para cambiar las dimensiones del lienzo
cambiarDimensiones(1600, 600);
/*canvas.width = window.innerWidth - 20;
canvas.height = 400;*/

ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';


const pencilButton = document.getElementById('pencilButton');
let drawing = false;

function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function draw(e) {
    if (!drawing) return;
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    const datosDibujo = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
        color: ctx.strokeStyle
    };
    enviarDibujo(datosDibujo);
}
function stopDrawing() {
    drawing = false;
    ctx.closePath();
}



const colorButton = document.getElementById('color-button');

colorButton.addEventListener('click', changeCanvasColor);

function changeCanvasColor() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.fillStyle = 'white'; // Cambia 'tu_color_preferido' al color que desees
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Envía el mensaje a todos los clientes para mantener sincronizado el color
    const mensaje = JSON.stringify({ tipo: 'cambiarColor', color: 'white' });
    socket.send(mensaje);
}





function enviarDibujo(datosDibujo) {
    console.log("Enviando dibujo:", datosDibujo); // Agrega este log
    const mensaje = JSON.stringify({ tipo: 'dibujo', datos: datosDibujo });
    socket.send(mensaje);
}
      


canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);





pencilButton.addEventListener('click', () => {
    ctx.strokeStyle = '#000000'; // Establece el color del trazo a negro
});

// Agrega un manejador de eventos al botón "jugar"
const jugarButton = document.getElementById("jugar-button");
jugarButton.addEventListener("click", () => {
    // Comienza el temporizador cuando se presiona el botón "jugar"
    const timerInterval = setInterval(updateTimer, 1000);
});


//Contador de tiempo

let timeRemaining = 60; // Inicializamos el tiempo en segundos

function updateTimer() {
    const timerElement = document.getElementById("time");

        if (timeRemaining > 0) {
            timeRemaining--;
            timerElement.textContent = timeRemaining;
        } else {
            timerElement.textContent = "Tiempo agotado";
            clearInterval(timerInterval);
        }
    }



