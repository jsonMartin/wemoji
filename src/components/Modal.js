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


const Modal = ({ image, dismissModal }) => (
  <ModalWrapper onClick={(dismissModal)}>
    <img src={image} id="photo" height="100%" alt="The screen capture will appear in this box." /> }
    Lala
  </ModalWrapper>
);


function mapStateToProps(state) {
  const { image, showModal } = state;

  return { image, showModal };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    dismissModal: () => ({ type: 'DISMISS_MODAL' }),
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
