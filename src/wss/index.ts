import WebSocket, { WebSocketServer } from 'ws';
import { httpServer } from 'src/http_server';
import { createId } from './utils/createId';
import {
  addNewPlayer,
  checkExistPlayer,
  createRoom,
  getPlayerByName,
  getUserByConnection,
  playersData,
  roomsInfoMessage,
  updateWinners,
} from 'src/db';
import { notRegAnswer, regAnswer } from './answers/regAnswers';

type IConnectionWS = {
  websocket: WebSocket;
};
const connections: Array<IConnectionWS> = [];
const avaliableRooms: Array<number> = [];

const HTTP_PORT = 8181;
console.log(`Start static http server on the http://localhost:${HTTP_PORT}/ port`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  const id = createId();
  connections[id] = { websocket: ws };

  console.log(`Connections with id #${id} is established`);

  ws.on('error', () => {
    console.log('error');
  });

  ws.on('message', (data) => {
    let messageData = JSON.parse(data.toString('utf8'));
    let actionType = messageData.type;
    let playerId = id;
    let playerName: string = '';

    console.log(messageData);

    if (actionType === 'reg') {
      const currentPlayerData = JSON.parse(messageData.data);
      const checkName = checkExistPlayer(currentPlayerData.name);
      console.log(currentPlayerData);
      playerName = currentPlayerData.name;

      if (!checkName) {
        addNewPlayer(ws, currentPlayerData.name, currentPlayerData.password);
      }

      const player = getPlayerByName(currentPlayerData.name);
      if (currentPlayerData.password !== player!.password) {
        const messageOut = notRegAnswer(player!.name, id);
        ws.send(messageOut);
      } else {
        const messageOut = regAnswer(player!.name, id);
        ws.send(messageOut);

        console.log(messageOut);
      }
    } else if (actionType === 'create_room') {
      const roomId = createId();
      avaliableRooms.push(roomId);

      const playerData = getUserByConnection(connections[id].websocket);
      createRoom(roomId, playerData!.name, playerData!.index);
      const messageOut = roomsInfoMessage();
      console.log(messageOut);
      ws.send(messageOut);
    } else if (actionType === 'add_user_to_room') {
      ws.send('Hello');
    }

    for (let id in connections) {
      const roomsInfo = roomsInfoMessage();
      const winInfo = updateWinners();
      connections[id].websocket.send(roomsInfo);
      connections[id].websocket.send(winInfo);
    }
  });

  ws.on('close', () => {
    delete connections[id];
  });
});
