import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Camera from './components/Camera.js';
import Modal from './components/Modal.js';

const EMOJI_YELLOW = '#FDDB5B';

const Section = styled.section`
  height: 100vh;
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
      <Wrapper className="App">
        {showModal && <Modal />}

        <Section>
          <Camera />
        </Section>

      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  const { image, showModal } = state;

  return { image, showModal };
}

export default connect(mapStateToProps, null)(App);
