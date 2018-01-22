import * as twitchAPI from '../utilities/twitchAPI';
//import {schema} from 'normalizr';

// Twitchism reducer
export default (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_TWITCHISMS':
    case 'UPDATE_TWITCHISMS':
      return {
        ...state,
        ...action.twitchisms
      };
    case 'MOVE_TWITCHISMS':
      let twitchisms = {};
      for (let word in state) {
        let twitchism = state[word];
        twitchisms[word] = {
          ...twitchism,
          pos: {
            x: twitchism.pos.x - (action.delta.right * (2/twitchism.weight)),
            y: twitchism.pos.y - (action.delta.down * (2/twitchism.weight)),
          }
        }
      }
      return twitchisms;
    default:
      return state;
  }
};


// Task schema
/*export const taskSchema = new schema.Entity('tasks', { 
  category: categorySchema
});

taskSchema.define({parent: taskSchema, subtasks: [taskSchema]});*/


// Stream selectors
export const getTwitchisms = state => {
    return Object.values(state);
};


// Stream action creators
export const moveTwitchisms = (delta) => ({
  type: 'MOVE_TWITCHISMS',
  delta
});

export const fetchTwitchisms = () => dispatch => {

  dispatch({type: 'FETCH_TWITCHISMS'});

  twitchAPI.getTwitchisms(10, 100).then(twitchisms => {
    dispatch({
      type: 'RECEIVE_TWITCHISMS',
      twitchisms
    });
  }).catch((err) => console.log(err));

}