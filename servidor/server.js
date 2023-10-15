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

//estructura de websocket
wss.on ("connection",(ws)=>{
    console.log ("Se conecto el ws con exito");
    ws.on ("message", (message) => {
        const data = JSON.parse(message);
        console.log ("Mensaje recivido del front", data);
        ws.send (JSON.stringify (data));
    });
    ws.on ("close", (event) => {
        console.log ("Se desconecto ", event);
    });
});