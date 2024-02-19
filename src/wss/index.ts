import WebSocket, { WebSocketServer } from 'ws';
import { httpServer } from 'src/http_server';
import { createId } from './utils/createId';

type IPlayerWS = {
  websocket: WebSocket;
  name?: string;
  opponentId?: string;
};
const players: Array<IPlayerWS> = [];

const wss = new WebSocketServer({ port: 8181 });

wss.on('connection', (ws) => {
  const id = createId();
  players[id] = { websocket: ws };

  ws.on('error', () => {
    console.log('error');
  });

  ws.on('message', (data) => {
    console.log(data);
  });

  ws.on('close', () => {
    delete players[id];
  });
});
