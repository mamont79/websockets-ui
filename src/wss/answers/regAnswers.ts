import { IRegDataOut } from '../types/players';

export const regAnswer = (userName: string, userIndex: number) => {
  const answer: IRegDataOut = {
    type: 'reg',
    data: {
      name: userName,
      index: userIndex,
      error: false,
      errorText: null,
    },
    id: 0,
  };
  return answer;
};

export const notRegAnswer = (userName: string, userIndex: number) => {
  const answer: IRegDataOut = {
    type: 'reg',
    data: {
      name: userName,
      index: userIndex,
      error: true,
      errorText: 'Login or password is incorrect',
    },
    id: 0,
  };
  return answer;
};
