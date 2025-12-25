import React, { useState, useRef, useEffect } from 'react';

export type SortType =
  | 'Popular'
  | 'Price: low to high'
  | 'Price: high to low'
  | 'Top rated first';

type Props = {
  value: SortType;
  onChange: (v: SortType) => void;
};

const OPTIONS: SortType[] = [
  'Popular',
  'Price: low to high',
  'Price: high to low',
  'Top rated first',
];

const SortOptions: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <form className="places__sorting" action="#" method="get" ref={ref}>
      <span className="places__sorting-caption">Sort by </span>
      <span
        className={`places__sorting-type ${
          open ? 'places__sorting-type--opened' : ''
        }`}
        tabIndex={0}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((s) => !s);
          }
        }}
      >
        {value}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>

      <ul
        className={`places__options places__options--custom ${
          open ? 'places__options--opened' : ''
        }`}
      >
        {OPTIONS.map((o) => (
          <li
            key={o}
            className={`places__option ${
              o === value ? 'places__option--active' : ''
            }`}
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault();
              onChange(o);
              setOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(o);
                setOpen(false);
              }
            }}
          >
            {o}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default SortOptions;
