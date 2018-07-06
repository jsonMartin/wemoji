import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from '../../../../Library/Caches/typescript/2.9/node_modules/redux';

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
    {mode === 'displayProcessedImage' && <img src={image} id="photo" height="100%" alt="The screen capture will appear in this box." />}
    {mode === 'processImage' && <img src={image} id="photo" height="100%" alt="The screen capture will appear in this box." />}
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
