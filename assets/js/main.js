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
const clearButton = document.getElementById('clear-button');
const pencilButton = document.getElementById('pencilButton');

let drawing = false;

canvas.width = window.innerWidth - 40;
canvas.height = 400;

ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';



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

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enviarDibujo({ clear: true });
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}


function enviarDibujo(datosDibujo) {
    const mensaje = JSON.stringify({ tipo: 'dibujo', datos: datosDibujo });
    socket.send(mensaje);
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

clearButton.addEventListener('click', clearCanvas);



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



