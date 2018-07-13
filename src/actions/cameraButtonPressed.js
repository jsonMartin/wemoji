import param from 'jquery-param';

const SUBSCRIPTION_KEY = 'e6190b9594d74a4c98a89a415ee64b72';
const URI_BASE = 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect';

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

const fetchFaceData = async (image) => {
  // Request parameters.
  const params = {
    returnFaceId: 'true',
    returnFaceLandmarks: 'true',
    returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
  };

  const URL = `${URI_BASE}?${param(params)}`;

  try {
    const result = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      },
      body: makeblob(image.base64),
    });

    console.log('RESULT!!!', result);
    const faceData = await result.json();
    console.log('json', faceData);
    return faceData;
  } catch (error) {
    console.error('Error retrieving Face API data', error);
  }
};

export default (image) => async dispatch => {
  console.log('Dispatching CAMERA_BUTTON_PRESSED action.');
  console.log('Here\'s the payload:', image.toString().slice(0, 100));

  dispatch({
    type: 'CAMERA_BUTTON_PRESSED',
    payload: image,
  });

  const faceData = await fetchFaceData(image);
  dispatch({ type: 'FACE_DATA_FETCHED', payload: faceData });
};

