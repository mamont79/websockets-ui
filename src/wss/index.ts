import WebSocket, { WebSocketServer } from 'ws';
import { httpServer } from 'src/http_server';
import { createId } from './utils/createId';
import { addNewPlayer, checkExistPlayer, getPlayerByName, playersData } from 'src/db';
import { notRegAnswer, regAnswer } from './answers/regAnswers';

type IConnectionWS = {
  websocket: WebSocket;
};
const connections: Array<IConnectionWS> = [];

const HTTP_PORT = 8181;
console.log(`Start static http server on the http://localhost:${HTTP_PORT}/ port`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: 3000 });
console.log("i'm here");
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
    console.log(actionType);
    if (actionType === 'reg') {
      const { name, password } = messageData.data;
      const checkName = checkExistPlayer(name);
      if (!checkName) {
        addNewPlayer(ws, name, password);
      }

      const player = getPlayerByName(name);
      if (password !== player?.password) {
        const messageOut = notRegAnswer(player?.name!, player?.index!);
        ws.send(JSON.stringify(messageData));
      } else {
        const messageOut = regAnswer(player?.name!, player?.index!);
        ws.send(JSON.stringify(messageData));
      }
    }
  });

  ws.on('close', () => {
    delete connections[id];
  });
});
