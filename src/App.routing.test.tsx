import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

describe('App routing', () => {
  it('renders Main at /', () => {
    window.history.pushState({}, 'Test', '/');
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText(/Cities/i)).toBeInTheDocument();
  });

  it('renders Login at /login', () => {
    window.history.pushState({}, 'Test', '/login');
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(
      screen.getByRole('heading', { name: /Sign in/i })
    ).toBeInTheDocument();
  });

  it('renders NotFound at unknown route', () => {
    window.history.pushState({}, 'Test', '/some/unknown');
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });
});
