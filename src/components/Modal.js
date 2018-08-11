import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Photo from './Photo.js';

const ModalWrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: pink;
  display: 'block';
  z-index: 1000;
`;


const Modal = ({ image, dismissModal, mode }) => (
  <ModalWrapper onClick={(dismissModal)}>
    <Photo />
  </ModalWrapper>
);


function mapStateToProps(state) {
  const { image, showModal, mode } = state;

  return { image, showModal, mode };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    dismissModal: () => ({ type: 'DISMISS_MODAL' }),
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
