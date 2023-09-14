import './environment';

import App from './app';

import { DefaultRoute, AuthRoute, PostRoute, CategoryRoute } from './routes';

const app = new App([
  new DefaultRoute(),
  new AuthRoute(),
  new PostRoute(),
  new CategoryRoute(),
]);

app.listen();
