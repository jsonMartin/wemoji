import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const Canvas = styled.canvas`
  width: 100vw;
  height: 100vh;
  max-height: 720px;
  z-index: 3;
`;


const HiddenCanvas = styled.canvas`
  position: absolute;
  left: 0;
  top: 0;
  display: none;
  z-index: 2;
`;

const EMOJI_EMOTION_MAP = {
  anger: '😡',
  contempt: '🤨',
  disgust: '🤮',
  fear: '😱',
  happiness: '😁',
  neutral: '😑',
  sadness: '😥',
  surprise: '😮',
};

const isDebugMode = () => /debug=true/g.test(window.location.href);

class Photo extends React.Component {
  state = {}

  componentDidMount() {
    this.drawCanvas();
  }

  componentDidUpdate() {
    this.drawCanvas();
  }

  get canvasContext() {
    return this.canvas.getContext('2d');
  }

  get canvas() {
    return this.props.image.canvas ? this.canvasRef.current : this.hiddenCanvasRef.current;
  }

  drawCanvas() {
    const { image, faceData, faceDataStatus } = this.props;
    this.drawImageToCanvas(image);

    switch (faceDataStatus) {
      case 'SUCCESS':
        this.drawFaceData();
        break;
      case 'LOADING':
        this.drawText('Analyzing Faces...');
        break;
      case 'NO_FACES_DETECTED':
        this.drawText('No faces detected');
        break;
      case 'FACE_DATA_ERROR':
        this.drawText('Connection Problem');
        break;
      default:
        this.drawText('Unknown problem');
    }
  }

  async drawImageToCanvas() {
    const { image } = this.props;
    const canvas = this.canvasRef.current;
    const context = this.canvasContext;
    context.imageSmoothingEnabled = false; // Anti-Aliasing messes up image render drawing

    if (image.canvas) {
      canvas.width = image.canvas.width;
      canvas.height = image.canvas.height;
      canvas.style.zoom = `${window.innerHeight > 720 ? 2.02 - (720 / window.innerHeight) : 1}`;
      console.log('Drawing image on canvas');
      context.drawImage(image.canvas, 0, 0);
    } else { // Is a user uploaded image
      // canvas.width = 320;
      // canvas.height = 640;
      // canvas.width = '320px';
      // canvas.height = '640px';
      // debugger;
      console.log('Drawing uploaded photo on canvas');

      // const hiddenCanvas = this.hiddenCanvasRef.current;
      // const hiddenContext = hiddenCanvas.getContext('2d');
      // hiddenContext.imageSmoothingEnabled = false; // Anti-Aliasing messes up image render drawing
      const { img } = image;

        canvas.width = img.width;
        canvas.height = img.height;

      // const hRatio = img.width / window.innerWidth;
      // const vRatio = img.height / window.innerHeight;
      const hRatio = window.innerWidth / img.width;
      const vRatio = window.innerHeight / img.height;
      const ratio = Math.min(hRatio, vRatio);
      // debugger;

      // canvas.height = img.height;
      // canvas.width = img.width;
      // context.drawImage(img, 0, 0, img.width, img.height);

      // hiddenCanvas.width = img.width;
      // hiddenCanvas.height = img.height;

        debugger;

      // hiddenContext.drawImage(img, 0, 0);
      // context.drawImage(img, 0, 0);
      context.drawImage(img, 0, 0, img.width * ratio, img.height * ratio);
      // hiddenContext.drawImage(img, 0, 0, img.width, img.height);


      // debugger;
      // context.drawImage(context.getImageData(0, 0, context.canvas.width, context.canvas.height), 0, 0, img.width, img.height, 0, 0, img.width * hRatio, img.height * hRatio);
      // context.drawImage(hiddenCanvas, 0, 0, img.width, img.height, 0, 0, img.width * hRatio, img.height * hRatio);
        const currentCanvas = this.canvasRef.current;
        currentCanvas.width = img.width * ratio;
        currentCanvas.height = img.height * ratio;
        const currentContext = this.canvasRef.current.getContext('2d');
        // currentContext.drawImage(canvas, 0, 0, img.width, img.height, 0, 0, img.width * hRatio, img.height * hRatio);
        // currentContext.drawImage(context.canvas, 0, 0, img.width, img.height);
        currentContext.drawImage(context.canvas, 0, 0, context.canvas.width, context.canvas.height, 0, 0, img.width * ratio, img.height * ratio);
        // currentContext.drawImage(context.canvas, 0, 0);

//       setTimeout(() => {
//         debugger;
//         // canvas.width = img.width * hRatio;
//         // canvas.height = img.height * vRatio;
//         const hiddenCanvas = document.getElementById('hidden-canvas');
//         // canvas.width = img.width * hRatio;
//         // canvas.height = img.height * vRatio;
//         // context.drawImage(context.getImageData(0, 0, context.canvas.width, context.canvas.height), 0, 0, img.width, img.height, 0, 0, img.width * hRatio, img.height * hRatio);
//         context.drawImage(hiddenCanvas, 0, 0, img.width, img.height, 0, 0, img.width * hRatio, img.height * hRatio);
//         // context.drawImage(hiddenCanvas, 0, 0, img.width, img.height);
//       }, 1000);

    }
  }

