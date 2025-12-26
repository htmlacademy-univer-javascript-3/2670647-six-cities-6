/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import reducer, {
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
  signOut,
  updateOffer,
} from './reducer';

import type { CommentItem } from './reducer';

describe('app reducer', () => {
  it('should return the initial state when passed an empty action', () => {
    const state = reducer(undefined, { type: '' } as any);
    expect(state).toBeTruthy();
    expect(state.offers).toEqual([]);
    expect(state.authorizationStatus).toBe('NO_AUTH');
  });

  it('should handle setCity', () => {
    const prev = reducer(undefined, { type: '' } as any);
    const next = reducer(prev, setCity('Amsterdam'));
    expect(next.activeCity).toBe('Amsterdam');
  });

  it('should handle setOffers', () => {
    const offers = [
      { id: '1', title: 'T', type: 'apartment', price: 10, rating: 4 },
    ];
    const next = reducer(undefined, setOffers(offers as any));
    expect(next.offers).toEqual(offers);
  });

  it('should handle loading and error flags', () => {
    const s1 = reducer(undefined, setLoading(true));
    expect(s1.loading).toBe(true);
    const s2 = reducer(s1, setError('oops'));
    expect(s2.error).toBe('oops');
  });

  it('should handle auth and user email', () => {
    const s1 = reducer(undefined, setAuthorizationStatus('AUTH'));
    expect(s1.authorizationStatus).toBe('AUTH');
    const s2 = reducer(s1, setUserEmail('a@b.com'));
    expect(s2.userEmail).toBe('a@b.com');
    const s3 = reducer(s2, signOut());
    expect(s3.authorizationStatus).toBe('NO_AUTH');
    expect(s3.userEmail).toBeNull();
  });

  it('should handle current offer and comments', () => {
    const offer = {
      id: 'o1',
      title: 'X',
      type: 'room',
      price: 1,
      rating: 1,
    } as any;
    let s = reducer(undefined, setCurrentOffer(offer));
    expect(s.currentOffer).toEqual(offer);

    const comments: CommentItem[] = [
      {
        id: 1,
        user: { name: 'u' },
        rating: 5,
        comment: 'ok',
        date: '2020-01-01',
      },
    ];
    s = reducer(s, setComments(comments));
    expect(s.comments).toEqual(comments);

    const newComment: CommentItem = {
      id: 2,
      user: { name: 'v' },
      rating: 4,
      comment: 'nice',
      date: '2020-01-02',
    };
    s = reducer(s, addComment(newComment));
    expect(s.comments[0]).toEqual(newComment);
  });

  it('should handle nearby offers and offer loading/notfound', () => {
    const places = [
      { id: 'n1', title: 'n', type: 'apartment', price: 1, rating: 1 },
    ];
    let s = reducer(undefined, setNearbyOffers(places as any));
    expect(s.nearbyOffers).toEqual(places);
    s = reducer(s, setOfferLoading(true));
    expect(s.offerLoading).toBe(true);
    s = reducer(s, setOfferNotFound(true));
    expect(s.offerNotFound).toBe(true);
  });

  it('should update an existing offer via updateOffer', () => {
    const initialOffers = [
      { id: '1', title: 'old', type: 'a', price: 1, rating: 1 },
      { id: '2', title: 'keep', type: 'a', price: 2, rating: 2 },
    ] as any;
    let s = reducer(undefined, setOffers(initialOffers));
    const updated = {
      id: '1',
      title: 'new',
      type: 'a',
      price: 9,
      rating: 5,
    } as any;
    s = reducer(s, updateOffer(updated));
    expect(s.offers.find((o) => o.id === '1')?.title).toBe('new');
  });
});
