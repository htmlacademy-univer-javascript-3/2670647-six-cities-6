/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion */
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

function makeMockStore(state: unknown, dispatchMock?: (a: any) => any) {
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch: (dispatchMock ?? (() => ({}))) as any,
  } as any;
}

describe('FavoriteButton', () => {
  it('navigates to login when not auth', () => {
    const store = makeMockStore({ app: { authorizationStatus: 'NO_AUTH' } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/login" element={<div>Login</div>} />
            <Route
              path="/"
              element={
                <FavoriteButton
                  offerId="1"
                  isFavorite={false}
                  className="btn"
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('dispatches toggleFavorite when auth', () => {
    const dispatched: any[] = [];
    const store = makeMockStore(
      { app: { authorizationStatus: 'AUTH' } },
      (a: any) => dispatched.push(a)
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteButton offerId="1" isFavorite={false} className="btn" />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(dispatched.length).toBeGreaterThan(0);
  });
});
