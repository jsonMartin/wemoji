import React, { Component } from 'react';
import styled from 'styled-components';

import Camera from './components/Input.js';

const Header = styled.header`
  height: 5vh;
  background-color: aqua;
`;

const Section = styled.section`
  height: 80vh;
  max-height: 720px;
  background-color: green;
`;

const Footer = styled.section`
  /* height: 15vh; */
  background-color: blue;
`;

const Wrapper = styled.div`

`;
class App extends Component {
  constructor() {
    super();
    console.log('hi');
  }
  render() {
    return (
      <Wrapper className="App">
        <Header>
          I'm the header
        </Header>

        <Section>
          <Camera />
        </Section>

        <Footer>
          <img id="photo" height="100%" alt="The screen capture will appear in this box." />
        </Footer>
      </Wrapper>
    );
  }
}

export default App;
