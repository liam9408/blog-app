import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import logger from 'morgan';
import { Route } from './types/routes.type';

class App {
  public app: express.Application;

  public port: string | number;

  public env: boolean;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    try {
      this.app.listen(this.port, async () => {
        console.log(`🚀 App listening on the port ${this.port}`);
        try {
          // todo: db
          console.info(
            'Database Connection has been established successfully.'
          );
        } catch (error) {
          console.error('Unable to connect to the database:', error);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(logger('combined'));
    } else {
      this.app.use(logger('dev'));
    }
    this.app.use(express.urlencoded({ limit: '1000mb', extended: false }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.set('trust proxy', true);
  }
}

export default App;
