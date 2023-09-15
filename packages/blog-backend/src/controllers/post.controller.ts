import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { WhereOptions, Op } from 'sequelize';
import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import { PostService } from '../services';
import logger from '../utils/logger';
import { RequestWithIdentity } from 'request.type';
import { getPagination, getOrderOptions } from '../utils/sequelize';

@injectable()
class PostController {
  public postService: PostService;

  constructor(
    postService = iocContainer.get<PostService>(SERVICE_IDENTIFIER.POST_SERVICE)
  ) {
    this.postService = postService;
  }

  public getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { offset, limit, ...searchValues } = req.query;
      let sort: any = 'desc';
      let sortBy: any = 'createdAt';
      if (req.query) {
        sort = req.query.sort ? req.query.sort : sort;
        sortBy = req.query.sortBy ? req.query.sortBy : sortBy;
      }

      const searchParams: WhereOptions = {};

      for (const [searchByKey, searchByValue] of Object.entries(searchValues)) {
        switch (searchByKey) {
          case 'id':
            searchParams.id = String(searchByValue)
              .split(',')
              .map((val) => Number(val));
            break;
          case 'title':
            searchParams.description = {
              [Op.iLike]: `%${searchByValue}%`,
            };
            break;
          case 'status':
            searchParams.status = {
              [Op.in]: String(searchByValue).split(','),
            };
            searchParams.actionNeeded = false;
            break;
        }
      }

      const query = {
        ...searchParams,
        ...getPagination(limit, offset),
        ...getOrderOptions([{ sortKey: sortBy, sortOrder: sort }]),
      };

      const resp = await this.postService.findAndCountAll(query);
      if (resp) {
        res.status(200).json({ success: true, data: resp });
      }
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Post Controller',
        message: `Unable to get posts`,
      });
      next(error);
    }
  };

  public listPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.postService.findAll({});
      if (resp) {
        res.status(200).json({ success: true, data: resp });
      }
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Post Controller',
        message: `Unable to get posts`,
      });
      next(error);
    }
  };

  public getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = req.params;
      const resp = await this.postService.getPostById(Number(postId), {});
      if (resp) {
        res.status(200).json({ success: true, data: resp });
      }
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Post Controller',
        message: `Unable to get post`,
      });
      next(error);
    }
  };

  public createPost = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const { userId } = req;
      const dataToUpdate = {
        userId,
        ...body,
      };
      const resp = await this.postService.createPost(dataToUpdate);
      if (resp) {
        res.status(200).json({ success: true, data: resp });
      }
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Post Controller',
        message: `Unable to edit post`,
      });
      next(error);
    }
  };

  public editPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const { postId } = req.params;
      const dataToUpdate = {
        ...body,
      };

      console.log(dataToUpdate);
      const resp = await this.postService.editPost(dataToUpdate, [
        Number(postId),
      ]);
      if (resp) {
        res.status(200).json({ success: true, data: resp });
      }
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Post Controller',
        message: `Unable to edit post`,
      });
      next(error);
    }
  };

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postId } = req.params;
      const resp = await this.postService.delete([Number(postId)]);
      if (resp) {
        res.status(200).json({ success: true, data: resp });
      }
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Post Controller',
        message: `Unable to delete posts`,
      });
      next(error);
    }
  };
}

export default PostController;
