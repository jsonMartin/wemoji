export default (processedImage) => {
  console.log('Image processed');
  console.log('Here\'s the payload:', processedImage);
  return {
    type: 'IMAGE_PROCESSED',
    payload: processedImage,
  };
};

