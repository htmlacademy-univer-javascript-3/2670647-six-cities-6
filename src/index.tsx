import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { fetchOffers, checkAuth } from './store/reducer';
import { Provider } from 'react-redux';
import store from './store';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = ReactDOM.createRoot(rootElement);

// Check auth first so PrivateRoute and Header know the status, then fetch offers
store.dispatch(checkAuth());
store.dispatch(fetchOffers());

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
