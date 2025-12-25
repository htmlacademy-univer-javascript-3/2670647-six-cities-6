import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import CommentForm from '../../components/CommentForm/CommentForm';
import ReviewsList from '../../components/Reviews/ReviewsList';
import Map from '../../components/Map/Map';
import Header from '../../components/Header/Header';
import PlaceCard from '../../components/PlaceCard/PlaceCard';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchOfferDetails } from '../../store/reducer';

const Offer = () => {
  const { id } = useParams();
  const offerId = id ?? '';
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentOffer: offer,
    comments: reviews,
    nearbyOffers: nearby,
    offerLoading,
    offerNotFound,
    authorizationStatus: authStatus,
  } = useSelector((s: RootState) => s.app);

  useEffect(() => {
    if (offerId) {
      void dispatch(fetchOfferDetails(offerId));
    }
  }, [dispatch, offerId]);

  if (offerNotFound) {
    return <Navigate to="/404" replace />;
  }

  if (offerLoading || !offer) {
    return (
      <div className="page page--loading">
        <main className="page__main">
          <h2>Loading...</h2>
        </main>
      </div>
    );
  }

  const reviewsForList = reviews.map((r) => ({
    id: r.id,
    user: {
      name: r.user.name ?? 'User',
      avatar: r.user.avatarUrl ?? r.user.avatar ?? '',
    },
    rating: r.rating,
    text: r.comment ?? '',
    date: r.date,
  }));

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {(offer.images || []).map((img) => (
                <div key={img} className="offer__image-wrapper">
                  <img className="offer__image" src={img} alt="Photo studio" />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium ? (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              ) : null}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer ? offer.title : 'Offer'}</h1>
                {/* Favorite button */}
                <div className="offer__bookmark-button-wrapper">
                  <FavoriteButton
                    offerId={offer.id}
                    isFavorite={Boolean(offer.isFavorite)}
                    className={`offer__bookmark-button button ${
                      offer.isFavorite ? 'offer__bookmark-button--active' : ''
                    }`}
                  />
                </div>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: '80%' }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">4.8</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer?.price}</b>
                <span className="offer__price-text"> &nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {(offer.goods || []).map((g) => (
                    <li key={g} className="offer__inside-item">
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper ${
                      offer.host?.isPro ? 'offer__avatar-wrapper--pro' : ''
                    } user__avatar-wrapper`}
                  >
                    {offer.host?.avatarUrl ? (
                      <img
                        className="offer__avatar user__avatar"
                        src={offer.host.avatarUrl}
                        width={74}
                        height={74}
                        alt="Host avatar"
                      />
                    ) : (
                      <div className="offer__avatar user__avatar" />
                    )}
                  </div>
                  <span className="offer__user-name">{offer.host?.name}</span>
                  {offer.host?.isPro ? (
                    <span className="offer__user-status">Pro</span>
                  ) : null}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{offer.description}</p>
                </div>
              </div>
              <ReviewsList reviews={reviewsForList} />
              {authStatus === 'AUTH' ? <CommentForm offerId={offerId} /> : null}
            </div>
          </div>
          {nearby.length > 0 ? (
            <div style={{ marginTop: '16px' }}>
              <Map
                places={nearby}
                cityName={offer.city?.name}
                containerClassName="offer__map map"
                height="400px"
              />
            </div>
          ) : (
            <div className="offer__map map" style={{ marginTop: '16px' }}>
              No nearby places to show on map.
            </div>
          )}
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <div className="near-places__list places__list">
              {nearby.map((p) => (
                <PlaceCard key={p.id} place={p} classNamePrefix="near-places" />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Offer;
