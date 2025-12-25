import React, { useState, useCallback } from 'react';
import PlaceCard from '../PlaceCard/PlaceCard';

type Place = {
  id: string;
  title: string;
  type: string;
  price: number;
  rating: number;
  previewImage?: string;
  image?: string;
  isPremium?: boolean;
  isFavorite?: boolean;
};

type Props = {
  places: Place[];
  onActiveChange?: (id: string | null) => void;
};

const PlacesList: React.FC<Props> = ({ places, onActiveChange }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleEnter = useCallback(
    (id: string) => {
      setActiveId(id);
      onActiveChange?.(id);
    },
    [onActiveChange]
  );
  const handleLeave = useCallback(() => {
    setActiveId(null);
    onActiveChange?.(null);
  }, [onActiveChange]);

  return (
    <div className="cities__places-list places__list tabs__content">
      {places.map((p) => (
        <div key={p.id} data-active={activeId === p.id}>
          <PlaceCard
            place={p}
            onMouseEnter={() => handleEnter(p.id)}
            onMouseLeave={handleLeave}
            onFocus={() => handleEnter(p.id)}
            onBlur={handleLeave}
          />
        </div>
      ))}
    </div>
  );
};

export default PlacesList;
