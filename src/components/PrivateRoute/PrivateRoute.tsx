import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type PrivateRouteProps = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const status = useSelector((s: RootState) => s.app.authorizationStatus);
  const isAuth = status === 'AUTH';
  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
