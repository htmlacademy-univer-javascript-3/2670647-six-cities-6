import Main from './pages/Main';

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
  <Main places={places} placesFound={placesFound} />
);

export default App;
