export default (image) => {
  console.log('CameraButtonPressed action.');
  console.log('Here\'s the payload:', image.toString().slice(0, 100));
  return {
    type: 'CAMERA_BUTTON_PRESSED',
    payload: image,
  };
};

