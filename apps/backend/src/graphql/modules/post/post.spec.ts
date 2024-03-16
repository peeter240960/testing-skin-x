import { authorizeGraphqlClient } from '@blogs/genql';

describe('Post', () => {
  describe('get posts', () => {
    test('should retrieve multiple posts matching the criteria successfully', async () => {
      const authClient = await authorizeGraphqlClient();
      const limit = 10;
      const posts = await authClient.query({
        getPosts: {
          __scalar: true,
          edges: {
            __scalar: true,
            postTags: {
              __scalar: true,
            },
          },
          __args: {
            limit,
          },
        },
      });

      const filterByTitle = async () => {
        const result = await authClient.query({
          getPosts: {
            __scalar: true,
            edges: {
              __scalar: true,
            },
            __args: {
              limit,
              search: posts.getPosts.edges[0].title,
            },
          },
        });
        return result.getPosts.edges?.[0].title ?? 'xxx';
      };

      const filterByTag = async () => {
        const result = await authClient.query({
          getPosts: {
            __scalar: true,
            edges: {
              __scalar: true,
              postTags: {
                __scalar: true,
              },
            },
            __args: {
              limit,
              searchByTag: posts.getPosts.edges[0].postTags?.[0]?.tagId,
            },
          },
        });
        return result.getPosts.edges?.[0]?.postTags?.[0]?.tagId ?? 'xxx';
      };


      expect(posts.getPosts.edges.length).toBe(limit);
      expect(filterByTitle()).resolves.toBe(posts.getPosts.edges[0].title);
      expect(filterByTag()).resolves.toBe(
        posts.getPosts.edges[0].postTags?.[0]?.tagId
      );
    });
  });
  describe('get post by id', () => {
    test('should retrieve an existing post successfully', async () => {
      const authClient = await authorizeGraphqlClient();
      const limit = 10;
      const posts = await authClient.query({
        getPosts: {
          __scalar: true,
          edges: {
            id: true,
          },
          __args: {
            limit,
          },
        },
      });
      const post = await authClient.query({
        getPost: {
          __scalar: true,
          postTags: {
            __scalar: true,
          },
          __args: {
            id: posts.getPosts.edges[0]?.id,
          },
        },
      });

      expect(post.getPost.id === posts.getPosts.edges[0].id).toBeTruthy();
      expect(post.getPost.title).toBeDefined();
      expect(post.getPost.content).toBeDefined();
      expect(post.getPost.postedAt).toBeDefined();
      expect(post.getPost.postedBy).toBeDefined();
      expect(post.getPost.postTags.length).toBeTruthy();
    });
  });
});
