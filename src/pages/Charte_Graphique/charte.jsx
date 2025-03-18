"use client"
import { Box, Container, Typography, Paper, Grid, Button, ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import { styled } from "@mui/material/styles"

// Définition des couleurs principales
const primaryColor = "#B36B39" // Couleur bronze/cuivre du logo
const secondaryColor = "#2C3E50" // Bleu foncé pour le contraste
const backgroundColor = "#F5F5F5" // Gris clair pour le fond
const accentColor = "#E74C3C" // Rouge pour l'accent

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
        containedPrimary: {
          background: `linear-gradient(45deg, ${primaryColor} 30%, ${primaryColor}CC 90%)`,
          "&:hover": {
            background: `linear-gradient(45deg, ${primaryColor}CC 30%, ${primaryColor} 90%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(45deg, ${secondaryColor} 30%, ${secondaryColor}CC 90%)`,
          "&:hover": {
            background: `linear-gradient(45deg, ${secondaryColor}CC 30%, ${secondaryColor} 90%)`,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
  },
})

const ColorBox = styled(Box)(({ bgcolor }) => ({
  width: "100%",
  height: 100,
  backgroundColor: bgcolor,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  marginBottom: 16,
  borderRadius: 8,
}))

const StyleGuide = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h1" gutterBottom>
          Charte Graphique UCA
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 4 }}>
          <Typography variant="h2" gutterBottom>
            Palette de Couleurs
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <ColorBox bgcolor={primaryColor}>Primaire</ColorBox>
              <Typography variant="body1" align="center">
                #B36B39
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ColorBox bgcolor={secondaryColor}>Secondaire</ColorBox>
              <Typography variant="body1" align="center">
                #2C3E50
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ColorBox bgcolor={accentColor}>Accent</ColorBox>
              <Typography variant="body1" align="center">
                #E74C3C
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <ColorBox bgcolor={backgroundColor} color="#333 !important">
                Fond
              </ColorBox>
              <Typography variant="body1" align="center">
                #F5F5F5
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 4 }}>
          <Typography variant="h2" gutterBottom>
            Typographie
          </Typography>
          <Typography variant="h1" gutterBottom>
            Titre Principal (H1)
          </Typography>
          <Typography variant="h2" gutterBottom>
            Sous-titre (H2)
          </Typography>
          <Typography variant="body1" gutterBottom>
            Texte courant (Body1) - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 4 }}>
          <Typography variant="h2" gutterBottom>
            Boutons
          </Typography>
          <Box sx={{ "& > button": { mr: 2, mb: 2 } }}>
            <Button variant="contained" color="primary">
              Bouton Primaire
            </Button>
            <Button variant="contained" color="secondary">
              Bouton Secondaire
            </Button>
            <Button variant="outlined" color="primary">
              Bouton Contour
            </Button>
            <Button
              variant="contained"
              style={{
                background: `linear-gradient(45deg, ${accentColor} 30%, ${accentColor}CC 90%)`,
                color: "white",
              }}
            >
              Bouton Accent
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h2" gutterBottom>
            Logo
          </Typography>
          <Box
            component="img"
            src="/images/LogoFst.png"
            height='5%'
            alt="Logo UCA"
            sx={{ maxWidth: "30%", height: "auto" }}
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Le logo de l'UCA représente une forme stylisée de palmier ou d'éventail, symbolisant la croissance,
            l'ouverture et l'héritage culturel de Marrakech. Il est utilisé en couleur bronze/cuivre sur fond clair pour
            une meilleure visibilité.
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default StyleGuide

