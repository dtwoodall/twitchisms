// Mouse reducer
export default (state = {}, action) => {
  switch (action.type) {
    case 'MOVE_MOUSE':
      return {
        ...state,
        lastX: action.pos.x,
        lastY: action.pos.y,
      }
    default:
      return state;
  }
};

// Mouse selectors
export const getLastMousePosition = state => {
  return {
    x: state.lastX,
    y: state.lastY,
  }
};

// Mouse action creators
export const moveMouse = (newPos) => ({
  type: 'MOVE_MOUSE',
  pos: newPos
});