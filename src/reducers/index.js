import { combineReducers } from 'redux';

export default combineReducers({
  image: (state = null, action) => {
    switch (action.type) {
      case 'CAMERA_BUTTON_PRESSED':
        return action.payload;
    }

    return state;
  },
});

