/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion */
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

function makeMockStore(state: unknown, dispatchMock?: (a: any) => any) {
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch: (dispatchMock ?? (() => ({}))) as any,
  } as any;
}

describe('Header', () => {
  it('shows sign in when NO_AUTH', () => {
    const store = makeMockStore({
      app: { authorizationStatus: 'NO_AUTH', offers: [] },
    });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });

  it('dispatches logout when clicking sign out', () => {
    const dispatched: any[] = [];
    const store = makeMockStore(
      {
        app: { authorizationStatus: 'AUTH', userEmail: 'a@b.com', offers: [] },
      },
      (a: any) => dispatched.push(a)
    );
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Header />
        </MemoryRouter>
      </Provider>
    );
    const signOut = screen.getByText(/Sign out/i);
    fireEvent.click(signOut);
    expect(dispatched.length).toBeGreaterThan(0);
  });
});
