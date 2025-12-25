import React from 'react';
import { useDispatch } from 'react-redux';
import { setCity } from '../../store/reducer';

const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];

type Props = {
  currentCity: string;
};

const CitiesList: React.FC<Props> = ({ currentCity }) => {
  const dispatch = useDispatch();

  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {CITIES.map((c) => (
          <li className="locations__item" key={c}>
            <a
              className={`locations__item-link tabs__item ${
                currentCity === c ? 'tabs__item--active' : ''
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setCity(c));
              }}
            >
              <span>{c}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CitiesList;
