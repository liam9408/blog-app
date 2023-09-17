import iocTestContainer, {
  setupSequelize,
} from '../tests/configs/jest.ioc.config';
import { SERVICE_IDENTIFIER } from '../constants';
import PostService from './posts.service';

import CategoryModel from '../db/models/category.model';

const mockedPostModel = CategoryModel as jest.Mocked<any>;

describe('Unit Test: Post Service', () => {
  let postService: PostService;

  beforeAll(async () => {
    await setupSequelize();

    postService = iocTestContainer.get<PostService>(
      SERVICE_IDENTIFIER.POST_SERVICE
    );
  });

  const post = {
    id: 1,
    title: 'This is a test post',
    description: 'This is a test post description',
    categoryId: 1,
    cover: '',
    content: 'some content',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    readTimeMinutes: 3,
    category: { id: 1, name: 'test' },
    user: { id: 1, email: 'test@test.com' },
  };

  describe('findAndCountAll', () => {
    it('success', async () => {
      jest
        .spyOn(mockedPostModel, 'findAndCountAll')
        .mockImplementation(async () => {
          return { rows: [], count: 0 };
        });
      const resp = await postService.findAndCountAll();
      expect(resp.rows.length).toBeGreaterThanOrEqual(0);
      expect(resp.count).not.toBeNull();
    });

    it('error', async () => {
      jest
        .spyOn(mockedPostModel, 'findAndCountAll')
        .mockImplementation(async () => {
          throw new Error();
        });

      try {
        await postService.findAndCountAll();
      } catch (e) {
        expect(e).toEqual(expect.any(Error));
      }
    });
  });

  describe('findAll', () => {
    it('success', async () => {
      const postModelInstanceMock = {
        toJSON: jest.fn(() => post),
        map: jest.fn(() => [post]),
      };

      jest
        .spyOn(mockedPostModel, 'findAll')
        .mockResolvedValueOnce(postModelInstanceMock);

      const resp = await postService.findAll();
      expect(resp.length).toBeGreaterThanOrEqual(0);
    });

    it('error', async () => {
      jest.spyOn(mockedPostModel, 'findAll').mockImplementation(async () => {
        throw new Error();
      });
      return postService
        .findAll()
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('getPostById', () => {
    it('success', async () => {
      try {
        const postModelInstanceMock = {
          ...post,
          toJSON: jest.fn(() => post),
        };

        jest
          .spyOn(mockedPostModel, 'findByPk')
          .mockResolvedValueOnce(postModelInstanceMock);

        const resp = await postService.getPostById(post.id);
        expect(postService.postModel.findByPk).toHaveBeenCalledWith(post.id);
        expect(resp).not.toBeNull();
        expect(resp).toHaveProperty('id');
      } catch (err) {
        console.log(err);
      }
    });

    it('error', async () => {
      jest.spyOn(mockedPostModel, 'findByPk').mockImplementation(async () => {
        throw new Error();
      });
      return postService
        .getPostById(post.id)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('createPost', () => {
    it('success', async () => {
      const postModelInstanceMock = {
        toJSON: jest.fn(() => post),
      };

      jest
        .spyOn(mockedPostModel, 'create')
        .mockResolvedValueOnce(postModelInstanceMock);

      const resp = await postService.createPost({
        title: 'This is a test post',
        description: 'This is a test post description',
        userId: 1,
        categoryId: 1,
        cover: '',
        content: 'some content',
        status: 'draft',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        readTimeMinutes: 3,
      });
      expect(resp).not.toBeNull();
      expect(resp).toHaveProperty('id');
    });

    it('error', async () => {
      jest.spyOn(mockedPostModel, 'create').mockImplementation(async () => {
        throw new Error();
      });
      return postService
        .getPostById(post.id)
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('editPost', () => {
    it('success', async () => {
      try {
        jest.spyOn(mockedPostModel, 'update').mockImplementation(async () => {
          return [1, [post]];
        });
        const { count } = await postService.editPost(
          {
            ...post,
          },
          [post.id]
        );
        expect(count).not.toBeNull();
        expect(count).toEqual(1);
      } catch (err) {
        console.log(err);
      }
    });

    it('error', async () => {
      jest.spyOn(mockedPostModel, 'update').mockImplementation(async () => {
        throw new Error();
      });
      return postService
        .editPost(
          {
            ...post,
          },
          [post.id]
        )
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });

  describe('deletePost', () => {
    it('success', async () => {
      jest.spyOn(mockedPostModel, 'destroy').mockResolvedValueOnce(1);

      const { count } = await postService.delete([post.id]);
      expect(count).not.toBeNull();
    });

    it('error', async () => {
      jest.spyOn(mockedPostModel, 'destroy').mockImplementation(async () => {
        throw new Error();
      });
      return postService
        .delete([post.id])
        .catch((e) => expect(e).toEqual(expect.any(Error)));
    });
  });
});
