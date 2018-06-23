import React, { Component } from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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
          <AppBar position="static" color="secondary">
            <Toolbar>
              <Typography variant="title" color="primary" style={{ 'text-align': 'center' }}>
                WEMoJI
              </Typography>
            </Toolbar>
          </AppBar>
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
