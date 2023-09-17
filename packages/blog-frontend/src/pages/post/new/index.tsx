import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { AuthGuard } from 'src/components/organisms/AuthGuard';
import { DashboardLayout } from 'src/layout/dashboard/vertical-layout';
import { BlogPostEdit } from 'src/components/templates/BlogPostEdit';

const PostDetails: NextPage = () => {
  return (
    <>
      <Head>
        <title>New Post</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 6,
          position: 'relative',
          overflowX: 'visible',
        }}
      >
        <Container maxWidth="md">
          <BlogPostEdit type="create" header="New Post" />
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
