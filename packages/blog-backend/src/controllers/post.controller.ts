import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';

import { PostService } from '../services';
import logger from '../utils/logger';
import { RequestWithIdentity } from 'request.type';

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
      const resp = await this.postService.findAndCountAll({});
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