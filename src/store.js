import { createStore } from 'redux';

export const CREATE_ROOM = 'CREATE_ROOM';
export const JOIN_ROOM = 'JOIN_ROOM';
export const SET_NEW_WORD = 'SET_NEW_WORD';
export const SET_SOCKET = 'SET_SOCKET';
export const DRAW_POINTS = 'DRAW_POINTS';

const initialState = {
  room: null,
  code: null,
  sketchy: false,
  word: null,
  socket: null
};

class Room {

  constructor(code) {
    this.state = {
      code
    }
  }
}

export const store = createStore((state = initialState, action) => {
  console.log(action.type)
  switch(action.type) {
    case `${SET_SOCKET}`:
      state.socket = action.socket;
      return state;
    case `${CREATE_ROOM}`:
      state.code = action.code;
      state.room = new Room(action.code);
      state.sketchy = action.sketchy;
      return state;
    case `${JOIN_ROOM}`:
      state.code = action.code;
      state.room = new Room(action.code);
      state.sketchy = action.sketchy;
      return state;
    case `${SET_NEW_WORD}`:
      state.word = action.word;
      return state;
    default:
      return state;
  }
});
