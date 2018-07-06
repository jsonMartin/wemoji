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
  showModal: (state = false, action) => {
    switch (action.type) {
      case 'DISMISS_MODAL':
        console.log('DISSMISS_MODAL RECEIVED!!!!!!!');
        return false;
      case 'CAMERA_BUTTON_PRESSED':
        console.log('Show modal reducer fired');
        return true;
      default:
        return state;
    }
  },
});

