import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import param from 'jquery-param';

import imageProcessed from '../actions/imageProcessed.js';

const Canvas = styled.canvas`
width: 100vw;
height: 80vh;
  /* width: 500px; */
  /* height: 500px; */
  /* width: 100%; */
  /* height: 100%; */
`;

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

const processImage = async image => {
  const subscriptionKey = '44af041211b54d92adf2b63550d0535f';
  const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

  // Request parameters.
  const params = {
    returnFaceId: 'true',
    returnFaceLandmarks: 'true',
    returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
  };

  const URL = `${uriBase}?${param(params)}`;

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
};

class Photo extends React.Component {
  state = {}

  async componentDidMount() {
    const { image, imageProcessed } = this.props;
    const faceData = await processImage(image);
    imageProcessed(faceData);
    this.drawImageToCanvas(image);
  }

  componentDidUpdate() {
    const { image } = this.props;
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas() {
    const { image, faceData } = this.props;
    // const { image } = this.props;
    const canvas = this.canvasRef.current;
    canvas.width = image.canvas.width;
    canvas.height = image.canvas.height;
    // debugger;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false; // Anti-Aliasing messes up image render drawing
    console.log('Drawing image on canvas');
    context.drawImage(image.canvas, 0.5, 0.5, canvas.width, canvas.height);
    // context.drawImage(image.canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    // context.drawImage(image.canvas, 0, 0);
    if (faceData) {
      for (const face of faceData) {
        this.drawFaceRectangleBoxes(face);
      }
    }
  }

  drawFaceRectangleBoxes({ faceRectangle }) {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineWidth = '6';
    context.strokeStyle = 'red';
    context.rect(faceRectangle.left, faceRectangle.top, faceRectangle.width, faceRectangle.height);
    context.stroke();
  }

  canvasRef = React.createRef()

  render() {
    const { image: { base64, canvas } } = this.props;
    const { processedImage } = this.state;

    return <Canvas innerRef={this.canvasRef} />;

    // if (processedImage) return <h1>LALA</h1>;

    // return <img src={image} id="photo" height="100%" alt="The screen capture will appear in this box." />;
  }
}

function mapStateToProps(state) {
  const { image, faceData } = state;

  return { image, faceData };
}
export default connect(mapStateToProps, dispatch => bindActionCreators({ imageProcessed }, dispatch))(Photo);
