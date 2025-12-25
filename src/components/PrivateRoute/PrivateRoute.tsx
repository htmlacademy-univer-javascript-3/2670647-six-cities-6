import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: JSX.Element;
};

const isAuthenticated = false; // пока всегда не авторизован

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
