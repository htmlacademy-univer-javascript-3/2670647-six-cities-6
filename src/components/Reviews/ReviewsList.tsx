import React from 'react';
import Review from './Review';

type ReviewItem = {
  id: string | number;
  user: { name: string; avatar: string };
  rating: number;
  text: string;
  date: string;
};

type Props = {
  reviews: ReviewItem[];
};

const ReviewsList: React.FC<Props> = ({ reviews }) => (
  <section className="offer__reviews reviews">
    <h2 className="reviews__title">
      Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
    </h2>
    <ul className="reviews__list">
      {(() => {
        const sorted = [...reviews].sort((a, b) => {
          const da = new Date(a.date).getTime() || 0;
          const db = new Date(b.date).getTime() || 0;
          return db - da;
        });
        const limited = sorted.slice(0, 10);
        return limited.map((r) => <Review key={r.id} {...r} />);
      })()}
    </ul>
  </section>
);

export default ReviewsList;
