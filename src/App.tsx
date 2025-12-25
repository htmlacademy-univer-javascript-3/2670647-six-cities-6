import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Favorites from './pages/Favorites';
import Offer from './pages/Offer';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <Favorites />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<Offer />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
