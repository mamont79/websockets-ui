import WebSocket from 'ws';

export type IShip = {
  points: {
    alive: string;
    dead: Array<string>;
    around: Array<string>;
  };
  alive: boolean;
};

export type IPlayer = {
  connection: WebSocket;
  id: number;
  name: string;
  password: string;
  isAuth: boolean;

  wins: number;
  gameId: number | null;
  roomId: number | null;
};

export type IRoom = {
  id: number;
  users: Array<IPlayer>;
};

export type IGame = {
  id: number;
  players: Array<IPlayer>;
  fields: Map<number, Array<IShip>>;
  currentPlayerIndex: number;
};
