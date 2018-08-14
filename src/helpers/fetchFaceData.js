import param from 'jquery-param';

const SUBSCRIPTION_KEY = 'e29dde98533040dabe35258562bbb030'; // This is a Free API key from Microsoft's Face API. It only lasts for 30 days, so replace this after it expires with a new key.
const URI_BASE = 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect'; // Microsoft Face API endpoint to use, taken from the Azure portal

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

export default async (image) => {
  const params = { // Request parameters
    returnFaceId: 'true',
    returnFaceLandmarks: 'true',
    returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
  };

  const URL = `${URI_BASE}?${param(params)}`;

  let result;

  try {
    // // To implement delay in loading image for testing purposes, uncomment the below lines
    // const DELAY = 500; // in ms
    // DELAY && await new Promise(resolve => setTimeout(resolve, DELAY));

    result = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      },
      body: makeblob(image.base64),
    });

    const faceData = await result.json();
    if (faceData.error) throw faceData.error.message;
    else return faceData;
  } catch (errorMsg) {
    console.error('Error retrieving Face API Data:', errorMsg);
    console.error('Response', result);
    return new Error(errorMsg);
  }
};
