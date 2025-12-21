import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const ErrorMessage = ({ error, onRetry, title = "Error" }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert 
        severity="error" 
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry} startIcon={<Refresh />}>
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {typeof error === 'string' ? error : 'An unexpected error occurred'}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;