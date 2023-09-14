import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import { CategoryService } from '../services';
import logger from '../utils/logger';

@injectable()
class CategoryController {
  public categoryService: CategoryService;

  constructor(
    categoryService = iocContainer.get<CategoryService>(
      SERVICE_IDENTIFIER.CATEGORY_SERVICE
    )
  ) {
    this.categoryService = categoryService;
  }

  public getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.categoryService.findAll();
      if (resp) {
        res.status(200).json({ success: true, data: resp });
      }
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Category Controller',
        message: `Unable to get categories`,
      });
      next(error);
    }
  };
}

export default CategoryController;
