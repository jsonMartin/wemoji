import { combineReducers } from 'redux';

export default combineReducers({
  image: (state = null, action) => { // Change to capturedImage
    switch (action.type) {
      case 'CAMERA_BUTTON_PRESSED':
        return action.payload;
      default:
        return state;
    }
  },
  showModal: (state = false, action) => {
    switch (action.type) {
      case 'DISMISS_MODAL':
        return false;
      case 'CAMERA_BUTTON_PRESSED':
        return true;
      default:
        return state;
    }
  },
  faceData: (state = null, action) => {
    switch (action.type) {
      case 'FACE_DATA_FETCHED':
        return action.payload.length > 0 ? action.payload : 'NO_FACES_DETECTED';
      default:
        return state;
    }
  },
  faceDataStatus: (state = null, action) => {
    switch (action.type) {
      case 'CAMERA_BUTTON_PRESSED':
        return 'LOADING';
      case 'FACE_DATA_FETCHED':
        return action.payload.length > 0 ? 'SUCCESS' : 'NO_FACES_DETECTED';
      case 'FACE_DATA_ERROR':
        return action.payload;
      default:
        return state;
    }
  },
  videoOffset: (state = null, action) => {
    switch (action.type) {
      case 'SET_MARGIN_LEFT':
        return action.payload;
      default:
        return state;
    }
  }
});

