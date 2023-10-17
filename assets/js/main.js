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
    const player = document.createElement("li");
    player.innerHTML = Data.Playername;
    PlayerContainer.appendChild (player);
}
);

//Botón de unirse
const JoinButton = document.getElementById ("join-button");
JoinButton.addEventListener ("click", () => {
    console.log ("Esta funfionando el click");
    const PlayerName = document.getElementById ("player-name").value ;
    socket.send (JSON.stringify({"Playername": PlayerName}));
});

//Agregar un lienzo al HTML 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear-button');
const colorPicker = document.getElementById('color-picker');

let drawing = false;

canvas.width = window.innerWidth - 40;
canvas.height = 400;

ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = colorPicker.value;


function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function draw(e) {
    if (!drawing) return;
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

clearButton.addEventListener('click', clearCanvas);
colorPicker.addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
});

/*function enviarDibujo(datosDibujo) {
    const mensaje = JSON.stringify({ tipo: 'dibujo', datos: datosDibujo });
    ws.send(mensaje);
}*/


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



