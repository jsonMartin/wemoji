import param from 'jquery-param';

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

export default async image => {
  const subscriptionKey = '44af041211b54d92adf2b63550d0535f';
  const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

  // Request parameters.
  const params = {
    returnFaceId: 'true',
    returnFaceLandmarks: 'true',
    returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
  };

  const URL = `${uriBase}?${param(params)}`;

  try {
    const result = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
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
