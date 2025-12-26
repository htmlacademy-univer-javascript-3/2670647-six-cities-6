/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion */
import { render, fireEvent } from '@testing-library/react';
import PlaceCard from './PlaceCard';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

function makeMockStore(state: unknown) {
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch: () => ({}),
  } as any;
}

const sample = {
  id: '1',
  title: 'Nice place',
  type: 'Apartment',
  price: 100,
  rating: 4,
  previewImage: '',
  isPremium: true,
  isFavorite: false,
};

describe('PlaceCard', () => {
  it('renders and calls handlers', () => {
    const onEnter = vi.fn();
    const onLeave = vi.fn();
    const store = makeMockStore({ app: { authorizationStatus: 'NO_AUTH' } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard
            place={sample}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          />
        </MemoryRouter>
      </Provider>
    );
    const wrapper = document.querySelector('.place-card__image-wrapper');
    expect(wrapper).toBeTruthy();
    if (wrapper) {
      fireEvent.mouseEnter(wrapper);
      fireEvent.mouseLeave(wrapper);
    }
    expect(onEnter).toHaveBeenCalled();
    expect(onLeave).toHaveBeenCalled();
  });
});
