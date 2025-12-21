import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  Category,
  People,
  PendingActions,
  Settings,
  ChevronLeft,
  Menu as MenuIcon,
  Assessment,
  RateReview,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Recipes', icon: <Restaurant />, path: '/admin/recipes' },
  { text: 'Categories', icon: <Category />, path: '/admin/categories' },
  { text: 'Pending Recipes', icon: <PendingActions />, path: '/admin/pending' },
  { text: 'Users', icon: <People />, path: '/admin/users' },
  { text: 'Reviews', icon: <RateReview />, path: '/admin/reviews' },
  { text: 'Analytics', icon: <Assessment />, path: '/admin/analytics' },
  { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
];

const DashboardSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector((state) => state.ui);

  const handleDrawerToggle = () => {
    dispatch(toggleSidebar());
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                '&.active': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={isSidebarOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default DashboardSidebar;