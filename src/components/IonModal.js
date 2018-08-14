import React, { Component } from 'react';
import Photo from './Photo.js';
import styled from 'styled-components';
import { connect } from 'react-redux';

import dismissModal from '../actions/dismissModal.js';

const ANIMATION_DELAY = 300; // in ms

const backButton = styled('ion-fab')`
    background-color: pink;
`;

const ShareButtons = styled('ion-fab')`
  --ion-color-primary: pink;
`;

const ModalContent = styled.div`
    ion-toolbar > ion-fab-button {
        --ion-color-base: rgba(0,0,0,.2);
    }
`;

const Logo = styled.img`
  height: 44px;
  margin-top: 5px;
`;

class IonModal extends Component {
  constructor() {
    super();
    this.lala = 2;
  }

  async componentDidMount() {
    const modalController = this.modalControllerRef.current;
    await modalController.componentOnReady();
    this.modalController = modalController;
  }


  componentDidUpdate(prevProps) {
    // debugger;
    if (prevProps.showModal !== this.props.showModal) {
      if (this.props.showModal) {
        console.log('PRESENTING MODAL!');
        this.presentModal();
      } else {
        console.log('Not presenting modal');
      }
    }
  }
  get shouldShow() {
    return this.props.showModal;
  }

  async presentModal() {
    const modalElement = await this.modalController.create({ component: this.modalRef.current });
    modalElement.present();
  }
    modalController = null;

  modalControllerRef = React.createRef();
  modalRef = React.createRef();

  dismiss = () => {
    debugger;
    this.modalController.dismiss();
    setTimeout(this.props.dismissModal, ANIMATION_DELAY);
  }

  renderHeader() {
    return (
      <ion-toolbar style={{ position: 'absolute' }} mode="ios">
        <ion-fab-button>
          <ion-icon name="close" color="primary" onClick={this.dismiss} />
        </ion-fab-button>
        <ion-title><Logo alt="logo" src="images/Logo.png" /></ion-title>
      </ion-toolbar>
    );
  }

  renderModalContents() {
    return (
      <ModalContent>
        {this.renderHeader()}
        <Photo />

        <ion-fab vertical="bottom" horizontal="center" class="sharing">
          <ion-fab-button><ion-icon name="share" /></ion-fab-button>

          <ion-fab-list side="top">
            <ion-fab-button><ion-icon name="download" /></ion-fab-button>
            <ion-fab-button><ion-icon name="logo-instagram" /></ion-fab-button>
            <ion-fab-button><ion-icon name="logo-twitter" /></ion-fab-button>
            <ion-fab-button><ion-icon name="logo-youtube" /></ion-fab-button>
          </ion-fab-list>

        </ion-fab>
      </ModalContent>
    );
  }


  render() {
    return (
      <section className="modalWrapper">
        <ion-modal-controller ref={this.modalControllerRef} />

        <section ref={this.modalRef}>
          { this.shouldShow && this.renderModalContents() }
        </section>
      </section>
    );
  }
}

export default connect((({  image, showModal, mode } ) => ({ image, showModal, mode })), { dismissModal })(IonModal);
