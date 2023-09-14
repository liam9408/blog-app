/* IoC Container */
import 'reflect-metadata';
import { Container } from 'inversify';

import { SERVICE_IDENTIFIER } from '../constants';
import ServerConfig from './server.config';

import {
  DefaultService,
  AuthService,
  PostService,
  CategoryService,
} from '../services';

const container = new Container();

container
  .bind<ServerConfig>(SERVICE_IDENTIFIER.SERVER_CONFIG)
  .to(ServerConfig)
  .inSingletonScope();

container
  .bind<DefaultService>(SERVICE_IDENTIFIER.DEFAULT_SERVICE)
  .to(DefaultService);

container.bind<AuthService>(SERVICE_IDENTIFIER.AUTH_SERVICE).to(AuthService);

container.bind<PostService>(SERVICE_IDENTIFIER.POST_SERVICE).to(PostService);

container
  .bind<CategoryService>(SERVICE_IDENTIFIER.CATEGORY_SERVICE)
  .to(CategoryService);

export default container;
