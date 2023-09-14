import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material';
import { Box, useMediaQuery } from '@mui/material';
import { VerticalNavbar } from './vertical-navbar/index';
import { VerticalSideBar } from './vertical-sidebar';

interface DashboardLayoutProps {
  children?: ReactNode;
}
const VerticalLayoutRoot = styled('div')(() => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 110,
}));

export const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  const { children } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'), {
    noSsr: true,
  });

  return (
    <Box>
      <VerticalLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            paddingLeft: isSidebarOpen && md && '280px',
          }}
        >
          {children}
        </Box>
      </VerticalLayoutRoot>
      <VerticalSideBar
        onClose={(): void => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      />
      <VerticalNavbar
        onOpenSidebar={(): void => setIsSidebarOpen(true)}
        open={isSidebarOpen}
      />
    </Box>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
