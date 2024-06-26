import React from 'react';
import AppContainer from './app-container';
import { BrowserRouter } from 'react-router-dom'

const App = () => {
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

  return (
      <BrowserRouter basename={baseHref}>
        <AppContainer />
      </BrowserRouter>
  );
};

export default App;
