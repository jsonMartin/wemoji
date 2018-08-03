import React, { Component } from 'react';
import Photo from './Photo.js';

class IonModal extends Component {
  constructor() {
    super();
    this.lala = 2;
  }


  async componentDidMount() {
    const modalController = this.modalControllerRef.current;
    await modalController.componentOnReady();
    this.modalController = modalController;
    this.presentModal();
  }
    modalController = null;

    async presentModal() {
      if (!this.modalController) return;
      const modalElement = await this.modalController.create({ component: this.modalRef.current });

      modalElement.present();
    }

  modalControllerRef = React.createRef();
  modalRef = React.createRef();

  dismiss = () => this.modalController && this.modalController.dismiss()

  render() {
    return (
      <section id="modalWrapper">
        <ion-modal-controller ref={this.modalControllerRef} />
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
      </section>
    );
  }
}

export default IonModal;
