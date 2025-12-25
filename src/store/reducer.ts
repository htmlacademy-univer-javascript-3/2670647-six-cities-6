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
  city?: {
    name: string;
    location: { latitude: number; longitude: number; zoom?: number };
  };
  location?: { latitude: number; longitude: number; zoom?: number };
  bedrooms?: number;
  goods?: string[];
  host?: { name: string; avatarUrl?: string; isPro?: boolean };
  images?: string[];
  maxAdults?: number;
};

export type CommentItem = {
  id: string | number;
  user: { name: string; avatarUrl?: string; avatar?: string; isPro?: boolean };
  rating: number;
  comment: string;
  date: string;
};

type State = {
  activeCity: string;
  offers: Place[];
  loading: boolean;
  offerLoading: boolean;
  offerNotFound: boolean;
  currentOffer?: Place | null;
  comments: CommentItem[];
  nearbyOffers: Place[];
  error?: string | null;
  authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN';
  userEmail?: string | null;
};

const initialState: State = {
  activeCity: 'Paris',
  offers: [],
  loading: false,
  offerLoading: false,
  offerNotFound: false,
  currentOffer: null,
  comments: [],
  nearbyOffers: [],
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
    setCurrentOffer(state, action: PayloadAction<Place | null>) {
      state.currentOffer = action.payload;
    },
    setComments(state, action: PayloadAction<CommentItem[]>) {
      state.comments = action.payload;
    },
    addComment(state, action: PayloadAction<CommentItem>) {
      state.comments = [action.payload, ...state.comments];
    },
    setNearbyOffers(state, action: PayloadAction<Place[]>) {
      state.nearbyOffers = action.payload;
    },
    setOfferLoading(state, action: PayloadAction<boolean>) {
      state.offerLoading = action.payload;
    },
    setOfferNotFound(state, action: PayloadAction<boolean>) {
      state.offerNotFound = action.payload;
    },
    signOut(state) {
      state.authorizationStatus = 'NO_AUTH';
      state.userEmail = null;
    },
    updateOffer(state, action: PayloadAction<Place>) {
      const updated = action.payload;
      const idx = state.offers.findIndex((o) => o.id === updated.id);
      if (idx >= 0) {
        state.offers[idx] = updated;
      }
      if (state.currentOffer && state.currentOffer.id === updated.id) {
        state.currentOffer = updated;
      }
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
  setCurrentOffer,
  setComments,
  addComment,
  setNearbyOffers,
  setOfferLoading,
  setOfferNotFound,
  updateOffer,
  signOut,
} = slice.actions;

export const logout =
  (): AppThunk<Promise<void>> =>
    async (dispatch, _getState, api: AxiosInstance): Promise<void> => {
      try {
        await api.delete('/logout');
      } catch {
      // ignore errors on logout
      }
      try {
        localStorage.removeItem('six-cities-token');
      } catch {
        void 0;
      }
      dispatch(signOut());
    };

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

export const fetchOfferDetails =
  (id: string): AppThunk<Promise<void>> =>
    async (dispatch, _getState, api: AxiosInstance): Promise<void> => {
      dispatch(setOfferLoading(true));
      dispatch(setError(null));
      dispatch(setOfferNotFound(false));
      try {
        const [offerRes, commentsRes, nearbyRes] = await Promise.all([
          api.get(`/offers/${id}`),
          api.get(`/comments/${id}`),
          api.get(`/offers/${id}/nearby`),
        ]);

        dispatch(setCurrentOffer(offerRes.data as Place));
        dispatch(setComments(commentsRes.data as CommentItem[]));
        dispatch(setNearbyOffers(nearbyRes.data as Place[]));
      } catch (errUnknown) {
        const err = errUnknown as { response?: { status?: number } };
        const status = err.response?.status ?? null;
        if (status === 404) {
          dispatch(setOfferNotFound(true));
          return;
        }
        dispatch(setError('Failed to load offer details. Try again later.'));
      } finally {
        dispatch(setOfferLoading(false));
      }
    };

export const postComment =
  (
    offerId: string,
    rating: number,
    comment: string
  ): AppThunk<Promise<boolean>> =>
    async (dispatch, _getState, api: AxiosInstance): Promise<boolean> => {
      dispatch(setError(null));
      try {
        const response = await api.post(`/comments/${offerId}`, {
          rating,
          comment,
        });
        if (response.status >= 200 && response.status < 300) {
        // refresh comments list after successful post
          const commentsRes = await api.get(`/comments/${offerId}`);
          if (commentsRes.status === 200) {
            dispatch(setComments(commentsRes.data as CommentItem[]));
          }
          return true;
        }
      } catch (errUnknown) {
        const err = errUnknown as {
        response?: { status?: number; data?: unknown };
      };
        const status = err.response?.status ?? null;
        const dataUnknown = err.response?.data;
        if (
          status === 400 &&
        typeof dataUnknown === 'object' &&
        dataUnknown !== null
        ) {
          const obj = dataUnknown as Record<string, unknown>;
          if (typeof obj.message === 'string') {
            dispatch(setError(obj.message));
            return false;
          }
        }
        dispatch(setError('Failed to post comment. Try again later.'));
        return false;
      }
      return false;
    };

export const toggleFavorite =
  (offerId: string, status: 0 | 1): AppThunk<Promise<boolean>> =>
    async (dispatch, _getState, api: AxiosInstance): Promise<boolean> => {
      dispatch(setError(null));
      try {
        const response = await api.post(`/favorite/${offerId}/${status}`);
        if (response.status >= 200 && response.status < 300) {
          const updated = response.data as Place;
          dispatch(updateOffer(updated));
          return true;
        }
      } catch (errUnknown) {
        dispatch(setError('Failed to update favorite. Try again later.'));
        return false;
      }
      return false;
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