  drawFaceData() {
    console.log('Drawing face data on canvas');
    const { faceData } = this.props;

    for (const face of faceData) {
      if (isDebugMode()) {
        this.drawFaceRectangleBoxes(face);
        window.requestAnimationFrame(() => this.drawFaceMidpoint(face));
      } else {
        this.drawEmoji(face);
      }
    }
  }

  drawText(text, style = {
    font: '25px Comic Sans MS',
    fillStyle: 'red',
    textAlign: 'center',
  }, x = this.canvas.width / 2, y = this.canvas.height / 2, maxWidth = null) {
    const context = this.canvasContext;

    context.font = style.font;
    context.fillStyle = style.fillStyle;
    context.textAlign = style.textAlign;
    context.fillText(text, x, y);
    // context.fillText(text, x, y, maxWidth);
  }

  drawEmoji({ faceRectangle, faceAttributes }) {
    const {
      top, left, width, height,
    } = faceRectangle;
    const emotionRanking = Object.entries(faceAttributes.emotion).sort((a, b) => a[1] < b[1]);
    console.log('Emotion rankings:', JSON.stringify(emotionRanking));
    const emotion = emotionRanking[0][0];
    // const [midX, midY] = [left + (width / 2), top + (height / 2)];
    // const [x, y] = [left, (top * 0.9) + height];
    const [x, y] = [left, top + height];

    const adjustedX = x * 0.75;
    const adjustedWidth = width * 1.25;

    const fontSize = adjustedWidth;
    const style = {
      font: `${fontSize}px Comic Sans MS`,
      fillStyle: 'yellow',
      textAlign: 'left',
    };


    console.log('fontSizer:', fontSize); // const [x, y] = [(faceRectangle.left + faceRectangle.width) / 2, (faceRectangle.top + faceRectangle.height) / 2];
    // const [x, y] = [left, top + fontSize];
    // const [x, y] = [left, top];


    this.drawText(EMOJI_EMOTION_MAP[emotion], style, x - ((adjustedWidth - width) / 2), y, adjustedWidth);
    // this.drawText(EMOJI_EMOTION_MAP[emotion], style, x, y, width);
  }

  drawFaceMidpoint({ faceRectangle }) {
    const context = this.canvasContext;
    const {
      top, left, width, height,
    } = faceRectangle;

    const [midX, midY] = [left + (width / 2), top + (height / 2)];
    console.log(`Top: ${top}, left: ${left}, width: ${width}, height: ${height}`);
    console.log(`midX: ${midX}, midY: ${midY}`);
    context.lineWidth = '10';
    context.strokeStyle = 'red';
    context.arc(midX, midY, 10, 0, 2 * Math.PI);
    context.stroke();
  }

  drawFaceRectangleBoxes({ faceRectangle }) {
    const context = this.canvasContext;
    const {
      top, left, width, height,
    } = faceRectangle;
    context.lineWidth = '6';
    context.strokeStyle = 'yellow';
    context.rect(left, top, width, height);
    context.stroke();
  }

  canvasRef = React.createRef()
  hiddenCanvasRef = React.createRef()

  render() {
    const { faceData } = this.props;

    return (
      <div>
        <Canvas innerRef={this.canvasRef} />
        {faceData instanceof Error && <section>{faceData.toString()}</section>}
        {/* <HiddenCanvas id="hidden-canvas" innerRef={this.hiddenCanvasRef} style={{ width: '100vw', height: '100vh' }} /> */}
        <canvas id="hidden-canvas" ref={this.hiddenCanvasRef} style={{ width: '100vw', height: '100vh', display: 'none' }} />
      </div>
    );
  }

  // TODO: Allow to save image
}

export default connect(({ image, faceData, faceDataStatus }) => ({ image, faceData, faceDataStatus }), null)(Photo);
