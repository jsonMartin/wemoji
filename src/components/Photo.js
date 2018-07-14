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

    if (faceData.length === 0) return this.drawText();
    for (const face of faceData) {
      this.drawFaceRectangleBoxes(face);
    }
  }

  drawText(text) {
    const context = this.canvasContext;
    context.font = '30px Comic Sans MS';
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
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
