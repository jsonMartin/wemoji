import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const Canvas = styled.canvas`
  width: 100vw;
  height: 80vh;
`;


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
    debugger;
    context.fillStyle = style.fillStyle;
    context.textAlign = style.textAlign;
    if (maxWidth) {
      // Find best size
      let txtWidth = context.measureText(text).width;
      console.log('txtWidth:', txtWidth);
      while (txtWidth > maxWidth) {
        debugger;
        console.error(`txtWidth of ${txtWidth} is greater than maxWidth, will decrease`);
        const fontSize = context.font.match(/\d*(?=px)/);
        context.font = context.font.replace(fontSize, fontSize - 1);
        console.log('New font size:', fontSize - 1);

        txtWidth = context.measureText(text).width;
      }
    }
    context.fillText(text, x, y, maxWidth);
  }

  drawEmoji({ faceRectangle }) {
    // const EMOJI_SCALE_FACTOR = 1.3;
    // const EMOJI_SCALE_FACTOR = 1;
    const EMOJI_SCALE_FACTOR = 1.5;
    // const fontSize = 1000;
    const fontSize = faceRectangle.width * 2;
    // const fontSize = faceRectangle.width * EMOJI_SCALE_FACTOR;
    const style = {
      font: `${fontSize}px Comic Sans MS`,
      fillStyle: 'yellow',
      textAlign: 'left',
      textBaseline: 'middle',
    };

    // Find Emoji Size

    console.log('fontSizer:', fontSize); // const [x, y] = [(faceRectangle.left + faceRectangle.width) / 2, (faceRectangle.top + faceRectangle.height) / 2];
    const [x, y] = [faceRectangle.left, (faceRectangle.top + faceRectangle.height)];
    this.drawText('😎', style, x, y, faceRectangle.width);
  }

  drawFaceRectangleBoxes({ faceRectangle }) {
    const context = this.canvasContext;
    context.lineWidth = '6';
    context.strokeStyle = 'red';
    context.rect(faceRectangle.left, faceRectangle.top, faceRectangle.width, faceRectangle.height);
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
