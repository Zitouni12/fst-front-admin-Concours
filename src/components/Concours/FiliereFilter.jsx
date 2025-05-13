import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FilterListIcon from '@mui/icons-material/FilterList';

// Définition des couleurs principales selon la charte graphique UCA
const primaryColor = "#B36B39"; // Couleur bronze/cuivre du logo
const secondaryColor = "#2C3E50"; // Bleu foncé pour le contraste
const backgroundColor = "#F5F5F5"; // Gris clair pour le fond

const FiliereFilter = ({
  filiereFilter,
  setFiliereFilter,
  afficherListe,
  setAfficherListe,
  filieres,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectFiliere = (filiere) => {
    setFiliereFilter(filiere);
    setAfficherListe(false);
    handleMenuClose();
  };

  return (
    <AppBar 
      position="static" 
      elevation={3}
      sx={{
        backgroundColor: secondaryColor,
        borderRadius: '0 0 16px 16px',
        mb: 3,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Icône à gauche pour ouvrir le menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="select filiere"
            onClick={handleMenuOpen}
            sx={{ 
              mr: 2,
              transition: "all 0.3s ease",
              '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <FilterListIcon />
          </IconButton>

          {/* Nom de la filière sélectionnée */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {filiereFilter ? filiereFilter : 'Sélectionner un concours'}
          </Typography>
        </Box>

        {/* Logo ou texte à droite */}
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 600,
            fontSize: '0.9rem',
            opacity: 0.9,
            letterSpacing: '0.5px',
          }}
        >
          UCA Concours
        </Typography>

        {/* Menu déroulant qui apparaît depuis l'icône */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 200,
              '& .MuiMenuItem-root': {
                fontSize: '0.95rem',
                py: 1,
                '&:hover': {
                  backgroundColor: `${primaryColor}20`,
                },
                '&.Mui-selected': {
                  backgroundColor: `${primaryColor}40`,
                  '&:hover': {
                    backgroundColor: `${primaryColor}50`,
                  },
                },
              }
            }
          }}
        >
          {filieres.map((filiereItem) => (
            <MenuItem 
              key={filiereItem} 
              onClick={() => handleSelectFiliere(filiereItem)}
              selected={filiereItem === filiereFilter}
            >
              {filiereItem}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default FiliereFilter;