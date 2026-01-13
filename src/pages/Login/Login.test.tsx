import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../store/reducer';
import Login from './Login';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Login page random city quick link', () => {
  let store: ReturnType<typeof configureStore>;
  const originalMathRandom = Math.random;

  beforeEach(() => {
    Math.random = () => 0;
    store = configureStore({ reducer: { app: reducer } });
  });

  afterEach(() => {
    Math.random = originalMathRandom;
    vi.clearAllMocks();
  });

  it('dispatches setCity with a random city and navigates to / when clicked', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    const link = screen.getByText(/Random city/i);
    expect(link).toBeInTheDocument();

    fireEvent.click(link);

    expect(mockNavigate).toHaveBeenCalledWith('/');

    const state = store.getState();
    expect((state as any).app.activeCity).toBe('Paris');
  });
});
