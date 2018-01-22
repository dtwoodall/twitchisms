import { combineReducers } from 'redux';
import twitchisms, * as fromTwitchisms from './twitchisms';
import mouse, * as fromMouse from './mouse';

// Root reducer
export default combineReducers({
  twitchisms,
  mouse
});

// Root selectors
export const getTwitchisms = state => fromTwitchisms.getTwitchisms(state.twitchisms);
export const getLastMousePosition = state => fromMouse.getLastMousePosition(state.mouse);