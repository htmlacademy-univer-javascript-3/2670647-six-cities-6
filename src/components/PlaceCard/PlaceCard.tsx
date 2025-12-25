import React from 'react';
import { Link } from 'react-router-dom';

type PlaceProps = {
  id: number;
  title: string;
  type: string;
  price: number;
  rating: number; // 0-5
  image: string;
  isPremium?: boolean;
  isBookmarked?: boolean;
};

type Props = {
  place: PlaceProps;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  classNamePrefix?: string;
};

const PlaceCard: React.FC<Props> = ({
  place,
  onMouseEnter,
  onMouseLeave,
  classNamePrefix = 'cities',
}) => {
  const prefix = classNamePrefix;
  const { id, title, type, price, rating, image, isPremium, isBookmarked } =
    place;
  const ratingWidth = `${(rating / 5) * 100}%`;

  return (
    <article className={`${prefix}__card place-card`}>
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div
        className={`${prefix}__image-wrapper place-card__image-wrapper`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Link to={`/offer/${id}`}>
          <img
            className="place-card__image"
            src={image}
            width={260}
            height={200}
            alt="Place image"
          />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text"> &#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button ${
              isBookmarked ? 'place-card__bookmark-button--active' : ''
            } button`}
            type="button"
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {isBookmarked ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>

        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: ratingWidth }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <h2 className="place-card__name">
          <Link to={`/offer/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
};

export default PlaceCard;
