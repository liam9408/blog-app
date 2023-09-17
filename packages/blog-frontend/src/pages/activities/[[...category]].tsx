/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Box, Container, Typography, TablePagination } from '@mui/material';

import { AuthGuard } from 'src/components/organisms/AuthGuard';
import { DashboardLayout } from 'src/layout/dashboard/vertical-layout';
import { postApi } from 'src/api/posts-api';
import { useMounted } from 'src/hooks/use-mounted';
import {
  BlogPostCard,
  BlogPostCardSkeleton,
} from 'src/components/organisms/BlogPostCard';
import { ToggleActivities } from 'src/components/molecules/ToggleActivities';

const Activities: NextPage = () => {
  const isMounted = useMounted();

  const router = useRouter();
  const { category } = router.query;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(0);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [postsPerPage, setPostsPerPage] = useState<number>(10);

  const getPosts = useCallback(
    async (offset: number, category?: string) => {
      try {
        setLoading(true);
        const query = {
          limit: postsPerPage,
          offset,
          category,
        };
        setTimeout(async () => {
          const resp = await postApi.getPosts(query);
          if (resp.success) {
            setPosts([...resp.data.rows]);
            setPostsCount(resp.data.count);
            setLoading(false);
          }
        }, 1000);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    },
    [isMounted]
  );

  const handlePageChange = (
    event: MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (router.isReady) {
      const queryCategory = category && encodeURIComponent(category[0]);
      const offset = page === 0 ? page : page * postsPerPage;
      getPosts(offset, queryCategory);
    }
  }, [router, postsPerPage, page]);

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
            pt: '20px',
            pb: '60px',
          }}
        >
          <ToggleActivities />
          {loading && (
            <>
              <BlogPostCardSkeleton />
              <BlogPostCardSkeleton />
              <BlogPostCardSkeleton />
            </>
          )}
          {!loading &&
            posts.map((post) => {
              return (
                <BlogPostCard
                  key={`post-${post.title}`}
                  id={post.id}
                  authorAvatar=""
                  authorName={post.user.firstName + post.user.lastName}
                  category={post.category.name}
                  cover={post.cover}
                  publishedAt={new Date(post.createdAt).getTime()}
                  readTime={post.readTimeMinutes}
                  shortDescription={post.description}
                  title={post.title}
                />
              );
            })}
          {posts.length === 0 && (
            <Box
              sx={{
                py: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'neutral.400',
                fontWeight: 300,
              }}
            >
              <Typography variant="h6">There are no posts</Typography>
            </Box>
          )}
          <TablePagination
            component="div"
            count={postsCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={(e): void => {
              setPostsPerPage(Number(e.target.value));
            }}
            page={page}
            rowsPerPage={10}
            rowsPerPageOptions={[10, 20]}
          />
        </Container>
      </Box>
    </>
  );
};

Activities.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Activities;
