import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';
import createAPI from '../api';
import { AxiosInstance } from 'axios';

const api = createAPI();

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: api } }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<Result = void> = (
  dispatch: AppDispatch,
  getState: () => RootState,
  api: AxiosInstance
) => Result;

export default store;
