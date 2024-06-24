import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from '@/app';
import store from '@/app/store';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
