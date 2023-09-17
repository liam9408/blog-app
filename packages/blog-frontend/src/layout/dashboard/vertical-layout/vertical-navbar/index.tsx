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
import { AccountPopover } from '../../../../components/organisms/AccountPopover';

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

// const ContentSearchButton = () => {
//   const [openDialog, setOpenDialog] = useState<boolean>(false);

//   const handleOpenSearchDialog = (): void => {
//     setOpenDialog(true);
//   };

//   const handleCloseSearchDialog = (): void => {
//     setOpenDialog(false);
//   };

//   return (
//     <>
//       <Tooltip title="Search">
//         <IconButton onClick={handleOpenSearchDialog} sx={{ ml: 1 }}>
//           <SearchIcon fontSize="small" />
//         </IconButton>
//       </Tooltip>
//       <ContentSearchDialog
//         onClose={handleCloseSearchDialog}
//         open={openDialog}
//       />
//     </>
//   );
// };

const AccountButton = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
    name: 'Anika Visser',
  };

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

// const NotificationButton = () => {
//   const isMounted = useMounted();
//   const router = useRouter();
//   const anchorRef = useRef<HTMLButtonElement | null>(null);
//   const [openPopover, setOpenPopover] = useState<boolean>(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [notificationsCount, setNotificationsCount] = useState<number>(null);
//   const [unReadNotificationsCount, setUnReadNotificationsCount] =
//     useState<number>(null);
//   const [pageCount, setPageCount] = useState<number>(10);
//   const [fetching, setFetching] = useState(false);

//   const handleOpenPopover = (): void => {
//     setOpenPopover(true);
//   };

//   const handleClosePopover = (): void => {
//     setOpenPopover(false);
//   };

//   return (
//     <>
//       <Tooltip title="Notifications">
//         <IconButton
//           onClick={handleOpenPopover}
//           sx={{
//             ml: 1,
//             backgroundColor: openPopover && 'rgba(218, 100, 60, 0.1)',
//             height: '36px',
//             width: '36px',
//           }}
//           ref={anchorRef}
//           color="primary"
//         >
//           {openPopover ? (
//             <NotificationsIcon color={'primary'} />
//           ) : (
//             <Badge badgeContent={unReadNotificationsCount} color="error">
//               <NotificationsIcon color={'action'} />
//             </Badge>
//           )}
//         </IconButton>
//       </Tooltip>
//     </>
//   );
// };

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
          {/* <NotificationButton /> */}
          <AccountButton />
        </Toolbar>
      </VerticalNavbarRoot>
    </>
  );
};

VerticalNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};
