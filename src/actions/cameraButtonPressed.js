import fetchFaceData from '../helpers/fetchFaceData.js';

export default (image) => async dispatch => {
  dispatch({ type: 'CAMERA_BUTTON_PRESSED', payload: image});

  const faceData = await fetchFaceData(image);
  dispatch({ type: faceData instanceof Error ? 'FACE_DATA_ERROR' : 'FACE_DATA_FETCHED', payload: faceData });
};

