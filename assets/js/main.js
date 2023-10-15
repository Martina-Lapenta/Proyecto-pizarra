const socket = new WebSocket ("ws://localhost:3000");
socket.addEventListener ("open", () => {
    console.log ("Esta conectado al ws");
});

socket.addEventListener ("message", (event) => {
    const Data = JSON.parse(event.data);
    console.log ("Recive un mesaje de ws", Data);
    const PlayerContainer = document.getElementById ("players");
    const player = document.createElement("li");
    player.innerHTML = Data.Playername;
    PlayerContainer.appendChild (player);
}
);

const JoinButton = document.getElementById ("join-button");
JoinButton.addEventListener ("click", () => {
    console.log ("Esta funfionando el click");
    const PlayerName = document.getElementById ("player-name").value ;
    socket.send (JSON.stringify({"Playername": PlayerName}));
});