import axios from 'axios';
import { injectable } from 'inversify';

import { SERVICE_IDENTIFIER } from '../../constants';
import iocContainer from '../../configs/ioc.config';
import HttpException from '../../exceptions/HttpException';
import ServerConfig from '../../configs/server.config';
import logger from '../../utils/logger';

@injectable()
class UnsplashProvider {
  public serverConfig: ServerConfig;

  private apiUrl: string;

  private unsplashAccessKey: string;

  constructor(
    serverConfig = iocContainer.get<ServerConfig>(
      SERVICE_IDENTIFIER.SERVER_CONFIG
    )
  ) {
    this.serverConfig = serverConfig;
    const { unsplashAccessKey } = serverConfig;
    this.apiUrl = 'https://api.unsplash.com';
    this.unsplashAccessKey = unsplashAccessKey;
  }

  public async getImages(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/photos?per_page=20`, {
        headers: {
          Authorization: `Client-ID ${this.unsplashAccessKey}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error.response.data);
      logger.error({
        level: 'error',
        label: 'Unsplash Provider - getImages',
        message: error.stack,
      });
      throw new HttpException(500, 30006, 'Unable to get images');
    }
  }
}

export default UnsplashProvider;
