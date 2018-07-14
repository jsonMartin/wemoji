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

export default async (image) => {
  // Request parameters.
  const params = {
    returnFaceId: 'true',
    returnFaceLandmarks: 'true',
    returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
  };

  const URL = `${URI_BASE}?${param(params)}`;

  let result;

  try {
    result = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      },
      body: makeblob(image.base64),
    });

    console.log('RESULT!!!', result);
    // if (result.status !== 200) throw result;
    const faceData = await result.json();
    if (faceData.error) throw faceData.error.message;
    console.log('json', faceData);
    return faceData;
  } catch (errorMsg) {
    console.error('Error retrieving Face API Data:', errorMsg);
    console.error('Response', result);
    return new Error(errorMsg);
    // const error = new Error('Error retrieving Face API Data', errorMsg);
    // console.error(error);
    // return error;
  }
};

