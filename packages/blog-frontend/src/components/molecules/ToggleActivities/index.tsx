import { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Box, Typography, Button } from '@mui/material';

export const ToggleActivities: FC = () => {
  const router = useRouter();

  const ACTIVITIES_HREF = '/activities';
  const ME_HREF = '/activities/me';

  const currentPageStyling = {
    textDecoration: 'none',
    color: 'neutral.900',
    cursor: 'pointer',
  };
  const notCurrentPageStyling = {
    color: 'neutral.400',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 6,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <NextLink href={ACTIVITIES_HREF} passHref>
          <Typography
            component="a"
            variant="h5"
            sx={{
              mr: 4,
              ...(router.asPath === ACTIVITIES_HREF
                ? currentPageStyling
                : notCurrentPageStyling),
            }}
          >
            Activities
          </Typography>
        </NextLink>
        <NextLink href={ME_HREF} passHref>
          <Typography
            variant="h5"
            sx={{
              ...(router.asPath === ME_HREF
                ? currentPageStyling
                : notCurrentPageStyling),
            }}
          >
            My Posts
          </Typography>
        </NextLink>
      </Box>

      <NextLink href="/post/new" passHref>
        <Button component="a" variant="contained">
          New Post
        </Button>
      </NextLink>
    </Box>
  );
};
