/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Box, Container, Typography, CircularProgress } from '@mui/material';

import { ToggleActivities } from 'src/components/molecules/ToggleActivities';
import { AuthGuard } from 'src/components/organisms/AuthGuard';
import { DashboardLayout } from 'src/layout/dashboard/vertical-layout';
import { postApi } from 'src/api/posts-api';
import { useMounted } from 'src/hooks/use-mounted';
import { useScrollPosition } from 'src/hooks/use-scroll-position';
import {
  UserBlogPostCard,
  UserBlogPostCardSkeleton,
} from 'src/components/organisms/UserBlogPostCard';

const Me: NextPage = () => {
  const isMounted = useMounted();

  const router = useRouter();
  const { category } = router.query;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(0);
  const [isEnd, setIsEnd] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [prevPosition, setPrevPosition] = useState(0);

  const getPosts = useCallback(async () => {
    try {
      setLoading(true);
      const query = {
        limit: 10,
        offset: page,
        user: 'me',
      };
      const resp = await postApi.getPosts(query);
      if (resp.success) {
        setPosts((prevPosts) => [...prevPosts, ...resp.data.rows]);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [isMounted]);

  useEffect(() => {
    if (router.isReady) {
      getPosts();
    }
  }, [router]);

  const handleFetchMore = useCallback(
    async (offset?: number) => {
      try {
        setTimeout(async () => {
          const query = {
            limit: 10,
            offset: offset,
            category: category && category[0],
          };

          const resp = await postApi.getPosts(query);
          if (resp.success) {
            if (resp.data.rows.length === 0) {
              setIsEnd(true);
            } else {
              setPosts((prevPosts) => [...prevPosts, ...resp.data.rows]);
            }
            setFetchingMore(false);
          }
        }, 2000);
      } catch (err) {
        console.error(err);
        setFetchingMore(false);
      }
    },
    [isMounted, router.query]
  );

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition > prevPosition) {
      const currentPositionRoudned = Math.round(scrollPosition);
      if (
        currentPositionRoudned >= 95 &&
        currentPositionRoudned <= 100 &&
        !fetchingMore &&
        !isEnd
      ) {
        const newPage = page + 1;
        setPage(newPage);
        handleFetchMore(newPage * 10);
        setPrevPosition(scrollPosition);
        setFetchingMore(true);
      }
    }
  }, [scrollPosition]);

  return (
    <>
      <Head>
        <title>Me</title>
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
              <UserBlogPostCardSkeleton />
              <UserBlogPostCardSkeleton />
              <UserBlogPostCardSkeleton />
            </>
          )}
          {!loading &&
            posts.map((post) => {
              return (
                <UserBlogPostCard
                  key={`post-${post.title}`}
                  id={post.id}
                  authorAvatar=""
                  authorName={post.user.firstName + post.user.lastName}
                  category={post.category.name}
                  cover={post.cover}
                  status={post.status}
                  publishedAt={new Date(post.publishedAt).getTime()}
                  createdAt={new Date(post.createdAt).getTime()}
                  readTime={'3 min'}
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
              <Typography variant="h6">You have no posts</Typography>
            </Box>
          )}
          {fetchingMore && (
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
          )}
          {isEnd && (
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
              <Typography variant="h6">There are no more posts</Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

Me.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default Me;
