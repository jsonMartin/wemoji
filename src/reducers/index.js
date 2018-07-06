import { combineReducers } from 'redux';

const defaultState = {
  images: 'lala',
};

export default combineReducers({
  image: (state = 'lala', action) => {
    switch (action.type) {
      case 'CAMERA_BUTTON_PRESSED':
        console.log('Camera button pressed reducer fired');
        return action.payload;
      default:
        return state;
    }
  },
});

