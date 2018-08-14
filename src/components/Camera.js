import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import cameraButtonPressed from '../actions/cameraButtonPressed.js';
import setVideoOffset from '../actions/setVideoOffset.js';

const EMOJI_YELLOW = '#FDDB5B'; // De-dupcliate and fix by putting in a themes file?

const Video = styled.video`
  zoom: ${window.innerHeight > 720 ? 2.02 - (720 / window.innerHeight) : 1};
  overflow: hidden;
`;

const CameraWrapper = styled.div`
  height: 100%;
  width: 100%;
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
    const { setVideoOffset } = this.props;
    const video = this.videoRef.current;
    const camera = this.cameraWrapperRef.current;
    const { clientWidth, clientHeight } = camera;
    console.log('Client width, client height:', clientWidth, clientHeight);
    // debugger;
    const isSafari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1); // /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    try {
      try {
       const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: camera.clientWidth, max: 1280 }, height: { ideal: camera.clientHeight, max: 720 } },
          audio: false,
        });
        video.srcObject = stream;
        console.log(stream);
      } catch (error) {
        // debugger;
        console.error(error);
        throw new Error('Custom size not supported');
      }
    } catch(e) {
        const stream = await navigator.mediaDevices.getUserMedia({
          // video: { width: { exact: 640 } , height: { exact: 480 } },
          video: { width: { min: 640, max: 1280 }, height: { min: 480, max: 720 } },
          audio: false,
        });
        video.srcObject = stream;

        video.onloadedmetadata = function() {
          console.log('width is', this.videoWidth);
          console.log('height is', this.videoHeight);

          // Adjust mobile offset so image is centered
          const marginLeftOffset = `${- ((this.videoWidth / 2) - (window.innerWidth / 2))}px`;
          video.style.marginLeft = marginLeftOffset;
          // debugger;
          setVideoOffset(marginLeftOffset);
        }

        console.log(stream);
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

export default connect(null, { setVideoOffset, cameraButtonPressed })(Camera);
