import WebSocket, { WebSocketServer } from 'ws';
import { httpServer } from 'src/http_server';
import { createId } from './utils/createId';

type IPlayerWS = {
  websocket: WebSocket;
  name?: string;
  opponentId?: string;
};
const players: Array<IPlayerWS> = [];

const HTTP_PORT = 8181;
console.log(`Start static http server on the http://localhost:${HTTP_PORT}/ port`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 3000 });
console.log("i'm here");
wss.on('connection', (ws) => {
  const id = createId();
  players[id] = { websocket: ws };

  console.log(`Connections with id #${id} is established`);

  ws.on('error', () => {
    console.log('error');
  });

  ws.on('message', (data) => {
    let usersData = JSON.parse(data.toString('utf8'));
    let actionType = usersData.type;
    console.log(actionType);
    console.log(usersData);
    if (actionType === 'reg') {
      ws.send(data.toString('utf8'));
    }
  });

  ws.on('close', () => {
    delete players[id];
  });
});
