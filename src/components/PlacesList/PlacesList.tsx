import React, { useState } from 'react';
import PlaceCard from '../PlaceCard/PlaceCard';

type Place = {
  id: number;
  title: string;
  type: string;
  price: number;
  rating: number;
  image: string;
  isPremium?: boolean;
  isBookmarked?: boolean;
};

type Props = {
  places: Place[];
  onActiveChange?: (id: number | null) => void;
};

const PlacesList: React.FC<Props> = ({ places, onActiveChange }) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleEnter = (id: number) => {
    setActiveId(id);
    onActiveChange?.(id);
  };
  const handleLeave = () => {
    setActiveId(null);
    onActiveChange?.(null);
  };

  return (
    <div className="cities__places-list places__list tabs__content">
      {places.map((p) => (
        <div key={p.id} data-active={activeId === p.id}>
          <PlaceCard
            place={p}
            onMouseEnter={() => handleEnter(p.id)}
            onMouseLeave={() => handleLeave()}
            onFocus={() => handleEnter(p.id)}
            onBlur={() => handleLeave()}
          />
        </div>
      ))}
    </div>
  );
};

export default PlacesList;
