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
  mode: (state = 'camera', action) => { // Modes: camera, processImage, displayImage, photoRoll
    switch (action.type) {
      case 'CAMERA_BUTTON_PRESSED':
        console.log('Switching mode to processImage');
        return 'processImage';
      case 'IMAGE_PROCESSED':
        return 'displayProcessedImage';
      default:
        return state;
    }
  },
  faceData: (state = null, action) => {
    switch (action.type) {
      case 'IMAGE_PROCESSED':
        console.log('Face data received', action);
        return action.payload;
      default:
        return state;
    }
  },
  // processedImage: (state = null, action) => {
  //   switch (action.type) {
  //     case 'CAMERA_BUTTON_PRESSED':
  //       processImage(action.payload);
  //       return 'asdf';
  //     default:
  //       return state;
  //   }
  // },
});

