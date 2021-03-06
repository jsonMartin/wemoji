import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import cameraButtonPressed from '../actions/cameraButtonPressed.js';
import setVideoOffset from '../actions/setVideoOffset.js';

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

class Camera extends Component {
  async componentDidMount() {
    window.addEventListener('resize', () => this.loadMediaStream()); // Re-render if user resizes browser
    this.loadMediaStream();
  }

  videoRef = React.createRef()
  canvasRef = React.createRef()
  cameraWrapperRef = React.createRef()

  async loadMediaStream() {
    const { setVideoOffset } = this.props;
    const video = this.videoRef.current;
    const camera = this.cameraWrapperRef.current;

    try {
      // First, we try to allow the camera to work at exactly the resolution of the browser.
      try {
       const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: camera.clientWidth, max: 1280 }, height: { ideal: camera.clientHeight, max: 720 } },
          audio: false,
        });
        video.srcObject = stream;
      } catch (error) {
        console.error(error);
        throw new Error('Custom size not supported...trying standard sizes');
      }
    } catch(e) { // If that fails, we try a standard size to allow better compatability with devices such as iPhone
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { min: 640, max: 1280 }, height: { min: 480, max: 720 } },
          audio: false,
        });

        video.srcObject = stream;

        video.onloadedmetadata = function() { // This needs to be a regular function (not arrow) so that "this" refers to the video object
          // Adjust mobile offset so image is centered
          const marginLeftOffset = `${- ((this.videoWidth / 2) - (window.innerWidth / 2))}px`;
          video.style.marginLeft = marginLeftOffset;
          setVideoOffset(marginLeftOffset);
        }
    }
  }

  takePhoto = () => {
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    const video = this.videoRef.current;
    const { videoWidth, videoHeight } = video;
    [canvas.width, canvas.height] = [videoWidth, videoHeight];

    context.imageSmoothingEnabled = false; // Anti-Aliasing messes up image render drawing

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
