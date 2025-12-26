/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion */
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

function makeMockStore(state: unknown) {
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch: () => ({} as any),
  } as any;
}

describe('PrivateRoute', () => {
  it('renders children when AUTH', () => {
    const store = makeMockStore({ app: { authorizationStatus: 'AUTH' } });
    render(
      <Provider store={store as any}>
        <MemoryRouter initialEntries={['/']}>
          <PrivateRoute>
            <div>Protected</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Protected')).toBeInTheDocument();
  });

  it('redirects to /login when NO_AUTH', () => {
    const store = makeMockStore({ app: { authorizationStatus: 'NO_AUTH' } });
    render(
      <Provider store={store as any}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/login" element={<div>Login</div>} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div>Protected</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('returns nothing while UNKNOWN', () => {
    const store = makeMockStore({ app: { authorizationStatus: 'UNKNOWN' } });
    const { container } = render(
      <Provider store={store as any}>
        <MemoryRouter>
          <PrivateRoute>
            <div>Protected</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    );
    expect(container.firstChild).toBeNull();
  });
});
