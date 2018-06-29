export default (image) => {
  console.log('CameraButtonPressed action');
  return {
    type: 'CAMERA_BUTTON_PRESSED',
    payload: image,
  };
};

