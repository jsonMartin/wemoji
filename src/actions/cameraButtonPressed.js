export default (image) => {
  console.log('CameraButtonPressed action.');
  console.log('Here\'s the payload:', image);
  return {
    type: 'CAMERA_BUTTON_PRESSED',
    payload: image,
  };
};

