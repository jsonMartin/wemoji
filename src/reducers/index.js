import { combineReducers } from 'redux';

export default combineReducers({
  image: (state = null, action) => {
    switch (action.type) {
      case 'CAMERA_BUTTON_PRESSED':
        console.log('Camera button pressed reducer fired');
        return action.payload;
      default:
        return state;
    }
  },
});

