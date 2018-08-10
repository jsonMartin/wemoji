import { combineReducers } from 'redux';

export default combineReducers({
  image: (state = null, action) => { // Change to capturedImage
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
  // // TODO: Remove mode?
  // mode: (state = 'camera', action) => { // Modes: camera, processImage, displayImage, photoRoll
  //   switch (action.type) {
  //     case 'CAMERA_BUTTON_PRESSED':
  //       console.log('Switching mode to processImage');
  //       return 'processImage';
  //     case 'IMAGE_PROCESSED':
  //       return 'displayProcessedImage';
  //     default:
  //       return state;
  //   }
  // },
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
});

