import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';

const LoadingSpinner = ({ 
  size = 40, 
  message, 
  fullScreen = false,
  progress,
  showProgress = false 
}) => {
  const content = (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 2,
      }}
    >
      <CircularProgress 
        size={size} 
        sx={{ 
          color: 'primary.main',
          ...(progress !== undefined && { 
            color: 'primary.main',
            position: 'relative',
          })
        }}
      />
      
      {showProgress && progress !== undefined && (
        <Box sx={{ width: '100%', maxWidth: 200 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" align="center">
            {progress}%
          </Typography>
        </Box>
      )}
      
      {message && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center"
          sx={{ maxWidth: 300 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
      {content}
    </Box>
  );
};

export default LoadingSpinner;