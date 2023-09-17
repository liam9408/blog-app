/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container } from '@mui/material';
import { AuthGuard } from 'src/components/organisms/AuthGuard';
import { DashboardLayout } from 'src/layout/dashboard/vertical-layout';
import { postApi } from 'src/api/posts-api';
import { useMounted } from 'src/hooks/use-mounted';
import { Post } from 'src/types/posts.type';
import { useAuth } from 'src/hooks/use-auth';
import { BlogPostDisplay } from 'src/components/templates/BlogPostDisplay';
import { BlogPostEdit } from 'src/components/templates/BlogPostEdit';
import { toast } from 'react-hot-toast';

const PostDetails: NextPage = () => {
  const isMounted = useMounted();
  const { user } = useAuth();
  const router = useRouter();
  const { postId } = router.query;

  const [post, setPost] = useState<Post>({});
  const [loading, setLoading] = useState(true);
  const [editing, isEditing] = useState(false);

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
        toast.error(err.params);
        console.error(err);
        setLoading(false);
      }
    },
    [isMounted]
  );

  useEffect(() => {
    getPost(postId);
  }, []);

  const onToggleEdit = () => {
    isEditing(!editing);
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
          pb: 6,
          position: 'relative',
          overflowX: 'visible',
        }}
      >
        <Container maxWidth="md">
          {editing ? (
            <BlogPostEdit
              post={post}
              header="Edit Post"
              handleCancelEdit={onToggleEdit}
            />
          ) : (
            <BlogPostDisplay
              post={post}
              isAuthor={user.id === post.user.id}
              onToggleEdit={onToggleEdit}
            />
          )}
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
