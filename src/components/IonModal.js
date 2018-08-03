import React, { Component } from 'react';
import Photo from './Photo.js';

class IonModal extends Component {
  async presentModal() {
    // initialize controller
    const modalController = document.querySelector('ion-modal-controller');
    await modalController.componentOnReady();
    // create component to open
    // const element = document.createElement('div');
    // element.innerHTML = `
    //     <ion-header>
    //       <ion-toolbar>
    //         <ion-title>Super Modal</ion-title>
    //       </ion-toolbar>
    //     </ion-header>
    //     <ion-content>
    //       <h1>Content of doom</h1>
    //       <div>Here's some more content</div>
    //       <ion-button class="dismiss">Dismiss Modal</ion-button>
    //     </ion-content>
    //     `;

    // listen for close event
    const button = this.modalRef.current.querySelector('ion-button');
    button.addEventListener('click', () => {
      modalController.dismiss();
    });

    // present the modal
    const modalElement = await modalController.create({
      component: this.modalRef.current,
    });
    modalElement.present();
  }

  modalRef = React.createRef();

  render() {
    this.presentModal();

    return (
      <div ref={this.modalRef}>
        <Photo />
        {/* <ion-header>
          <ion-toolbar>
            <ion-title>Super Modal</ion-title>
          </ion-toolbar>
        </ion-header> */}
        <ion-content>
          {/* <div>Here is some more content</div> */}
          <ion-button class="dismiss">Dismiss Modal</ion-button>
        </ion-content>
      </div>
    );
  }
}

export default IonModal;
