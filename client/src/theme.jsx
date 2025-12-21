import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Coral Red
      light: '#FF9E9E',
      dark: '#FF4757',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4ECDC4', // Turquoise
      light: '#7DF5ED',
      dark: '#1A7C73',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#1DD1A1', // Mint Green
      light: '#4FE5C5',
      dark: '#0FA87D',
    },
    warning: {
      main: '#FF9F43', // Orange
      light: '#FFB870',
      dark: '#E67E22',
    },
    error: {
      main: '#FF4757', // Red
      light: '#FF6B7A',
      dark: '#E63946',
    },
    info: {
      main: '#54A0FF', // Sky Blue
      light: '#7BB5FF',
      dark: '#2E86AB',
    },
    background: {
      default: '#FAFBFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  spacing: 8,
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.05)',
    '0 2px 6px rgba(0, 0, 0, 0.08)',
    '0 4px 12px rgba(0, 0, 0, 0.1)',
    '0 8px 20px rgba(0, 0, 0, 0.12)',
    '0 12px 28px rgba(0, 0, 0, 0.14)',
    '0 16px 36px rgba(0, 0, 0, 0.16)',
    '0 20px 44px rgba(0, 0, 0, 0.18)',
    '0 24px 52px rgba(0, 0, 0, 0.2)',
    '0 28px 60px rgba(0, 0, 0, 0.22)',
    '0 32px 68px rgba(0, 0, 0, 0.24)',
    '0 36px 76px rgba(0, 0, 0, 0.26)',
    '0 40px 84px rgba(0, 0, 0, 0.28)',
    '0 44px 92px rgba(0, 0, 0, 0.3)',
    '0 48px 100px rgba(0, 0, 0, 0.32)',
    '0 52px 108px rgba(0, 0, 0, 0.34)',
    '0 56px 116px rgba(0, 0, 0, 0.36)',
    '0 60px 124px rgba(0, 0, 0, 0.38)',
    '0 64px 132px rgba(0, 0, 0, 0.4)',
    '0 68px 140px rgba(0, 0, 0, 0.42)',
    '0 72px 148px rgba(0, 0, 0, 0.44)',
    '0 76px 156px rgba(0, 0, 0, 0.46)',
    '0 80px 164px rgba(0, 0, 0, 0.48)',
    '0 84px 172px rgba(0, 0, 0, 0.5)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
          boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF4757 0%, #FF6B6B 100%)',
            boxShadow: '0 8px 24px rgba(255, 107, 107, 0.4)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #4ECDC4 0%, #6DF5ED 100%)',
          boxShadow: '0 4px 16px rgba(78, 205, 196, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1A7C73 0%, #4ECDC4 100%)',
            boxShadow: '0 8px 24px rgba(78, 205, 196, 0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            borderColor: 'rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: 'none',
        },
        elevation0: {
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
        elevation4: {
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.2)',
              },
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(255, 107, 107, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
          height: 32,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
          },
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
  },
});

export default theme;