import React, { Component } from 'react';
import styled from 'styled-components';

import Input from './components/Input.js';

const Header = styled.header`
  height: 5vh;
  background-color: aqua;
`;

const Section = styled.section`
  height: 80vh;
  background-color: green;
`;

const Footer = styled.section`
  height: 15vh;
  background-color: blue;
`;
class App extends Component {
  constructor() {
    super();
    console.log('hi');
  }
  render() {
    return (
      <div className="App">
        <Header>
          I'm the header
        </Header>
        <Section>
          <Input />
          The picture will go here
        </Section>
        <Footer>
          The take image button goes here
        </Footer>
      </div>
    );
  }
}

export default App;
