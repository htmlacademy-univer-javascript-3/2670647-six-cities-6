import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';
import { toggleFavorite } from '../../store/reducer';

type Props = {
  offerId: string;
  isFavorite?: boolean;
  className?: string;
};

export const FavoriteButton: React.FC<Props> = ({
  offerId,
  isFavorite = false,
  className,
}) => {
  const auth = useSelector((s: RootState) => s.app.authorizationStatus);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (auth !== 'AUTH') {
      navigate('/login');
      return;
    }
    void dispatch(toggleFavorite(offerId, isFavorite ? 0 : 1));
  }, [auth, navigate, dispatch, offerId, isFavorite]);

  return (
    <button className={className} type="button" onClick={handleClick}>
      <svg className="place-card__bookmark-icon" width="18" height="19">
        <use xlinkHref="#icon-bookmark"></use>
      </svg>
      <span className="visually-hidden">
        {isFavorite ? 'In bookmarks' : 'To bookmarks'}
      </span>
    </button>
  );
};

export const FavoriteButtonMemo = React.memo(FavoriteButton);
export default FavoriteButtonMemo;
