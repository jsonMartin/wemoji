import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import cameraButtonPressed from '../actions/cameraButtonPressed.js';

const EMOJI_YELLOW = '#FDDB5B'; // De-dupcliate and fix by putting in a themes file?

const Video = styled.video`
  zoom: ${window.innerHeight > 720 ? 2.02 - (720 / window.innerHeight) : 1};
  overflow: hidden;

   position: relative;
   top: 50%;
   transform: translateY(-50%);
   max-width: 100%;
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
    // debugger;
    const isSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1); // /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // video: { width: { min: 640 }, height: { min: 480} },
        // video: { width: { ideal: camera.clientWidth, max: 1280 }, height: { ideal: camera.clientHeight, max: 720 } },
        video: (!isSafari ?
          ({ width: { ideal: camera.clientWidth, max: 1280 }, height: { ideal: camera.clientHeight, max: 720 } })
            :
          ({ width: { min: 640 }, height: { min: 480} })),
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

    context.imageSmoothingEnabled = false; // Anti-Aliasing messes up image render drawing
    console.log('VideoWidth, VideoHeight:', videoWidth, videoHeight);

    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    this.props.cameraButtonPressed({ base64: imageData, canvas });
  }

  render() {
    return (
      <CameraWrapper innerRef={this.cameraWrapperRef} className="camera">

        <Video innerRef={this.videoRef} id="video" autoPlay>Camera not available.</Video> {/* (Styled Componenents requires using "innerRef") */}

        <ion-fab onClick={this.takePhoto} vertical="bottom" horizontal="center" slot="fixed">
          <ion-fab-button >
            <ion-icon name="camera" />
          </ion-fab-button>
        </ion-fab>

        {/* Hidden Canvas exists to store image for writing */}
        <HiddenCanvas innerRef={this.canvasRef} id="canvas" />
      </CameraWrapper>
    );
  }
}

export default connect(null, { cameraButtonPressed })(Camera);
