import type { FC } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { Toaster } from 'react-hot-toast';
import nProgress from 'nprogress';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  SettingsConsumer,
  SettingsProvider,
} from '../contexts/settings-context';

import { SplashScreen } from '../components/molecules/SplashScreen';

import { AuthConsumer, AuthProvider } from '../contexts/auth-context';
import { createTheme } from '../theme';
import { createEmotionCache } from '../utils/create-emotion-cache';

type EnhancedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const App: FC<EnhancedAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Blog</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthProvider>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => (
              <ThemeProvider
                theme={createTheme({
                  direction: settings.direction,
                  responsiveFontSizes: settings.responsiveFontSizes,
                  mode: settings.theme,
                })}
              >
                <CssBaseline />
                <Toaster position="top-center" />
                <AuthConsumer>
                  {(auth) =>
                    !auth.isInitialized ? (
                      <SplashScreen />
                    ) : (
                      getLayout(<Component {...pageProps} />)
                    )
                  }
                </AuthConsumer>
              </ThemeProvider>
            )}
          </SettingsConsumer>
        </SettingsProvider>
      </AuthProvider>
    </CacheProvider>
  );
};

export default App;
