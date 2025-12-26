/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import MockAdapter from 'axios-mock-adapter';
import createAPI from '../api';
import {
  fetchOffers,
  checkAuth,
  login,
  logout,
  fetchOfferDetails,
  toggleFavorite,
} from './reducer';

const api = createAPI();
const mock = new MockAdapter(api);

function createMockStore() {
  const actions: any[] = [];
  const getState = () => ({ app: {} });
  const dispatch = async (action: any) => {
    if (typeof action === 'function') {
      return await action(dispatch, getState, api);
    }
    actions.push(action);
    return action;
  };
  return { getActions: () => actions, dispatch, getState };
}

describe('async thunks', () => {
  afterEach(() => mock.reset());

  it('fetchOffers dispatches setOffers on success', async () => {
    const offers = [{ id: '1', title: 'a', type: 'x', price: 1, rating: 4 }];
    mock.onGet('/offers').reply(200, offers);
    const store = createMockStore();
    await store.dispatch(fetchOffers());
    const actions = store.getActions().map((a: any) => a.type);
    expect(actions).toContain('app/setOffers');
  });

  it('checkAuth sets AUTH when server returns 200', async () => {
    mock.onGet('/login').reply(200, { email: 'a@b.com' });
    const store = createMockStore();
    await store.dispatch(checkAuth());
    const actions = store.getActions().map((a: any) => a.type);
    expect(actions).toContain('app/setAuthorizationStatus');
  });

  it('login stores token and sets AUTH on success', async () => {
    mock.onPost('/login').reply(200, { token: 'tok' });
    const store = createMockStore();
    const success = await store.dispatch(login('a@b.com', 'p'));
    expect(success).toBe(true);
  });

  it('logout calls DELETE /logout and dispatches signOut', async () => {
    mock.onDelete('/logout').reply(204);
    const store = createMockStore();
    await store.dispatch(logout());
    const actions = store.getActions().map((a: any) => a.type);
    expect(actions).toContain('app/signOut');
  });

  it('fetchOfferDetails loads offer/comments/nearby', async () => {
    const id = 'o1';
    mock
      .onGet(`/offers/${id}`)
      .reply(200, { id, title: 't', type: 'a', price: 1, rating: 1 });
    mock.onGet(`/comments/${id}`).reply(200, []);
    mock.onGet(`/offers/${id}/nearby`).reply(200, []);
    const store = createMockStore();
    await store.dispatch(fetchOfferDetails(id));
    const actions = store.getActions().map((a: any) => a.type);
    expect(actions).toContain('app/setCurrentOffer');
    expect(actions).toContain('app/setComments');
    expect(actions).toContain('app/setNearbyOffers');
  });

  it('toggleFavorite posts favorite and dispatches updateOffer', async () => {
    const id = '1';
    mock
      .onPost(`/favorite/${id}/1`)
      .reply(200, { id, title: 't', type: 'a', price: 1, rating: 1 });
    const store = createMockStore();
    const res = await store.dispatch(toggleFavorite(id, 1));
    expect(res).toBe(true);
    const actions = store.getActions().map((a: any) => a.type);
    expect(actions).toContain('app/updateOffer');
  });
});
