import React, { Component } from 'react';
import styled from 'styled-components';
// TODO: Rename to camera

const Video = styled.video`
  /* width: 100%;
  min-height: 80vh;
  object-fit: cover; */
`;

const Canvas = styled.canvas`
  width: 100%;
  min-height: 80vh;
  object-fit: cover;
`;

class Input extends Component {
  constructor() {
    super();
    this.videoRef = React.createRef();
  }

  async componentDidMount() {
    navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    const video = this.videoRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { exact: 448 }, height: { exact: 676 } },
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
      <div>
        <div className="camera">
          <Video innerRef={this.videoRef} id="video" autoPlay>Camera not available.</Video> {/* (Styled Componenents requires using "innerRef") */}
          <button id="startbutton" onClick={this.takePhoto}>Take photo</button>
        </div>
        {/* <canvas id="canvas" style={{ display: 'none' }} /> */}
        <Canvas id="canvas" />
      </div>
    );
  }
}

export default Input;
