import React, { Component } from 'react';

// TODO: Rename to camera
class Input extends Component {
  async componentDidMount() {
    navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    const video = document.getElementById('video');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
    const { width, height } = video.getBoundingClientRect();

    console.log('Width, height', width, height);
    context.drawImage(video, 0, 0, 320, 240);
    const data = canvas.toDataURL('image/png');
    // console.log(data);
    photo.setAttribute('src', data);
  }
  render() {
    return (
      <div>
        <div className="camera">
          {/* <video id="video" width="640" height="480" autoPlay>Video stream not available.</video> */}
          <video id="video" width="100%" height="100%" autoPlay>Video stream not available.</video>
          <button id="startbutton" onClick={this.takePhoto}>Take photo</button>
        </div>
        <canvas id="canvas" style={{ display: 'none' }} />
      </div>
    );
  }
}

export default Input;
