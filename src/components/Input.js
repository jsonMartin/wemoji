import React, { Component } from 'react';

export default (props) => (
  <div>
      Input:
    <input type="file" accept="image/*" capture="camera" onChange={() => alert('I changed')} />
  </div>
);

