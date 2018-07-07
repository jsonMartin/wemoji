import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import fetchFaceData from '../utilities/fetchFaceData.js';
import setFaceData from '../actions/setFaceData.js';

const Canvas = styled.canvas`
  width: 100vw;
  height: 80vh;
`;


class Photo extends React.Component {
  state = {}

  async componentDidMount() {
    const { image, setFaceData } = this.props;
    this.drawImageToCanvas(image);
    setFaceData(await fetchFaceData(image));
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
    // context.drawImage(image.canvas, 0.5, 0.5, canvas.width, canvas.height);
    // context.drawImage(image.canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    context.drawImage(image.canvas, 0, 0);
    if (Array.isArray(faceData)) {
      if (faceData.length === 0) return this.drawNoFacesDetectedText();
      for (const face of faceData) {
        this.drawFaceRectangleBoxes(face);
      }
    }
  }

  drawNoFacesDetectedText() {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    context.font = '30px Comic Sans MS';
    context.fillStyle = 'red';
    context.textAlign = 'center';
    context.fillText('No face detected', canvas.width / 2, canvas.height / 2);
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
    return <Canvas innerRef={this.canvasRef} />;
  }

  // TODO: Allow to save image
}

function mapStateToProps(state) {
  const { image, faceData } = state;

  return { image, faceData };
}
export default connect(mapStateToProps, dispatch => bindActionCreators({ setFaceData }, dispatch))(Photo);
