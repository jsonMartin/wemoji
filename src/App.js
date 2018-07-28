import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Camera from './components/Camera.js';
import Modal from './components/Modal.js';

const EMOJI_YELLOW = '#FDDB5B';

const Section = styled.section`
  height: calc(100vh - 44px);
  background-color: green;
`;

const Wrapper = styled.div`

`;

class App extends Component {
  constructor() {
    super();
    console.log('hi');
  }
  render() {
    const { image, showModal } = this.props;

    return (
      <ion-app>
        <Wrapper className="App">
          {/* <ion-header translucent style={{ position: 'absolute' }}> */}


          <ion-content fullscreen>
            <ion-header translucent style={{ position: 'absolute', height: 0, 'background-color': 'rgba(0,0,0,0)' }}>
              <ion-toolbar>
                <ion-title>Wemoji</ion-title>
              </ion-toolbar>
            </ion-header>
            {/* <ion-content> */}
            <Section>
              <Camera />
            </Section>
          </ion-content>

        </Wrapper>
      </ion-app>
    );
  }
}

function mapStateToProps(state) {
  const { image, showModal } = state;

  return { image, showModal };
}

export default connect(mapStateToProps, null)(App);
