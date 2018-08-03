import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Camera from './components/Camera.js';
import IonModal from './components/IonModal.js';
import Modal from './components/Modal.js';
import Photo from './components/Photo.js';

const EMOJI_YELLOW = '#FDDB5B';

const Section = styled.section`
  /* height: calc(100vh); */
  width: 100vw;
  height: 100vh;
  /* height: calc(100vh - 100px); */
  background-color: green;
`;

const Wrapper = styled.div`
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

async function presentModal() {
  // initialize controller
  const modalController = document.querySelector('ion-modal-controller');
  await modalController.componentOnReady();

  // create component to open
  const element = document.createElement('div');
  element.innerHTML = `
  <ion-header>
    <ion-toolbar>
      <ion-title>Super Modal</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <h1>Content of doom</h1>
    <div>Here's some more content</div>
    <ion-button class="dismiss">Dismiss Modal</ion-button>
  </ion-content>
  `;

  // listen for close event
  const button = element.querySelector('ion-button');
  button.addEventListener('click', () => {
    modalController.dismiss();
  });

  // present the modal
  const modalElement = await modalController.create({
    component: element,
  });
  modalElement.present();
}

class App extends Component {
  constructor() {
    super();
    console.log('hi');
  }
  render() {
    const { image, showModal } = this.props;

    return (
      <ion-app style={{ overflow: 'hidden' }}>
        <Wrapper className="App">
          <ion-header translucent style={{ position: 'absolute', height: 0, backgroundColor: 'rgba(0,0,0,0)' }}>
            <ion-toolbar>
              <ion-title onClick={presentModal}><Logo alt="logo" src="images/Logo.png" /></ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content fullscreen scroll-enabled={false} style={{ width: '100vw', height: '100vh' }}>
            <ion-modal-controller />
            {/* {showModal && <Modal />} */}
            {showModal && <IonModal />}
            <Section>
              <Camera />
            </Section>
          </ion-content>
        </Wrapper>
        <ion-alert-controller />
      </ion-app>
    );
  }
}

function mapStateToProps(state) {
  const { image, showModal } = state;

  return { image, showModal };
}

export default connect(mapStateToProps, null)(App);
