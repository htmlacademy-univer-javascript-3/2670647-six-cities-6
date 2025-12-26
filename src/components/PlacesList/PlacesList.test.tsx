/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion */
import { render, fireEvent } from '@testing-library/react';
import PlacesList from './PlacesList';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

function makeMockStore(state: unknown) {
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch: () => ({}),
  } as any;
}

const samplePlaces = [
  { id: '1', title: 'A', type: 'Studio', price: 10, rating: 4 } as any,
  { id: '2', title: 'B', type: 'Apartment', price: 20, rating: 3 } as any,
];

describe('PlacesList', () => {
  it('renders places and handles hover', () => {
    const store = makeMockStore({ app: { authorizationStatus: 'NO_AUTH' } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlacesList places={samplePlaces} />
        </MemoryRouter>
      </Provider>
    );
    const articles = document.querySelectorAll('.place-card');
    expect(articles.length).toBe(2);
    const first = articles[0];
    if (first) {
      fireEvent.mouseEnter(first);
      fireEvent.mouseLeave(first);
    }
  });
});
