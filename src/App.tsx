import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import Offer from './pages/Offer';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

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

type AppProps = {
  places: Place[];
  placesFound?: number;
};

export const App = ({ places, placesFound = 0 }: AppProps) => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={<Main places={places} placesFound={placesFound} />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <Favorites places={places} />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<Offer places={places} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
