import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Place = {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number;
  previewImage?: string;
  isPremium?: boolean;
  isFavorite?: boolean;
  city?: { name: string; location: { latitude: number; longitude: number } };
  location?: { latitude: number; longitude: number };
  description?: string;
};

type State = {
  activeCity: string;
  offers: Place[];
  loading: boolean;
  error?: string | null;
};

const initialState: State = {
  // default city per task: Paris
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

export const { setCity, setOffers, setLoading } = slice.actions;

// include setError in exports
export const { setError } = slice.actions as any;

// Thunk to fetch offers from server
export const fetchOffers =
  () => async (dispatch: any, _getState: any, api: any) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await api.get('/offers');
      dispatch(setOffers(response.data));
    } catch (err: any) {
      // Log full error details for debugging (not shown to user)
      // eslint-disable-next-line no-console
      console.error('fetchOffers error:', err);

      // Compose a generic user-friendly message (do not expose internal error text)
      let userMessage = 'Server is unavailable. Please try again later.';

      // Optionally refine by HTTP status (kept generic per specification)
      const status = err?.response?.status;
      if (status === 401) {
        userMessage = 'Authorization required. Please sign in.';
      } else if (status === 403) {
        userMessage = 'Access denied.';
      } else if (status === 404) {
        // Keep message generic instead of showing raw "404"
        userMessage = 'Requested data not found on the server.';
      }

      dispatch(setError(userMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

export default slice.reducer;
