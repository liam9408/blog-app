// import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';

import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import { GuestGuard } from '../components/organisms/GuestGuard';

import { LoginForm } from '../components/organisms/LoginForm';
import { Logo } from '../components/atoms/Logo';

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
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
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <NextLink href="/" passHref>
                <a>
                  <Logo
                    sx={{
                      height: 40,
                      width: 40,
                    }}
                  />
                </a>
              </NextLink>
              <Typography variant="h5">Log In</Typography>
              <Typography color="textSecondary" sx={{ mt: 2 }} variant="body2">
                Log into your account
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              <LoginForm />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <NextLink href={'/auth/forgot-password'} passHref>
                  <Link color="textSecondary" variant="body2">
                    Forgot Password
                  </Link>
                </NextLink>
              </div>
              <div>
                <NextLink href={'/sign-up'} passHref>
                  <Link color="textSecondary" variant="body2">
                    Create new account
                  </Link>
                </NextLink>
              </div>
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Login.getLayout = (page) => <GuestGuard>{page}</GuestGuard>;

export default Login;
