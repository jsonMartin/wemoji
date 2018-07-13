import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const Canvas = styled.canvas`
  width: 100vw;
  height: 80vh;
`;


class Photo extends React.Component {
  state = {}

  async componentDidMount() {
    const { image } = this.props;
    this.drawImageToCanvas(image);
  }

  componentDidUpdate() {
    const { image, faceData } = this.props;
    this.drawImageToCanvas(image);
    if (Array.isArray(faceData)) this.drawFaceData(); // Draw Face Data, if it exists
  }

  get canvasContext() {
    return this.canvas.getContext('2d');
  }

  get canvas() {
    return this.canvasRef.current;
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

    if (faceData.length === 0) return this.drawNoFacesDetectedText();
    for (const face of faceData) {
      this.drawFaceRectangleBoxes(face);
    }
  }

  drawNoFacesDetectedText() {
    const context = this.canvasContext;
    context.font = '30px Comic Sans MS';
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.fillText('No face detected', this.canvas.width / 2, this.canvas.height / 2);
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
    return <Canvas innerRef={this.canvasRef} />;
  }

  // TODO: Allow to save image
}

function mapStateToProps(state) {
  const { image, faceData } = state;

  return { image, faceData };
}
export default connect(mapStateToProps, null)(Photo);
