import React from 'react';

type ReviewProps = {
  id: string | number;
  user: { name: string; avatar: string };
  rating: number;
  text: string;
  date: string;
};

const Review: React.FC<ReviewProps> = ({ user, rating, text, date }) => (
  <li className="reviews__item">
    <div className="reviews__user user">
      <div className="reviews__avatar-wrapper user__avatar-wrapper">
        <img
          className="reviews__avatar user__avatar"
          src={user.avatar}
          width={54}
          height={54}
          alt="Reviews avatar"
        />
      </div>
      <span className="reviews__user-name">{user.name}</span>
    </div>
    <div className="reviews__info">
      <div className="reviews__rating rating">
        <div className="reviews__stars rating__stars">
          <span style={{ width: `${(rating / 5) * 100}%` }}></span>
          <span className="visually-hidden">Rating</span>
        </div>
      </div>
      <p className="reviews__text">{text}</p>
      <time className="reviews__time" dateTime={date}>
        {date}
      </time>
    </div>
  </li>
);

export default Review;
