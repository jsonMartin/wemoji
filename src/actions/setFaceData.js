export default (faceData) => {
  console.log('Image processed');
  console.log('Here\'s the payload:', faceData);
  return {
    type: 'FACE_DATA_FETCHED',
    payload: faceData,
  };
};

