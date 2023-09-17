import './environment';

import App from './app';

import {
  DefaultRoute,
  AuthRoute,
  PostRoute,
  CategoryRoute,
  ImageRoute,
} from './routes';

const app = new App([
  new DefaultRoute(),
  new AuthRoute(),
  new PostRoute(),
  new CategoryRoute(),
  new ImageRoute(),
]);

app.listen();
