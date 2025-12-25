import Header from '../../components/Header';
// Tabs removed — city selection is handled by CitiesList
import PlacesList from '../../components/PlacesList/PlacesList';
import Map from '../../components/Map/Map';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import CitiesList from '../../components/CitiesList/CitiesList';

const Main = () => {
  const activeCity = useSelector((s: RootState) => s.app.activeCity);
  const offers = useSelector((s: RootState) => s.app.offers);
  const places = offers.filter((p) => p.city?.name === activeCity);
  const placesFound = places.length;

  return (
    <div className="page page--gray page--main">
      <Header />
      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <CitiesList currentCity={activeCity} />

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {placesFound} places to stay in {activeCity}
              </b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>{' '}
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use xlinkHref="#icon-arrow-select"></use>
                  </svg>
                </span>
                <ul className="places__options places__options--custom places__options--opened">
                  <li
                    className="places__option places__option--active"
                    tabIndex={0}
                  >
                    Popular
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: low to high
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: high to low
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Top rated first
                  </li>
                </ul>
              </form>

              <PlacesList places={places} />
            </section>
            <div className="cities__right-section">
              <Map places={places} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
