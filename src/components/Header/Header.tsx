import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/reducer';

const Header = () => {
  const status = useSelector((s: RootState) => s.app.authorizationStatus);
  const email = useSelector((s: RootState) => s.app.userEmail);
  const favoritesCount = useSelector((s: RootState) => {
    const favs = s.app.favorites ?? null;
    if (Array.isArray(favs)) {
      return favs.length;
    }
    return s.app.offers.filter((o) => o.isFavorite).length;
  });
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              className="header__logo-link header__logo-link--active"
              to="/"
            >
              <img
                className="header__logo"
                src="img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              {status === 'AUTH' ? (
                <>
                  <li className="header__nav-item user">
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to="/favorites"
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__user-name user__name">
                        {email}
                      </span>
                      <span className="header__favorite-count">
                        {favoritesCount}
                      </span>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <Link
                      className="header__nav-link"
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        void dispatch(logout());
                      }}
                    >
                      <span className="header__signout">Sign out</span>
                    </Link>
                  </li>
                </>
              ) : (
                <li className="header__nav-item user">
                  <Link
                    className="header__nav-link header__nav-link--profile"
                    to="/login"
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__login">Sign in</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
