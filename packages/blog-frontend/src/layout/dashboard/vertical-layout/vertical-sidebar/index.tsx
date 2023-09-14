import { useEffect } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Drawer, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material';
import { VerticalSidebarComponent } from './vertical-sidebar';

interface DashboardSidebarProps {
  onClose?: () => void;
  open?: boolean;
  asPath?: string;
}

export const VerticalSideBar: FC<DashboardSidebarProps> = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'), {
    noSsr: true,
  });

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }
    if (open && !md) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.query]
  );

  if (md) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) =>
              theme.palette.mode === 'dark' ? 1 : 0,
            color: '#FFFFFF',
            width: 280,
          },
        }}
        variant="persistent"
      >
        <VerticalSidebarComponent
          onClose={onClose}
          query={String(router.query.category)}
        />
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      <VerticalSidebarComponent
        onClose={onClose}
        query={String(router.query?.category)}
      />
    </Drawer>
  );
};

VerticalSideBar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
