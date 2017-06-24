import { createStore } from 'redux';

export const CREATE_ROOM = 'CREATE_ROOM';
export const JOIN_ROOM = 'JOIN_ROOM';

const initialState = {
  room: null,
  code: null
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
    case `${CREATE_ROOM}`:
      state.code = action.code;
      state.room = new Room(action.code);
      return state;
    case `${JOIN_ROOM}`:
      state.code = action.code;
      state.room = new Room(action.code);
      return state;
    default:
      return state;
  }
});
