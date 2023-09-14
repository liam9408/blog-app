/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from '../types/category.type';
import { apiService } from '../services/api.service';

class CategoriesApi {
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = apiService.get('/categories');
        resolve(resp);
      } catch (err) {
        console.error('[Categories Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const categoriesApi = new CategoriesApi();
