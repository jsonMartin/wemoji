import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import cameraButtonPressed from '../actions/cameraButtonPressed.js';

const EMOJI_YELLOW = '#FDDB5B'; // De-dupcliate and fix by putting in a themes file?

const Video = styled.video`
  /* width: 100%;
  min-height: 80vh;
  object-fit: cover; */
`;

const CameraWrapper = styled.div`
  /* height: 80vh; */
  /* max-height: 720px; */
  height: 100%;
  width: 100%;
  /* background-color: green; */
`;

const HiddenCanvas = styled.canvas`
  display: none;
`;

const CameraButton = styled.button`
  border-radius: 50%;
  background-color: ${EMOJI_YELLOW};
  font-size: 36px;
  text-align: center;
  position: relative;
  display: block;
  margin: 0 auto;
  bottom: 70px;
`;

class Camera extends Component {
  async componentDidMount() {
    window.addEventListener('resize', () => this.loadMediaStream());
    this.loadMediaStream();
  }

  videoRef = React.createRef()
  canvasRef = React.createRef()
  cameraWrapperRef = React.createRef()

  async loadMediaStream() {
    const video = this.videoRef.current;
    const camera = this.cameraWrapperRef.current;
    const { clientWidth, clientHeight } = camera;
    console.log('Client width, client height:', clientWidth, clientHeight);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: camera.clientWidth, max: 1280 }, height: { ideal: camera.clientHeight, max: 720 } },
        audio: false,
      });
      video.srcObject = stream;
    } catch (error) {
      console.error(error);
    }
  }

  takePhoto = () => {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    const video = this.videoRef.current;
    const { videoWidth, videoHeight } = video;
    [canvas.width, canvas.height] = [videoWidth, videoHeight];

    console.log('VideoWidth, VideoHeight:', videoWidth, videoHeight);

    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    this.props.cameraButtonPressed(imageData);
  }

  render() {
    return (
      <CameraWrapper innerRef={this.cameraWrapperRef} className="camera">
        <Video innerRef={this.videoRef} id="video" autoPlay>Camera not available.</Video> {/* (Styled Componenents requires using "innerRef") */}
        {/* <Button variant="fab" color="primary" onClick={this.takePhoto}><AddIcon /></Button> */}
        <CameraButton onClick={this.takePhoto}><span role="img" aria-label="Camera" >📷</span></CameraButton>

        {/* Hidden Canvas exists to store image for writing */}
        <HiddenCanvas innerRef={this.canvasRef} id="canvas" />
      </CameraWrapper>
    );
  }
}

export default connect(null, dispatch => bindActionCreators({ cameraButtonPressed }, dispatch))(Camera);
