import React, { Component } from 'react';
import Photo from './Photo.js';
import styled from 'styled-components';
import { bindActionCreators } from '../../../../Library/Caches/typescript/2.9/node_modules/redux';
import { connect } from 'react-redux';

const ANIMATION_DELAY = 300; // in ms

const backButton = styled('ion-fab')`
    background-color: pink;
`;

const ModalContent = styled.div`

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

  get shouldShow() {
    return this.props.showModal;
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

  async presentModal() {
    const modalElement = await this.modalController.create({ component: this.modalRef.current });
    modalElement.present();
  }
    modalController = null;

  modalControllerRef = React.createRef();
  modalRef = React.createRef();

  dismiss = () => {
    this.modalController.dismiss();
    setTimeout(this.props.dismissModal, ANIMATION_DELAY);
  }

  renderModalContents() {
    return (
      <ModalContent>
        <ion-fab vertical="top" horizontal="start" slot="fixed">
          <ion-fab-button>
            <ion-icon name="back" onClick={this.dismiss} />
          </ion-fab-button>
        </ion-fab>

        <Photo />

        <ion-content>
          <ion-button class="dismiss">Dismiss Modal</ion-button>
        </ion-content>
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

// export default IonModal;

function mapStateToProps(state) {
  const { image, showModal, mode } = state;

  return { image, showModal, mode };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    dismissModal: () => ({ type: 'DISMISS_MODAL' }),
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IonModal);
