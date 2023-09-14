// import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';

import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';

import { AuthGuard } from '@/components/organisms/AuthGuard';

const Home: NextPage = () => {
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
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '120px',
            },
          }}
        >
          <Card elevation={16} sx={{ p: 4 }}>
            <h1> LOGGED IN !</h1>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Home.getLayout = (page) => <AuthGuard>{page}</AuthGuard>;

export default Home;
