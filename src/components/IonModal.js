import React, { Component } from 'react';
import Photo from './Photo.js';
import { bindActionCreators } from '../../../../Library/Caches/typescript/2.9/node_modules/redux';
import { connect } from 'react-redux';

class IonModal extends Component {
  constructor() {
    super();
    this.lala = 2;
  }

  //   componentDidUpdate() {
  //     debugger;
  //   }

  //   propsWill

  async componentDidMount() {
    const modalController = this.modalControllerRef.current;
    await modalController.componentOnReady();
    this.modalController = modalController;
    // this.presentModal();
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
    this.modalController && this.modalController.dismiss();
    this.props.dismissModal();
  }

  renderModalContents() {
    return (
      <div ref={this.modalRef}>
        <ion-fab vertical="top" horizontal="start" slot="fixed">
          <ion-fab-button>
            <ion-icon name="back" onClick={this.dismiss} />
          </ion-fab-button>
        </ion-fab>

        <Photo />

        <ion-content>
          <ion-button class="dismiss">Dismiss Modal</ion-button>
        </ion-content>
      </div>
    );
  }


  render() {
    return (
      <section className="modalWrapper">
        <ion-modal-controller ref={this.modalControllerRef} />
        { this.shouldShow && this.renderModalContents() }
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
