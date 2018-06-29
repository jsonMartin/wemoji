import { combineReducers } from 'redux';

export default combineReducers({
  image: (state = null, action) => {
    // debugger;
    switch (action.type) {
      case 'CAMERA_BUTTON_PRESSED':
        return action.payload;
    }

    return state;
  },
});

