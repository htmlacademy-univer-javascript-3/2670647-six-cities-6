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
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN';
  userEmail?: string | null;
};

const initialState: State = {
  activeCity: 'Paris',
  offers: [],
  loading: false,
  error: null,
  authorizationStatus: 'NO_AUTH',
  userEmail: null,
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
    setAuthorizationStatus(
      state,
      action: PayloadAction<'AUTH' | 'NO_AUTH' | 'UNKNOWN'>
    ) {
      state.authorizationStatus = action.payload;
    },
    setUserEmail(state, action: PayloadAction<string | null>) {
      state.userEmail = action.payload;
    },
    signOut(state) {
      state.authorizationStatus = 'NO_AUTH';
      state.userEmail = null;
    },
  },
});

export const {
  setCity,
  setOffers,
  setLoading,
  setError,
  setAuthorizationStatus,
  setUserEmail,
  signOut,
} = slice.actions;

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

export const checkAuth =
  (): AppThunk<Promise<void>> =>
    async (dispatch, _getState, api: AxiosInstance): Promise<void> => {
      try {
      type AuthInfo = { email?: string; token?: string };
      const response = await api.get<AuthInfo>('/login');
      if (response.status === 200) {
        const email = response.data?.email ?? null;
        dispatch(setUserEmail(email));
        dispatch(setAuthorizationStatus('AUTH'));
        return;
      }
      } catch (err) {
      // fallthrough to NO_AUTH
      }
      dispatch(setAuthorizationStatus('NO_AUTH'));
    };

export const login =
  (email: string, password: string): AppThunk<Promise<boolean>> =>
    async (dispatch, _getState, api: AxiosInstance): Promise<boolean> => {
      dispatch(setError(null));
      try {
      type AuthInfo = { email?: string; token?: string };
      const response = await api.post<AuthInfo>('/login', { email, password });
      if (response.status >= 200 && response.status < 300) {
        const token = response.data?.token ?? null;
        if (token) {
          try {
            localStorage.setItem('six-cities-token', token);
          } catch {
            void 0;
          }
        }
        dispatch(setUserEmail(email));
        dispatch(setAuthorizationStatus('AUTH'));
        return true;
      }
      } catch (errUnknown) {
        const err = errUnknown as {
        response?: { status?: number; data?: unknown };
      };
        const status = err.response?.status ?? null;
        const dataUnknown = err.response?.data;
        if (status === 400) {
          let message = 'Bad request';
          if (typeof dataUnknown === 'object' && dataUnknown !== null) {
            const obj = dataUnknown as Record<string, unknown>;
            if (Array.isArray(obj.details) && obj.details.length > 0) {
              const parts: string[] = [];
              for (const d of obj.details as unknown[]) {
                if (typeof d === 'object' && d !== null) {
                  const item = d as Record<string, unknown>;
                  if (Array.isArray(item.messages)) {
                    const msgs = (item.messages as unknown[]).filter(
                      (m): m is string => typeof m === 'string'
                    );
                    if (msgs.length) {
                      parts.push(msgs.join(', '));
                    }
                  } else if (typeof item.message === 'string') {
                    parts.push(item.message);
                  }
                }
              }
              if (parts.length > 0) {
                message = parts.join('; ');
              }
            } else if (typeof obj.message === 'string') {
              message = obj.message;
            } else if (typeof obj.error === 'string') {
              message = obj.error;
            }
          }
          dispatch(setError(message));
          return false;
        }
        if (typeof dataUnknown === 'object' && dataUnknown !== null) {
          const obj = dataUnknown as Record<string, unknown>;
          if (typeof obj.message === 'string') {
            dispatch(setError(obj.message));
            return false;
          }
          if (typeof obj.error === 'string') {
            dispatch(setError(obj.error));
            return false;
          }
        }
        dispatch(setError('Login failed. Try again later.'));
        return false;
      }
      return false;
    };

export default slice.reducer;
