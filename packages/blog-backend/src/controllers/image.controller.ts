import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import logger from '../utils/logger';
import ServerConfig from '../configs/server.config';

import { UnsplashProvider } from '../services';

@injectable()
class ImagesController {
  public unsplashProvider = iocContainer.get<UnsplashProvider>(
    SERVICE_IDENTIFIER.UNSPLASH_PROVIDER
  );

  public getImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.unsplashProvider.getImages();
      const parsedImages = resp.map((imageObj) => ({
        thumbnail: imageObj.urls.small,
        image: imageObj.urls.small,
      }));
      if (resp) {
        res.status(200).json({ success: true, data: parsedImages });
      }
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Image Controller',
        message: `Unable to get images`,
      });
      next(error);
    }
  };
}

export default ImagesController;
