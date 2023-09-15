/* eslint-disable @typescript-eslint/no-explicit-any */
import { Post } from '../types/posts.type';
import { apiService } from '../services/api.service';
import { generateQuery } from '../utils/generate-query';

interface GetPostsQuery {
  category?: string[];
  offset: number;
  limit: number;
}

class PostsApi {
  async getPosts(
    queryObj?: GetPostsQuery
  ): Promise<{ success: boolean; data: { count: number; rows: Post[] } }> {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = apiService.get(`/posts${generateQuery(queryObj)}`);
        resolve(resp);
      } catch (err) {
        console.error('[Posts Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async getPost(postId: string): Promise<{ success: boolean; data: Post }> {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = apiService.get(`/posts/${postId}`);
        resolve(resp);
      } catch (err) {
        console.error('[Posts Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async editPost(
    postId: number,
    data: Post
  ): Promise<{ success: boolean; data: Post }> {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = apiService.put(`/posts/${postId}`, { ...data });
        resolve(resp);
      } catch (err) {
        console.error('[Posts Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const postApi = new PostsApi();
