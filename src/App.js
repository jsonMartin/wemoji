import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators, createStore } from 'redux';

import Camera from './components/Camera.js';
import cameraButtonPressed from './actions/cameraButtonPressed.js';

const EMOJI_YELLOW = '#FDDB5B';

const Header = styled.header`
  height: 5vh;
  background-color: ${EMOJI_YELLOW}; // Emoji yellow
  text-align: center;
  vertical-align: center;
  font-size: 24px;
  font-family: "Lucida Console", Monaco, monospace;
  position: relative;
`;

const Section = styled.section`
  height: 80vh;
  max-height: 720px;
  background-color: green;
`;

const Footer = styled.section`
  height: 15vh;
  background-color: blue;
  overflow: scroll;
`;

const Wrapper = styled.div`

`;
class App extends Component {
  constructor() {
    super();
    console.log('hi');
  }
  render() {
    const { image } = this.props;

    return (
      <Wrapper className="App">
        <Header>
          WEMoJI
        </Header>

        <Section>
          <Camera />
        </Section>

        <Footer>
          Image: {image}
          <img id="photo" height="100%" alt="The screen capture will appear in this box." />
        </Footer>
      </Wrapper>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ cameraButtonPressed }, dispatch);
}

function mapStateToProps(state) {
  return {
    image: state.image,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
