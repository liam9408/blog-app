/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from '../services/api.service';
import { generateQuery } from 'src/utils/generate-query';
import { Image } from 'src/types/image.type';

class ImagesApi {
  async getImages(
    param?: string
  ): Promise<{ success: boolean; data: Image[] }> {
    return new Promise(async (resolve, reject) => {
      try {
        const query = {
          query: param,
        };
        const resp = apiService.get(`/images${generateQuery(query)}`);
        resolve(resp);
      } catch (err) {
        console.error('[Images Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const imagesApi = new ImagesApi();
