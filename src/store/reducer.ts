import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import type { AppThunk } from './index';

type Place = {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number;
  previewImage?: string;
  isFavorite?: boolean;
  image?: string;
  isPremium?: boolean;
  description?: string;
  city?: { name: string; location: { latitude: number; longitude: number } };
  location?: { latitude: number; longitude: number };
};

type State = {
  activeCity: string;
  offers: Place[];
  loading: boolean;
  error?: string | null;
};

const initialState: State = {
  activeCity: 'Paris',
  offers: [],
  loading: false,
  error: null,
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
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setCity, setOffers, setLoading, setError } = slice.actions;

export const fetchOffers =
  (): AppThunk<Promise<void>> =>
    async (dispatch, _getState, api: AxiosInstance): Promise<void> => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const response = await api.get('/offers');
        dispatch(setOffers(response.data as Place[]));
      } catch (errUnknown) {
        let userMessage = 'Server is unavailable. Please try again later.';

        const err = errUnknown as { response?: { status?: number } };
        const status = err.response?.status ?? null;
        if (status === 401) {
          userMessage = 'Authorization required. Please sign in.';
        } else if (status === 403) {
          userMessage = 'Access denied.';
        } else if (status === 404) {
          userMessage = 'Requested data not found on the server.';
        }

        dispatch(setError(userMessage));
      } finally {
        dispatch(setLoading(false));
      }
    };

export default slice.reducer;
