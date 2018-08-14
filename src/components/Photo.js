import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const PhotoWrapper = styled.div`
    background-color: brown;
    height: 100vh;
`;

const Canvas = styled.canvas`
  max-height: 720px;
  z-index: 3;
  max-width: none;

    &.uploaded {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    max-width: 100%;
  }
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
    // return this.props.image.canvas ? this.canvasRef.current : this.hiddenCanvasRef.current;
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

  async drawImageToCanvas() {
    const { image, videoOffset } = this.props;
    const canvas = this.canvasRef.current;
    const context = this.canvasContext;
    context.imageSmoothingEnabled = false; // Anti-Aliasing messes up image render drawing

    if (image.canvas) { // This is a photo taken with the webcam
      canvas.width = image.canvas.width;
      canvas.height = image.canvas.height;
      canvas.style.zoom = `${window.innerHeight > 720 ? 2.02 - (720 / window.innerHeight) : 1}`;
      context.drawImage(image.canvas, 0, 0);

      if (videoOffset) { // Adjust offset for phones
        canvas.style.marginLeft = videoOffset;
      }
    } else { // This is a user uploaded image
      const { img } = image;
      canvas.width = img.width;
      canvas.height = img.height;

      const hRatio = window.innerWidth / img.width;
      const vRatio = window.innerHeight / img.height;
      const ratio = Math.min(hRatio, vRatio);
      context.drawImage(img, 0, 0);
    }
  }

  drawFaceData() {
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
  }

  drawEmoji({ faceRectangle, faceAttributes }) {
    const {
      top, left, width, height,
    } = faceRectangle;
    const emotionRanking = Object.entries(faceAttributes.emotion).sort((a, b) => a[1] < b[1]);
    const emotion = emotionRanking[0][0];
    const [x, y] = [left, top + height];
    const [adjustedX, adjustedWidth] = [x * 0.75, width * 1.25];

    const style = {
      font: `${adjustedWidth}px Comic Sans MS`,
      fillStyle: 'yellow',
      textAlign: 'left',
    };

    console.log('Emotion rankings:', JSON.stringify(emotionRanking));
    this.drawText(EMOJI_EMOTION_MAP[emotion], style, x - ((adjustedWidth - width) / 2), y, adjustedWidth);
  }

  drawFaceMidpoint({ faceRectangle }) {
    const context = this.canvasContext;
    const {
      top, left, width, height,
    } = faceRectangle;

    const [midX, midY] = [left + (width / 2), top + (height / 2)];
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
      <PhotoWrapper className={ !this.props.image.canvas ? 'uploaded' : '' } >
        <Canvas innerRef={this.canvasRef} className={ !this.props.image.canvas ? 'uploaded' : '' } />
        {faceData instanceof Error && <section>{faceData.toString()}</section>}
        <canvas id="hidden-canvas" ref={this.hiddenCanvasRef}  style={{ width: '100vw', height: '100vh', display: 'none' }} />
      </PhotoWrapper>
    );
  }
}

export default connect(({ image, faceData, faceDataStatus, videoOffset }) => ({ image, faceData, faceDataStatus, videoOffset }), null)(Photo);
