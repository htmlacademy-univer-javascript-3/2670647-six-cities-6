import React from 'react';
import Header from '../../components/Header/Header';
import PlacesList from '../../components/PlacesList/PlacesList';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchFavorites } from '../../store/reducer';

const Favorites: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const places = useSelector((s: RootState) => s.app.favorites ?? []);

  React.useEffect(() => {
    void dispatch(fetchFavorites());
  }, [dispatch]);

  const grouped = places.reduce<Record<string, typeof places>>((acc, p) => {
    const city = p.city?.name ?? 'Unknown';
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(p);
    return acc;
  }, {});

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            {places.length === 0 ? (
              <div className="favorites__status">Nothing yet saved</div>
            ) : (
              <ul className="favorites__list">
                {Object.entries(grouped).map(([city, items]) => (
                  <li key={city} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link" href="/">
                          <span>{city}</span>
                        </a>
                      </div>
                    </div>
                    <div className="favorites__places">
                      <PlacesList places={items} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <footer className="footer container">
        <a className="footer__logo-link" href="/">
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </a>
      </footer>
    </div>
  );
};

export default Favorites;
