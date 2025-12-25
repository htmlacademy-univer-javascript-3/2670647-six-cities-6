import Header from '../../components/Header';
import PlacesList from '../../components/PlacesList/PlacesList';
import Map from '../../components/Map/Map';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RootState } from '../../store';
import CitiesList from '../../components/CitiesList/CitiesList';
import SortOptions, {
  SortType,
} from '../../components/SortOptions/SortOptions';
import { useState, useMemo } from 'react';
import Spinner from '../../components/Spinner/Spinner';
import Notification from '../../components/Notification/Notification';
import { setError } from '../../store/reducer';

const Main = () => {
  const offers = useSelector((s: RootState) => s.app.offers);
  const activeCity = useSelector((s: RootState) => s.app.activeCity);
  const loading = useSelector((s: RootState) => s.app.loading);
  const error = useSelector((s: RootState) => s.app.error);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortType>('Popular');
  const dispatch = useDispatch();
  const [dismissed, setDismissed] = useState(false);

  const places = useMemo(() => {
    const filtered = offers.filter((p) => p.city?.name === activeCity);
    if (sortType === 'Popular') {
      return filtered;
    }
    if (sortType === 'Price: low to high') {
      return [...filtered].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }
    if (sortType === 'Price: high to low') {
      return [...filtered].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    // Top rated first
    return [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [offers, activeCity, sortType]);
  const placesFound = places.length;
  return (
    <div className="page page--gray page--main">
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <CitiesList currentCity={activeCity} />

        {error && !dismissed && (
          <Notification
            message={error}
            duration={2500}
            onClose={() => {
              setDismissed(true);
              dispatch(setError(null));
            }}
          />
        )}

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {placesFound} places to stay in {activeCity}
              </b>
              <SortOptions value={sortType} onChange={setSortType} />

              {loading ? (
                <Spinner />
              ) : (
                <PlacesList places={places} onActiveChange={setActiveId} />
              )}
            </section>
            <div className="cities__right-section">
              <Map
                places={places}
                cityName={activeCity}
                activeOfferId={activeId}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
