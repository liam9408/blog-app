import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Markdown from 'react-markdown';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthGuard } from 'src/components/organisms/AuthGuard';
import { BackButton } from 'src/components/atoms/BackButton';
import { EditPostWidget } from 'src/components/molecules/EditPostWidget';
import { DashboardLayout } from 'src/layout/dashboard/vertical-layout';
import { postApi } from 'src/api/posts-api';
import { useMounted } from 'src/hooks/use-mounted';
import { Post } from 'src/types/posts.type';
import { useAuth } from 'src/hooks/use-auth';

const MarkdownWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& h2': {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: theme.typography.h5.lineHeight,
    marginBottom: theme.spacing(3),
  },
  '& h3': {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: theme.typography.h3.lineHeight,
    marginBottom: theme.spacing(3),
  },
  '& p': {
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,
    marginBottom: theme.spacing(2),
  },
  '& li': {
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,
    marginBottom: theme.spacing(1),
  },
}));

const PostDetails: NextPage = () => {
  const isMounted = useMounted();
  const { user } = useAuth();
  const router = useRouter();
  const { postId } = router.query;

  const [post, setPost] = useState<Post>({});
  const [loading, setLoading] = useState(true);

  const getPost = useCallback(
    async (postId) => {
      try {
        setLoading(true);
        const resp = await postApi.getPost(postId);
        if (resp.success) {
          setPost(resp.data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        console.error(err);
        setLoading(false);
      }
    },
    [isMounted]
  );

  useEffect(() => {
    getPost(postId);
  }, []);

  const getStatusColor = (status: string): string => {
    if (status === 'draft') {
      return 'info.main';
    }
    if (status === 'published') {
      return 'success.main';
    }

    return 'info.main';
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{post ? post.title : ''}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 8,
        }}
      >
        <Container maxWidth="md">
          <BackButton text="Back" to="/posts" />
          <Box sx={{ mt: 3 }}>
            <Chip label={post.category.name} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ mt: 3 }} variant="h3">
              {post.title}
            </Typography>
            {user.id === post.user.id && (
              <NextLink href="" passHref>
                <Button component="a" variant="contained">
                  Edit
                </Button>
              </NextLink>
            )}
          </Box>
          <Typography color="textSecondary" sx={{ mt: 3 }} variant="subtitle1">
            {post.description}
          </Typography>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              mt: 3,
            }}
          >
            <Avatar src={post.user.avatar} />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2">
                By {post.user.firstName + post.user.lastName} •{' '}
                {post.publishedAt
                  ? format(new Date(post.publishedAt).getTime(), 'MMMM d, yyyy')
                  : post.status.toUpperCase()}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {`${3} min read`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ py: 3 }}>
            <MarkdownWrapper>
              {post.content && <Markdown>{post.content}</Markdown>}
            </MarkdownWrapper>
          </Box>
          <Divider sx={{ my: 3 }} />
        </Container>
      </Box>
    </>
  );
};

PostDetails.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default PostDetails;
