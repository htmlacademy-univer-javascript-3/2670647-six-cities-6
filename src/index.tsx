import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App
      places={[
        {
          id: 1,
          title: 'Beautiful & luxurious apartment at great location',
          type: 'Apartment',
          price: 120,
          rating: 4,
          image: 'img/apartment-01.jpg',
          isPremium: true,
          isBookmarked: false,
        },
        {
          id: 2,
          title: 'Wood and stone place',
          type: 'Room',
          price: 80,
          rating: 4,
          image: 'img/room.jpg',
          isPremium: false,
          isBookmarked: true,
        },
        {
          id: 3,
          title: 'Canal View Prinsengracht',
          type: 'Apartment',
          price: 132,
          rating: 4,
          image: 'img/apartment-02.jpg',
          isPremium: false,
          isBookmarked: false,
        },
        {
          id: 4,
          title: 'Nice, cozy, warm big bed apartment',
          type: 'Apartment',
          price: 180,
          rating: 5,
          image: 'img/apartment-03.jpg',
          isPremium: true,
          isBookmarked: false,
        },
        {
          id: 5,
          title: 'Wood and stone place',
          type: 'Room',
          price: 80,
          rating: 4,
          image: 'img/room.jpg',
          isPremium: false,
          isBookmarked: true,
        },
      ]}
      placesFound={312}
    />
  </React.StrictMode>
);
