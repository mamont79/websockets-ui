import { WebSocket } from 'ws';
import { IPlayer, IRoom, IGame } from './wss/types/players';
import { createId } from './wss/utils/createId';

export const playersData: Array<IPlayer> = [];
export const roomsData: Array<IRoom> = [];
const gamesData: Array<IGame> = [];

export const addNewPlayer = (socket: WebSocket, name: string, password: string) => {
  const userId = createId();

  const newPlayer: IPlayer = {
    name: name || '',
    websocket: socket,
    index: userId,
    password: password,
    wins: 0,
    gameId: null,
    roomId: null,
    isAuth: true,
  };
  playersData.push(newPlayer);

  // return newPlayer;
};

export const checkExistPlayer = (playersName: string) => {
  const isFound = playersData.some((element) => {
    if (element.name === playersName) return true;
    return false;
  });
  return isFound;
};

export const checkPassword = (userPassword: string) => {
  const isFound = playersData.some((element) => {
    if (element.password === userPassword) return true;
    return false;
  });
  return isFound;
};

export const getPlayerByName = (playerName: string) => {
  return playersData.find((player) => player.name === playerName);
};

export const getPlayerById = (playerId: number) => {
  return playersData.find((player) => player.index === playerId);
};

export const getUserByConnection = (socket: WebSocket) => {
  return playersData.find((player) => player.websocket === socket);
};

export const createRoom = (roomId: number, name: string, index: number) => {
  const newRoom: IRoom = {
    roomId: roomId,
    roomUsers: [
      {
        name: name,
        index: index,
      },
    ],
  };
  roomsData.push(newRoom);

  const answer = {
    type: 'update_room',
    data: JSON.stringify(newRoom),
    id: 0,
  };
  return JSON.stringify(answer);
};
