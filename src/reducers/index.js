import { combineReducers } from 'redux';
import param from 'jquery-param';

const makeblob = (dataURL) => {
  const BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    const parts = dataURL.split(',');
    const contentType = parts[0].split(':')[1];
    const raw = decodeURIComponent(parts[1]);
    return new Blob([raw], { type: contentType });
  }
  const parts = dataURL.split(BASE64_MARKER);
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;

  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

const processImage = async image => {
  const subscriptionKey = '44af041211b54d92adf2b63550d0535f';
  const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

  // Request parameters.
  const params = {
    returnFaceId: 'true',
    returnFaceLandmarks: 'true',
    returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
  };

  const URL = `${uriBase}?${param(params)}`;

  const result = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
    body: makeblob(image),
    // body: JSON.stringify(image),
  });

  console.log('RESULT!!!', result);
  const json = await result.json();
  console.log('json', json);
};

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
  processedImage: (state = null, action) => {
    switch (action.type) {
      case 'CAMERA_BUTTON_PRESSED':
        debugger;
        processImage(action.payload);
        return 'asdf';
      default:
        return state;
    }
  },
});

