import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { fetchOffers } from './store/reducer';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// fetch offers from server on startup
store.dispatch<any>(fetchOffers());

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
