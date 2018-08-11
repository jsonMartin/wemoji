import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Camera from './components/Camera.js';
import IonModal from './components/IonModal.js';
import Modal from './components/Modal.js';
import Photo from './components/Photo.js';

import cameraButtonPressed from './actions/cameraButtonPressed.js';

const EMOJI_YELLOW = '#FDDB5B';

const Section = styled.section`
  /* height: calc(100vh); */
  width: 100vw;
  height: 100vh;
  /* height: calc(100vh - 100px); */
  background-color: green;
`;

const Wrapper = styled.div`
  ion-toolbar > ion-button {
    --ion-color-base: rgba(0,0,0,.2);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Logo = styled.img`
  height: 44px;
  margin-top: 5px;
`;

async function presentAlert() {
  const alertController = document.querySelector('ion-alert-controller');
  await alertController.componentOnReady();

  const alert = await alertController.create({
    header: 'Wemoji',
    subHeader: 'Brought to you by POPSUGAR',
    message: 'Developed by Jason Martin, <br/>Designed by Leighton Kountz',
    buttons: ['👍'],
  });

  await alert.present();
}

class App extends Component {
  constructor() {
    super();
    console.log('hi');
  }

  hiddenFileInputRef = React.createRef()

  selectImage = () => {
    // debugger;
    this.hiddenFileInputRef.current.click();
  }

  uploadImage = async () => {
    // debugger;

    const image = this.hiddenFileInputRef.current.files[0];
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    const base64 = await getBase64(image);

    // Convert binary data to image object
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const [width, height] = [this.width, this.height];
      this.props.cameraButtonPressed({
        base64, img, width, height,
        // base64, img, width: this.naturalWidth, height: this.naturalHeight,
      });
      this.hiddenFileInputRef.current.value = '';
    };
  }

  render() {
    const { image, showModal } = this.props;
    // debugger;

    return (
      <ion-app style={{ overflow: 'hidden' }}>
        <Wrapper className="App">

          <ion-header style={{ position: 'absolute', height: 0, backgroundColor: 'rgba(0,0,0,0)' }}>
            <ion-toolbar>
              <ion-buttons slot="end">
                <ion-button slot="start" onClick={() => this.selectImage()}>
                  <ion-icon name="images" />
                </ion-button>
              </ion-buttons>
              <ion-title onClick={presentAlert}><Logo alt="logo" src="images/Logo.png" /></ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content fullscreen scroll-enabled={false} style={{ width: '100vw', height: '100vh' }}>
            {/* {showModal && <Modal />} */}
            {/* {showModal && <IonModal />} */}
            {<IonModal />}
            <Section>
              <Camera />
            </Section>
          </ion-content>
        </Wrapper>
        <ion-alert-controller />
        <HiddenFileInput type="file" innerRef={this.hiddenFileInputRef} onChange={() => this.uploadImage()} />
      </ion-app>
    );
  }
}

function mapStateToProps(state) {
  const { image, showModal } = state;

  return { image, showModal };
}

export default connect(mapStateToProps, { cameraButtonPressed })(App);
