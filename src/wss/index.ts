import WebSocket, { WebSocketServer } from 'ws';
import { httpServer } from 'src/http_server';
import { createId } from './utils/createId';
import {
  addNewPlayer,
  addShipps,
  addUserToRoom,
  checkExistPlayer,
  createGame,
  createRoom,
  findGameByID,
  findRoomByRoomID,
  getPlayerById,
  getPlayerByName,
  getUserByConnection,
  roomsInfoMessage,
  updateWinners,
} from 'src/db';
import { notRegAnswer, regAnswer } from './answers/regAnswers';

type IConnectionWS = {
  websocket: WebSocket;
};
const connections: Array<IConnectionWS> = [];

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
      const playerData = getUserByConnection(connections[id].websocket);
      createRoom(roomId, playerData!.name, playerData!.index);
      const messageOut = roomsInfoMessage();
      console.log(messageOut);
      ws.send(messageOut);
    } else if (actionType === 'add_user_to_room') {
      const messageIn = JSON.parse(messageData.data);
      const playerData = getUserByConnection(connections[id].websocket);
      addUserToRoom(messageIn.indexRoom, playerData!.name, playerData!.index);

      const roomInfo = findRoomByRoomID(messageIn.indexRoom)!.roomUsers;

      if (roomInfo.length === 2) {
        roomInfo.map((player) => {
          const websocket = getPlayerById(player.index)?.websocket;
          const messageOut = createGame(player.index);

          websocket?.send(messageOut);
        });
      }
    } else if (actionType === 'add_ships') {
      const messageIn = JSON.parse(messageData.data);
      const gameData = findGameByID(messageIn.gameId)!;
      addShipps(messageIn.gameId, messageIn.indexPlayer, JSON.stringify(messageIn.ships));

      if (gameData.fields?.length === 2) {
        console.log('messageOut');
      }
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
