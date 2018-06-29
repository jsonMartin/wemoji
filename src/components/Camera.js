import React, { Component } from 'react';
import styled from 'styled-components';

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
  constructor() {
    super();
    this.videoRef = React.createRef();
  }

  async componentDidMount() {
    window.addEventListener('resize', () => this.loadMediaStream());
    this.loadMediaStream();
  }

  async loadMediaStream() {
    navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    const video = this.videoRef.current;
    const camera = document.getElementsByClassName('camera')[0];
    const { clientWidth, clientHeight } = camera;
    console.log('Client width, client height:', clientWidth, clientHeight);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // video: { height: { exact: 720 } },
        video: { width: { ideal: camera.clientWidth, max: 1280 }, height: { ideal: camera.clientHeight, max: 720 } },
        audio: false,
      });
      video.srcObject = stream;
    } catch (error) {
      console.error(error);
    }
  }

  takePhoto() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const video = document.getElementById('video');
    const photo = document.getElementById('photo');
    const { videoWidth, videoHeight } = video;

    [canvas.width, canvas.height] = [videoWidth, videoHeight];
    console.log('VideoWidth, VideoHeight:', videoWidth, videoHeight);

    context.drawImage(video, 0, 0);
    const data = canvas.toDataURL('image/png');
    // console.log(data);
    photo.setAttribute('src', data);
  }
  render() {
    return (

      <CameraWrapper className="camera">
        <Video innerRef={this.videoRef} id="video" autoPlay>Camera not available.</Video> {/* (Styled Componenents requires using "innerRef") */}
        {/* <Button variant="fab" color="primary" onClick={this.takePhoto}><AddIcon /></Button> */}
        <CameraButton onClick={this.takePhoto}><span role="img" aria-label="Camera" >📷</span></CameraButton>

        {/* Hidden Canvas exists to store image for writing */}
        <HiddenCanvas id="canvas" />
      </CameraWrapper>

    );
  }
}

export default Camera;
