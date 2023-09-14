import './environment';

import App from './app';

import { DefaultRoute, AuthRoute } from './routes';

const app = new App([new DefaultRoute(), new AuthRoute()]);

app.listen();
