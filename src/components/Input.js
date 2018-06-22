import React, { Component } from 'react';
import styled from 'styled-components';
// TODO: Rename to camera

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

const Canvas = styled.canvas`
  width: 100%;
  min-height: 80vh;
  object-fit: cover;
`;

const CameraButton = styled.button`
  position: absolute;
  left: 50%;
  bottom: 210px;
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
    // const video = this.videoRef.current;
    const video = document.getElementById('video');
    const photo = document.getElementById('photo');
    const { width, height } = video.getBoundingClientRect();

    const { videoWidth, videoHeight } = video;
    console.log('VideoWidth, VideoHeight:', videoWidth, videoHeight);
    [canvas.width, canvas.height] = [videoWidth, videoHeight];

    console.log('Width, height', videoWidth, videoHeight);
    // debugger;
    context.drawImage(video, 0, 0);
    const data = canvas.toDataURL('image/png');
    // console.log(data);
    photo.setAttribute('src', data);
  }
  render() {
    return (

      <CameraWrapper className="camera">
        <Video innerRef={this.videoRef} id="video" autoPlay>Camera not available.</Video> {/* (Styled Componenents requires using "innerRef") */}
        <CameraButton id="startbutton" onClick={this.takePhoto}>Take photo</CameraButton>
        {/* <Canvas id="canvas" /> */}
        <canvas id="canvas" style={{ display: 'none' }} />
      </CameraWrapper>

    );
  }
}

export default Camera;
