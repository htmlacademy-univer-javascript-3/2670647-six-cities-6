import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

export const selectOffers = (state: RootState) => state.app.offers;

export const selectOffersByCity = createSelector(
  [selectOffers, (_: RootState, city: string) => city],
  (offers, city) => offers.filter((o) => o.city?.name === city)
);

export const selectOfferById = createSelector(
  [selectOffers, (_: RootState, id: string) => id],
  (offers, id) => offers.find((o) => o.id === id) || null
);

export const selectNearby = createSelector(
  [selectOffers, (_: RootState, id: string) => id],
  (offers, id) => offers.filter((o) => o.id !== id).slice(0, 3)
);

export default {
  selectOffers,
  selectOffersByCity,
  selectOfferById,
  selectNearby,
};
