import { Sequelize } from 'sequelize';

import { DialectOptions } from '../../types/sequelize.type';

import Users from './user.model';

console.info('Initializing sequelize...');

const sqlInitialize = () => {
  const dialectOptions: DialectOptions = {
    // e.g. socketPath: '/cloudsql/my-awesome-project:us-central1:my-cloud-sql-instance'
    // same as host string above
    socketPath: process.env.POSTGRES_HOST,
  };
  if (
    (process.env.NODE_ENV === 'local' &&
      process.env.POSTGRES_HOST !== 'localhost') ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'staging' ||
    process.env.NODE_ENV === 'production'
  ) {
    dialectOptions.ssl = {
      host: process.env.DB_HOST,
      ca: Buffer.from(process.env.POSTGRES_SSL_SERVER_CA, 'base64'),
      key: Buffer.from(process.env.POSTGRES_SSL_CLIENT_KEY, 'base64'),
      cert: Buffer.from(process.env.POSTGRES_SSL_CLIENT_CERT, 'base64'),
      rejectUnauthorized: false,
      requestCert: true,
    };
  }
  return new Sequelize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      logging: false,
      pool: {
        min: 0,
        max: 50,
        idle: 10000,
        acquire: 30000,
      },
      dialectOptions,
    }
  );
};

export const sequelize = sqlInitialize();

export const initModels = async (sequelizeInst: Sequelize) => {
  try {
    console.info('Initializing sequelize models...');
    await Users.initModel(sequelizeInst);
  } catch (error) {
    console.log(error);
  }
};

export const initAssociation = async () => {
  try {
    console.info('Initializing sequelize associations...');
    await Users.initAssociation();
  } catch (error) {
    console.log(error);
  }
};
