/* IoC Container */
import 'reflect-metadata';
import { Sequelize } from 'sequelize';
import { Container } from 'inversify';

import { SERVICE_IDENTIFIER } from '../../constants';
import ServerConfig from '../../configs/server.config';

import {
  sequelize,
  initModels,
  initAssociation,
} from '../../db/models/index.model';

import {
  DefaultService,
  AuthService,
  PostService,
  CategoryService,
  UnsplashProvider,
} from '../../services';

const container = new Container();

export const setupSequelize = async (): Promise<Sequelize> => {
  await initModels(sequelize);
  await initAssociation();
  return sequelize;
};

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

container
  .bind<UnsplashProvider>(SERVICE_IDENTIFIER.UNSPLASH_PROVIDER)
  .to(UnsplashProvider);

export default container;
