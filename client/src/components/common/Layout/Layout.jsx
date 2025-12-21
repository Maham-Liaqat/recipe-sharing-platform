import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Box } from '@mui/material';

const Layout = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FAFBFC 0%, #F3F4F6 50%, #E5E7EB 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      },
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Header />
      </Box>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          position: 'relative',
          zIndex: 1,
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;