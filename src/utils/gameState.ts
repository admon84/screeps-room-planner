import { USER_ID } from './constants';

// `playerName` only feeds `username`, which the renderer's setBadgeUrls processor substitutes into
// BADGE_URL on every applyState -- so the badge follows the name with no cache to bust. The user's
// key and `_id` stay USER_ID: every placed object carries `user: USER_ID`, and renaming the id would
// orphan them all. Falls back to USER_ID because an empty username yields a badge URL that 404s.
export const createGameState = (objects: any[] = [], playerName = USER_ID) => ({
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
      username: playerName.trim() || USER_ID,
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
