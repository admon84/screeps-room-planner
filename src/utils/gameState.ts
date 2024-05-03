import { USER_ID } from './constants';

export const createGameState = (objects: any[] = []) => ({
  objects,
  users: {
    '0': {
      username: 'Player 1',
    },
    '1': {
      username: 'Player 2',
    },
    '2': {
      username: 'Invader',
    },
    '3': {
      username: 'Source Keeper',
    },
    [USER_ID]: {
      ok: 1,
      _id: USER_ID,
      email: '',
      username: USER_ID,
      cpu: 100,
      badge: {
        type: 0,
        color1: '#272727',
        color2: '#272727',
        color3: '#272727',
        param: -9,
        flip: true,
      },
      password: true,
      lastRespawnDate: 1489085471747,
      gcl: 50000000,
      credits: 3000,
      subscription: false,
      money: 0,
      subscriptionTokens: 4,
    },
  },
  info: {},
  gameTime: 1,
  flags: [],
  visual: '',
});
