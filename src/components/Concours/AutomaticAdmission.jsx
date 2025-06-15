"use client"
import React from 'react';
import { TextField, Button, Box, Typography, ThemeProvider, createTheme } from '@mui/material';

// Définition des couleurs principales selon la charte UCA
const primaryColor = "#B36B39"; // Couleur bronze/cuivre du logo
const secondaryColor = "#2C3E50"; // Bleu foncé pour le contraste
const backgroundColor = "#F5F5F5"; // Gris clair pour le fond
const accentColor = "#E74C3C"; // Rouge pour l'accent

// Création du thème UCA
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
        containedPrimary: {
          background: `linear-gradient(45deg, ${primaryColor} 30%, ${primaryColor}CC 90%)`,
          "&:hover": {
            background: `linear-gradient(45deg, ${primaryColor}CC 30%, ${primaryColor} 90%)`,
          },
          "&.Mui-disabled": {
            background: "#ccc",
            color: "#666",
          },
        },
        containedSecondary: {
          background: `linear-gradient(45deg, #FFA726 30%, #FF9800 90%)`,
          "&:hover": {
            background: `linear-gradient(45deg, #FF9800 30%, #FFA726 90%)`,
          },
          "&.Mui-disabled": {
            background: "#ccc",
            color: "#666",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#E0E0E0',
              borderRadius: 8,
              transition: 'all 0.3s',
            },
            '&:hover fieldset': {
              borderColor: primaryColor,
            },
            '&.Mui-focused fieldset': {
              borderColor: primaryColor,
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#555',
            '&.Mui-focused': {
              color: primaryColor,
            },
          },
          '& .MuiInputBase-input': {
            padding: '12px 14px',
          },
        },
      },
    },
  },
});

const AutomaticAdmission = ({ 
  autoAdmitCount, 
  setAutoAdmitCount, 
  handleAutomaticAdmission,
  autoAdmitCountLP,
  setAutoAdmitCountLP,
  autoAdmitCountLA,
  setAutoAdmitCountLA,
  handleAutomaticAdmissionLP,
  handleAutomaticAdmissionLA,
  phase,
  typeEpreuve
}) => {
  
  // Déterminer si on doit afficher les deux zones (LP et LA)
  const shouldShowFinalAdmission = () => {
    if (typeEpreuve === 'ecrit' && phase === 'ecrits') return true;
    if (typeEpreuve === 'oral' && phase === 'oral') return true;
    if (typeEpreuve === 'ecrit_oral' && phase === 'oral') return true;
    return false;
  };

  // Déterminer le titre selon la phase et le type
  const getTitle = () => {
    if (phase === 'candidature') return 'Admission automatique à l\'épreuve suivante';
    if (shouldShowFinalAdmission()) return 'Admission automatique finale';
    if (phase === 'ecrits') return 'Admission automatique à l\'épreuve orale';
    return 'Admission automatique';
  };

  const getCriteriaText = () => {
    if (phase === 'candidature') return 'Critère : Note de dossier (meilleurs candidats)';
    return 'Critère : Score Mérite (meilleurs candidats)';
  };

  if (shouldShowFinalAdmission()) {
    // Interface pour admission finale (LP + LA)
    return (
      <ThemeProvider theme={theme}>
        <Box 
          sx={{ 
            mb: 3,
            p: 3,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              fontWeight: 600, 
              color: secondaryColor,
              textAlign: 'center'
            }}
          >
            {getTitle()}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 3, 
              color: '#666',
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            {getCriteriaText()}
          </Typography>

          {/* Zone Liste Principale */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' }, 
              justifyContent: 'space-between',
              mb: 2,
              p: 2,
              bgcolor: '#f0f7ff',
              borderRadius: 2,
              border: '1px solid #e3f2fd'
            }}
          >
            <Box sx={{ mb: { xs: 2, sm: 0 } }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 1, 
                  fontWeight: 600, 
                  color: primaryColor 
                }}
              >
                Liste Principale
              </Typography>
              <TextField
                label="Nombre de candidats"
                type="number"
                value={autoAdmitCountLP || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                  setAutoAdmitCountLP(value);
                }}
                size="small"
                sx={{ 
                  width: { xs: '100%', sm: 200 },
                  mr: { xs: 0, sm: 2 }
                }}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAutomaticAdmissionLP}
              disabled={!autoAdmitCountLP || autoAdmitCountLP <= 0}
              sx={{
                minWidth: 180,
                fontWeight: 600,
                py: 1.2
              }}
            >
              Admettre en LP
            </Button>
          </Box>

          {/* Zone Liste d'Attente */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' }, 
              justifyContent: 'space-between',
              p: 2,
              bgcolor: '#fffbf0',
              borderRadius: 2,
              border: '1px solid #fff3e0'
            }}
          >
            <Box sx={{ mb: { xs: 2, sm: 0 } }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 1, 
                  fontWeight: 600, 
                  color: '#FF9800'
                }}
              >
                Liste d'Attente
              </Typography>
              <TextField
                label="Nombre de candidats"
                type="number"
                value={autoAdmitCountLA || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                  setAutoAdmitCountLA(value);
                }}
                size="small"
                sx={{ 
                  width: { xs: '100%', sm: 200 },
                  mr: { xs: 0, sm: 2 }
                }}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAutomaticAdmissionLA}
              disabled={!autoAdmitCountLA || autoAdmitCountLA <= 0}
              sx={{
                minWidth: 180,
                fontWeight: 600,
                py: 1.2,
                backgroundColor: '#FF9800',
                '&:hover': {
                  backgroundColor: '#F57C00',
                }
              }}
            >
              Admettre en LA
            </Button>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  // Interface standard (une seule zone)
  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }, 
          justifyContent: 'space-between',
          mb: 3,
          p: 3,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 0 } }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 1, 
              fontWeight: 600, 
              color: secondaryColor 
            }}
          >
            {getTitle()}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              color: '#666',
              fontStyle: 'italic'
            }}
          >
            {getCriteriaText()}
          </Typography>
          <TextField
            label="Nombre de candidats à admettre"
            type="number"
            value={autoAdmitCount || ''}
            onChange={(e) => {
              const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
              setAutoAdmitCount(value);
            }}
            size="small"
            fullWidth
            sx={{ 
              width: { xs: '100%', sm: 250 },
              mr: { xs: 0, sm: 3 }
            }}
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAutomaticAdmission}
          disabled={!autoAdmitCount || autoAdmitCount <= 0}
          sx={{
            minWidth: 200,
            fontWeight: 600,
            py: 1.2
          }}
        >
          Admettre Automatiquement
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default AutomaticAdmission;
