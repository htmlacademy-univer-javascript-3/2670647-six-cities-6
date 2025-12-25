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
};

const PlacesList: React.FC<Props> = ({ places }) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="cities__places-list places__list tabs__content">
      {places.map((p) => (
        <div key={p.id} data-active={activeId === p.id}>
          <PlaceCard
            place={p}
            onMouseEnter={() => setActiveId(p.id)}
            onMouseLeave={() => setActiveId(null)}
          />
        </div>
      ))}
    </div>
  );
};

export default PlacesList;
