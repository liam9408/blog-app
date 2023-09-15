import { useEffect, useState, useCallback } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import { Box, Container, Typography } from '@mui/material';

import { AuthGuard } from 'src/components/organisms/AuthGuard';
import { DashboardLayout } from 'src/layout/dashboard/vertical-layout';
import { postApi } from 'src/api/posts-api';
import { useMounted } from 'src/hooks/use-mounted';
import { useAuth } from 'src/hooks/use-auth';
import {
  BlogPostCard,
  BlogPostCardSkeleton,
} from 'src/components/organisms/BlogPostCard';

const Posts: NextPage = () => {
  const isMounted = useMounted();

  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(0);
  const [postsPerPage, setPostsPerPage] = useState<number>(10);

  const getPosts = useCallback(async () => {
    try {
      setLoading(true);
      const query = {
        limit: postsPerPage,
        offset: page,
      };
      const resp = await postApi.getPosts(query);
      if (resp.success) {
        setPosts(resp.data.rows);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [isMounted]);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            pt: '30px',
            pb: '60px',
          }}
        >
          <Typography variant="h3" sx={{ mb: 6 }}>
            Good to see you, {user.firstName} !
          </Typography>

          {loading && <BlogPostCardSkeleton />}
          {!loading &&
            posts.map((post, i) => {
              return (
                <BlogPostCard
                  key={`post-${i}`}
                  id={post.id}
                  authorAvatar=""
                  authorName={post.user.firstName + post.user.lastName}
                  category={post.category.name}
                  cover=""
                  publishedAt={new Date(post.createdAt).getTime()}
                  readTime={'3 min'}
                  shortDescription={post.description}
                  title={post.title}
                />
              );
            })}
        </Container>
      </Box>
    </>
  );
};

Posts.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Posts;
