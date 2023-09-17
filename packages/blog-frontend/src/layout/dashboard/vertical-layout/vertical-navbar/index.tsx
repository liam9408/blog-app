import { useRef, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { AppBarProps } from '@mui/material';
import { Menu as MenuIcon } from 'src/icons/menu';
import { UserCircle as UserCircleIcon } from 'src/icons/user-circle';
import { AccountPopover } from 'src/components/organisms/AccountPopover';
import { useAuth } from 'src/hooks/use-auth';
import { ContentSearchButton } from 'src/components/organisms/ContentSearch';

interface VerticalNavbarProps extends AppBarProps {
  onOpenSidebar?: () => void;
  open?: boolean;
}

const VerticalNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...(theme.palette.mode === 'light'
    ? {
        boxShadow: theme.shadows[3],
      }
    : {
        backgroundColor: theme.palette.background.paper,
        borderBottomColor: theme.palette.divider,
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        boxShadow: 'none',
      }),
}));

const AccountButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const { user } = useAuth();

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          ml: 2,
        }}
      >
        <Avatar
          sx={{
            height: 40,
            width: 40,
          }}
          src={user.avatar}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};

export const VerticalNavbar: FC<VerticalNavbarProps> = (props) => {
  const { onOpenSidebar, open, ...other } = props;

  return (
    <>
      <VerticalNavbarRoot
        sx={{
          left: {
            lg: open && 280,
          },
          zIndex: 1,
          width: {
            lg: `calc(100% - ${open ? '280px' : '0'})`,
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          {!open && (
            <IconButton
              onClick={onOpenSidebar}
              sx={{
                display: {
                  xs: 'inline-flex',
                  // lg: 'none',
                },
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <ContentSearchButton />
          <Box sx={{ flexGrow: 1 }} />
          <AccountButton />
        </Toolbar>
      </VerticalNavbarRoot>
    </>
  );
};

VerticalNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};
