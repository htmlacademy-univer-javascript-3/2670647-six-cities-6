/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner/Spinner';
import MainEmpty from './MainEmpty/MainEmpty';
import Review from './Reviews/Review';

describe('simple components rendering', () => {
  it('renders spinner', () => {
    render(<Spinner />);
    expect(document.querySelector('.spinner')).toBeTruthy();
  });

  it('renders main empty with city', () => {
    render((<MainEmpty city="Amsterdam" />) as any);
    expect(
      screen.getByText(/No places to stay available/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Amsterdam/)).toBeInTheDocument();
  });

  it('renders review item', () => {
    const r = {
      id: 1,
      user: { name: 'U' },
      rating: 4,
      text: 'ok',
      date: '2020-01-01',
    } as any;
    render((<Review {...r} />) as any);
    expect(screen.getByText(/ok/)).toBeInTheDocument();
  });
});
