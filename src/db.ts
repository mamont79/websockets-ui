import { WebSocket } from 'ws';
import { IPlayer, IRoom, IGame } from './wss/types/players';
import { createId } from './wss/utils/createId';

const playersData: Array<IPlayer> = [];
const roomsData: Array<IRoom> = [];
const gamesData: Array<IGame> = [];

export const addNewPlayer = (socket: WebSocket, name: string, password: string) => {
  const userId = createId();

  const newPlayer: IPlayer = {
    name: name,
    connection: socket,
    id: userId,
    password: password,
    wins: 0,
    gameId: null,
    roomId: null,
    isAuth: true,
  };
  playersData.push(newPlayer);

  return newPlayer;
};

export const checkExistPlayer = (playersName: string) => {
  const isFound = playersData.some((element) => {
    if (element.name === playersName) return true;
    return false;
  });
};

export const checkPassword = (userPassword: string) => {
  const isFound = playersData.some((element) => {
    if (element.password === userPassword) return true;
    return false;
  });
};

export const getPlayerByName = (playerName: string) => {
  return playersData.find((player) => player.name === playerName);
};

export const getPlayerById = (playerId: number) => {
  return playersData.find((player) => player.id === playerId);
};

const getUserByConnection = (socket: WebSocket) => {
  return playersData.find((player) => player.connection === socket);
};
