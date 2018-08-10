import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const Canvas = styled.canvas`
  width: 100vw;
  height: 100vh;
  max-height: 720px;
  zoom: ${window.innerHeight > 720 ? 2.02 - (720 / window.innerHeight) : 1};
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
    return this.canvasRef.current;
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


  drawImageToCanvas() {
    const { image } = this.props;
    const canvas = this.canvasRef.current;
    canvas.width = image.canvas.width;
    canvas.height = image.canvas.height;
    const context = this.canvasContext;
    context.imageSmoothingEnabled = false; // Anti-Aliasing messes up image render drawing
    console.log('Drawing image on canvas');
    context.drawImage(image.canvas, 0, 0);
  }

  drawFaceData() {
    console.log('Drawing face data on canvas');
    const { faceData } = this.props;

    for (const face of faceData) {
      this.drawEmoji(face);

      if (isDebugMode()) {
        this.drawFaceRectangleBoxes(face);
        window.requestAnimationFrame(() => this.drawFaceMidpoint(face));
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

  render() {
    const { faceData } = this.props;

    return (
      <div>
        <Canvas innerRef={this.canvasRef} />
        {faceData instanceof Error && <section>{faceData.toString()}</section>}
      </div>
    );
  }

  // TODO: Allow to save image
}

export default connect(({ image, faceData, faceDataStatus }) => ({ image, faceData, faceDataStatus }), null)(Photo);
