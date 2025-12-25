import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Place = {
  id: number;
  title: string;
  type: string;
  price: number;
  rating: number;
  image: string;
  isPremium?: boolean;
  isBookmarked?: boolean;
  city?: { name: string; location: { lat: number; lng: number } };
  description?: string;
};

type State = {
  activeCity: string;
  offers: Place[];
};

const initialState: State = {
  // default city per task: Paris
  activeCity: 'Paris',
  offers: [],
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCity(state, action: PayloadAction<string>) {
      state.activeCity = action.payload;
    },
    setOffers(state, action: PayloadAction<Place[]>) {
      state.offers = action.payload;
    },
  },
});

export const { setCity, setOffers } = slice.actions;
export default slice.reducer;
