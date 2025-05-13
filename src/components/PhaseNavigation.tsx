import React from 'react';
import { Box, styled, Typography, useTheme, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Définition des couleurs principales
const primaryColor = "#B36B39"; // Couleur bronze/cuivre du logo
const secondaryColor = "#2C3E50"; // Bleu foncé pour le contraste
const backgroundColor = "#F5F5F5"; // Gris clair pour le fond
const accentColor = "#E74C3C"; // Rouge pour l'accent

// Création du thème
const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      contrastText: "#ffffff",
    },
    secondary: {
      main: secondaryColor,
      contrastText: "#ffffff",
    },
    background: {
      default: backgroundColor,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: secondaryColor,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: primaryColor,
    },
    body1: {
      fontSize: "1rem",
      color: "#333",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: "none",
          padding: "10px 20px",
          transition: "all 0.3s ease",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  },
});

interface PhaseCircleProps {
  active?: boolean;
}

interface LineProps {
  active?: boolean;
}

// Cercle de phase
const PhaseCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<PhaseCircleProps>(({ theme, active }) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: `2px solid ${active ? primaryColor : theme.palette.grey[400]}`,
    backgroundColor: active ? primaryColor : '#fff',
    color: active ? '#fff' : theme.palette.grey[600],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: active ? `${primaryColor}CC` : theme.palette.grey[200],
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
}));

// Ligne entre les cercles
const Line = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<LineProps>(({ theme, active }) => ({
    flexGrow: 1,
    height: 2,
    backgroundColor: active ? primaryColor : theme.palette.grey[300],
    margin: '0 8px',
    transition: 'all 0.3s ease',
}));

interface Phase {
  id: string | number;
  label: string;
}

interface PhaseNavigationProps {
  phase: string | number;
  setPhase: (phase: string | number) => void;
  phases: Phase[];
}

const PhaseNavigation: React.FC<PhaseNavigationProps> = ({ phase, setPhase, phases }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-around', 
                width: '100%', 
                padding: 4,
                backgroundColor: backgroundColor,
                borderRadius: 4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {phases.map((p, index) => (
                    <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <PhaseCircle
                                active={phase === p.id}
                                onClick={() => setPhase(p.id)}
                            >
                                {index + 1}
                            </PhaseCircle>
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 1,
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    color: phase === p.id ? primaryColor : secondaryColor,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {p.label}
                            </Typography>
                        </Box>

                        {index < phases.length - 1 && (
                            <Line active={phases.findIndex(item => item.id === phase) > index} />
                        )}
                    </Box>
                ))}
            </Box>
        </ThemeProvider>
    );
};

export default PhaseNavigation; 