import React, { useMemo } from 'react';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import { Link } from 'react-router-dom';

type PlaceProps = {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number; // 0-5
  previewImage?: string;
  image?: string;
  isPremium?: boolean;
  isFavorite?: boolean;
};

type Props = {
  place: PlaceProps;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  classNamePrefix?: string;
};

const PlaceCard: React.FC<Props> = ({
  place,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  classNamePrefix = 'cities',
}) => {
  const prefix = classNamePrefix;
  const {
    id,
    title,
    type,
    price,
    rating,
    previewImage,
    image,
    isPremium,
    isFavorite,
  } = place;
  const ratingWidth = useMemo(
    () => `${(Math.round(rating) / 5) * 100}%`,
    [rating]
  );

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
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex={0}
      >
        <Link to={`/offer/${id}`}>
          <img
            className="place-card__image"
            src={previewImage ?? image ?? '/img/placeholder.svg'}
            width={260}
            height={200}
            alt={title}
          />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text"> &#47;&nbsp;night</span>
          </div>
          <FavoriteButton
            offerId={id}
            isFavorite={Boolean(isFavorite)}
            className={`place-card__bookmark-button ${
              isFavorite ? 'place-card__bookmark-button--active' : ''
            } button`}
          />
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

const MemoizedPlaceCard = React.memo(PlaceCard);

export default MemoizedPlaceCard;
