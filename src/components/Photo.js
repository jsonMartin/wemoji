import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const Canvas = styled.canvas`
  width: 100vw;
  height: 80vh;
`;


const EMOJI_SCALE_FACTOR = 1; // When increasing, messes up position of box
// TODO: Fix position of increasing scale factor, for both drawing box & emoji
// TODO: Create a helper function to return scaled face box for drawing emoji

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
    const { image, faceData } = this.props;
    this.drawImageToCanvas(image);

    if (Array.isArray(faceData)) this.drawFaceData();
    else if (faceData === 'LOADING') this.drawText('Analyzing Faces...');
    else if (faceData === 'NO_FACES_DETECTED') this.drawText('No faces detected');
    else if (faceData instanceof Error) this.drawText('Connection Problem');
    else this.drawText('Unknown problem');
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
      this.drawFaceRectangleBoxes(face);
      this.drawEmoji(face);
    }
  }

  drawText(text, style = {
    font: '30px Comic Sans MS',
    fillStyle: 'red',
    textAlign: 'center',
  }, x = this.canvas.width / 2, y = this.canvas.height / 2, maxWidth = null) {
    const context = this.canvasContext;

    context.font = style.font;
    context.fillStyle = style.fillStyle;
    context.textAlign = style.textAlign;
    context.fillText(text, x, y, maxWidth);
  }

  drawEmoji({ faceRectangle, faceAttributes }) {
    const {
      top, left, width,
    } = this.adjustFaceDimensions(faceRectangle, 0.5); // TODO: Change this in ESLINT so it's one line
    const emotionRanking = Object.entries(faceAttributes.emotion).sort((a, b) => a[1] < b[1]);
    console.log('Emotion rankings:', JSON.stringify(emotion));
    const emotion = emotionRanking[0][0];
    const fontSize = width;
    const style = {
      font: `${fontSize}px Comic Sans MS`,
      fillStyle: 'yellow',
      textAlign: 'left',
    };


    console.log('fontSizer:', fontSize); // const [x, y] = [(faceRectangle.left + faceRectangle.width) / 2, (faceRectangle.top + faceRectangle.height) / 2];
    const [x, y] = [left, top + fontSize];
    this.drawText(EMOJI_EMOTION_MAP[emotion], style, x, y, width);
    // const [x, y] = [faceRectangle.left, faceRectangle.top + fontSize];
    // const [x, y] = [faceRectangle.left, (faceRectangle.top + faceRectangle.height)];
    // this.drawText('😎', style, x, y, faceRectangle.width);
  }

  adjustFaceDimensions(faceRectangle, scaleFactor = 0.25) {
    return {
      top: (faceRectangle.top - (faceRectangle.top * scaleFactor)),
      left: (faceRectangle.left - (faceRectangle.left * scaleFactor)),
      width: (faceRectangle.width + (faceRectangle.width * scaleFactor)),
      height: (faceRectangle.height + (faceRectangle.height * scaleFactor)),
    };
  }

  drawFaceRectangleBoxes({ faceRectangle }) {
    const context = this.canvasContext;
    const {
      top, left, width, height,
    } = this.adjustFaceDimensions(faceRectangle);
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

function mapStateToProps(state) {
  const { image, faceData } = state;

  return { image, faceData };
}
export default connect(mapStateToProps, null)(Photo);
