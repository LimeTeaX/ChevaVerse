import { ThemeProvider } from './contexts/ThemeContext';
import MovieFinder from './pages/MovieFinder';

function App() {
  return (
    <ThemeProvider>
      <MovieFinder />
    </ThemeProvider>
  );
}

export default App;