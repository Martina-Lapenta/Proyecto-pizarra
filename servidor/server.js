const express = require ("express");
const http = require ("http");
const WebSocket = require("ws");


const app = express ();
const server = http.createServer (app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

app.use(express.static("../"));

server.listen (PORT,()=> {
    console.log("Servidor escuchando en el puerto 3000");
});

const jugadores = [];

// ...

wss.on("connection", (ws) => {
    console.log("Se conectó el ws con éxito");

    ws.on("message", (message) => {
        const data = JSON.parse(message);
        console.log("Mensaje recibido del front", data);
        ws.send(JSON.stringify(data));

        if (data.tipo === 'nombreJugador') {
            jugadores.push(data.Playername);
            // Envía la lista actualizada de jugadores a todos los clientes
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ tipo: 'jugadores', jugadores }));
                }
            });
        }
        
        if (data.tipo === 'dibujo') {
            // Reenvía el mensaje a todos los clientes conectados
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    ws.on("close", (event) => {
        console.log("Se desconectó ", event);
    });
});

// ...


//estructura de websocket
/*wss.on ("connection",(ws)=>{
    console.log ("Se conecto el ws con exito");
    ws.on ("message", (message) => {
        const data = JSON.parse(message);
        console.log ("Mensaje recivido del front", data);
        ws.send (JSON.stringify (data));
    });
    ws.on ("close", (event) => {
        console.log ("Se desconecto ", event);
    });

});*/