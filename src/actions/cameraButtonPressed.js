import fetchFaceData from './helpers/fetchFaceData.js';

export default (image) => async dispatch => {
  console.log('Dispatching CAMERA_BUTTON_PRESSED action.');
  console.log('Here\'s the payload:', image.toString().slice(0, 100));

  dispatch({
    type: 'CAMERA_BUTTON_PRESSED',
    payload: image,
  });

  const faceData = await fetchFaceData(image);
  dispatch({ type: faceData instanceof Error ? 'FACE_DATA_ERROR' : 'FACE_DATA_FETCHED', payload: faceData });
};

