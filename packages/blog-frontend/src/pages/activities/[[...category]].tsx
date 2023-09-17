import { useEffect, useState, useCallback, MouseEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import {
  Box,
  Container,
  Typography,
  Button,
  TablePagination,
  // CircularProgress,
} from '@mui/material';

import { AuthGuard } from 'src/components/organisms/AuthGuard';
import { DashboardLayout } from 'src/layout/dashboard/vertical-layout';
import { postApi } from 'src/api/posts-api';
import { useMounted } from 'src/hooks/use-mounted';
// import { useScrollPosition } from 'src/hooks/use-scroll-position';
import {
  BlogPostCard,
  BlogPostCardSkeleton,
} from 'src/components/organisms/BlogPostCard';

const Activities: NextPage = () => {
  const isMounted = useMounted();

  const router = useRouter();
  const { category } = router.query;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(0);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [postsPerPage, setPostsPerPage] = useState<number>(10);
  // const [fetchingMore, setFetchingMore] = useState(false);
  // const [prevPosition, setPrevPosition] = useState(0);

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

  // const handleFetchMore = useCallback(
  //   async (offset?: number) => {
  //     try {
  //       setTimeout(async () => {
  //         const query = {
  //           limit: postsPerPage,
  //           offset: offset,
  //           category: category && category[0],
  //         };

  //         const resp = await postApi.getPosts(query);
  //         if (resp.success) {
  //           setPosts((prevPosts) => [...prevPosts, ...resp.data.rows]);
  //           setFetchingMore(false);
  //         }
  //       }, 2000);
  //     } catch (err) {
  //       console.error(err);
  //       setFetchingMore(false);
  //     }
  //   },
  //   [isMounted, router.query]
  // );

  // const scrollPosition = useScrollPosition();
  // useEffect(() => {
  //   if (scrollPosition > prevPosition) {
  //     const currentPositionRoudned = Math.round(scrollPosition);
  //     if (
  //       currentPositionRoudned >= 95 &&
  //       currentPositionRoudned <= 98 &&
  //       !fetchingMore
  //     ) {
  //       const newPage = page + 1;
  //       setPage(newPage);

  //       handlePagination(newPage * postsPerPage);
  //       setPrevPosition(scrollPosition);
  //       setFetchingMore(true);
  //     }
  //   }
  // }, [scrollPosition]);

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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 6,
            }}
          >
            <Typography variant="h5">Activities</Typography>
            <NextLink href="/post/new" passHref>
              <Button component="a" variant="contained">
                New Post
              </Button>
            </NextLink>
          </Box>

          {loading && (
            <>
              <BlogPostCardSkeleton />
              <BlogPostCardSkeleton />
              <BlogPostCardSkeleton />
            </>
          )}
          {!loading &&
            posts.map((post, i) => {
              return (
                <BlogPostCard
                  key={`post-${i}`}
                  id={post.id}
                  authorAvatar=""
                  authorName={post.user.firstName + post.user.lastName}
                  category={post.category.name}
                  cover={post.cover}
                  publishedAt={new Date(post.createdAt).getTime()}
                  readTime={'3 min'}
                  shortDescription={post.description}
                  title={post.title}
                />
              );
            })}
          {/* {fetchingMore && (
            <Box
              sx={{
                my: 5,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={40} />
            </Box>
          )} */}
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
