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
  websocket?: WebSocket;
  index: number;
  name: string;
  password?: string;
  isAuth?: boolean;

  wins?: number | null;
  gameId?: number | null;
  roomId?: number | null;
};

export type IRoom = {
  roomId: number;
  roomUsers: Array<IPlayer>;
};

export type IGame = {
  id: number;
  players: Array<IPlayer>;
  fields: Map<number, Array<IShip>>;
  currentPlayerIndex: number;
};

export type IRegDataIn = {
  type: string;
  data: {
    name: string;
    password: string;
  };
  id: number;
};

export type IRegDataOut = {
  type: string;
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string | null;
  };
  id: number;
};
