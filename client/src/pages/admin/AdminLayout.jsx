import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';
import DashboardSidebar from './DashboardSidebar';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: Implement logout
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <DashboardSidebar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)` },
            ml: { md: `${isSidebarOpen ? drawerWidth : 0}px` },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => dispatch(toggleSidebar())}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>

            <IconButton color="inherit" sx={{ mr: 2 }}>
              <Notifications />
            </IconButton>

            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar
                alt={user?.name}
                src={user?.avatar}
                sx={{ width: 32, height: 32 }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <AccountCircle sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Settings sx={{ mr: 1 }} /> Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;