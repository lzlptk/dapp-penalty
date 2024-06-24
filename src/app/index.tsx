import { BrowserRouter, HashRouter } from 'react-router-dom';
import AppRoutes from '@/app/AppRoutes';

// This is a workaround for GitHub Pages. It doesn't support browser history routing.
const App = () => {
  return import.meta.env.MODE === 'production' ? (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  ) : (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
