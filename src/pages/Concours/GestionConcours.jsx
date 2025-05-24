"use client"
import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  Dialog,
  TextField,
  Pagination,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  Container,
  alpha,
  styled,
  Divider,
  Avatar,
  Badge,
} from "@mui/material"
import { Visibility, Add, CloudUpload, CalendarMonth, AccessTime } from "@mui/icons-material"
import axios from "axios"
import Edit from "@mui/icons-material/Edit"
import Delete from "@mui/icons-material/Delete"

// Création du thème
const theme = createTheme({
  palette: {
    primary: {
      main: "#B36B39",
      light: "#D9A77F",
      dark: "#8C4E1E",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2C3E50",
      light: "#4A6785",
      contrastText: "#ffffff",
    },
    error: {
      main: "#E74C3C",
      light: "#F1867B",
    },
    background: {
      default: "#F5F5F5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h4: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#2C3E50",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#B36B39",
    },
    h6: {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#2C3E50",
    },
    body1: {
      fontSize: "1rem",
      color: "#333",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#555",
    },
  },
  shape: {
    borderRadius: 12,
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
          background: `linear-gradient(45deg, #B36B39 30%, #D9A77F 90%)`,
          "&:hover": {
            background: `linear-gradient(45deg, #8C4E1E 30%, #B36B39 90%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(45deg, #2C3E50 30%, #4A6785 90%)`,
          "&:hover": {
            background: `linear-gradient(45deg, #2C3E50 30%, #2C3E50 90%)`,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
        outlinedPrimary: {
          borderColor: "#B36B39",
          color: "#B36B39",
          "&:hover": {
            backgroundColor: alpha("#B36B39", 0.05),
            borderColor: "#8C4E1E",
          },
        },
        outlinedSecondary: {
          borderColor: "#2C3E50",
          color: "#2C3E50",
          "&:hover": {
            backgroundColor: alpha("#2C3E50", 0.05),
            borderColor: "#2C3E50",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 600,
          padding: "0 2px",
        },
        colorPrimary: {
          backgroundColor: alpha("#B36B39", 0.1),
          color: "#8C4E1E",
          borderColor: "#B36B39",
        },
        colorSecondary: {
          backgroundColor: alpha("#2C3E50", 0.1),
          color: "#2C3E50",
          borderColor: "#2C3E50",
        },
        colorError: {
          backgroundColor: alpha("#E74C3C", 0.1),
          color: "#E74C3C",
          borderColor: "#E74C3C",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease, background-color 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        ul: {
          "& .MuiPaginationItem-root": {
            borderRadius: 8,
            margin: "0 3px",
            "&.Mui-selected": {
              fontWeight: "bold",
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "border-color 0.2s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#B36B39",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              color: "#B36B39",
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 24px 38px rgba(0,0,0,0.14), 0 9px 46px rgba(0,0,0,0.12), 0 11px 15px rgba(0,0,0,0.2)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "16px 0",
          borderColor: alpha("#B36B39", 0.1),
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: "box-shadow 0.3s ease",
        },
        elevation1: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        },
        elevation3: {
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
  },
})

// Composants stylisés
const PageHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, rgba(179, 107, 57, 0.15) 0%, rgba(44, 62, 80, 0.05) 100%)`,
  borderRadius: 24,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  border: `1px solid rgba(179, 107, 57, 0.1)`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "5px",
    background: `linear-gradient(90deg, #B36B39, #2C3E50)`,
  },
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  backgroundColor: "#B36B39",
  padding: theme.spacing(2.5),
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "30%",
    height: "100%",
    background: `linear-gradient(135deg, transparent 0%, #ffffff 100%)`,
    opacity: 0.1,
    borderRadius: "50% 0 0 50%",
  },
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  overflow: "hidden",
  marginBottom: theme.spacing(4),
  border: `1px solid rgba(179, 107, 57, 0.1)`,
  position: "relative",
}))

const DateBadge = styled(Chip)(({ color, variant }) => ({
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 28,
  borderRadius: 14,
  backgroundColor: variant === "outlined" ? "transparent" : `${color}1A`,
  color: color,
  border: variant === "outlined" ? `1px solid ${color}` : "none",
  "& .MuiChip-icon": {
    color: color,
  },
}))

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: "#2C3E50",
  borderBottom: `2px solid rgba(179, 107, 57, 0.2)`,
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -2,
    left: 0,
    width: "40%",
    height: "2px",
    backgroundColor: "#B36B39",
  },
}))

const ActionButton = styled(Button)(() => ({
  borderRadius: 30,
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "none",
  padding: "8px 16px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
}))

const StatusChip = styled(Chip)(({ color, variant }) => ({
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 28,
  borderRadius: 14,
  backgroundColor: variant === "outlined" ? "transparent" : alpha(color, 0.1),
  color: color,
  border: variant === "outlined" ? `2px solid ${color}` : "none",
}))

const GestionConcours = () => {
  const [page, setPage] = useState(1)
  const itemsPerPage = 3
  const [concoursList, setConcoursList] = useState([])
  const [pdfFile, setPdfFile] = useState(null)

  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedConcours, setSelectedConcours] = useState(null)

  const handleEditConcours = (concoursId) => {
    const concoursToEdit = concoursList.find((c) => c.id === concoursId)
    // Si type_epreuve n'existe pas dans l'objet, on définit une valeur par défaut
    if (!concoursToEdit.type_epreuve) {
      concoursToEdit.type_epreuve = "ecrit_oral"
    }
    setSelectedConcours({ ...concoursToEdit })
    setOpenEditDialog(true)
  }

  // Champs du formulaire
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_lancement: "",
    date_limite: "",
    date_ecrit: "",
    date_oral: "",
    type_epreuve: "ecrit_oral", // Valeur par défaut
  })

  // Récupérer les concours depuis le backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/concours")
      .then((response) => {
        setConcoursList(response.data.data) // car paginé dans Laravel
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des concours :", error)
      })
  }, [])

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const paginatedConcours = concoursList.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Mise à jour du formulaire
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Gestion du fichier PDF
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
    } else {
      alert("Veuillez sélectionner un fichier PDF valide.")
    }
  }

  const handleDeleteConcours = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce concours ?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/concours/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })

        if (response.ok) {
          alert("Concours supprimé !")
          // 🔁 Mets à jour l'état local ici pour recharger les données
          setConcoursList((prevConcours) => prevConcours.filter((c) => c.id !== id))
        } else {
          alert("Erreur lors de la suppression.")
        }
      } catch (error) {
        console.error("Erreur suppression :", error)
      }
    }
  }

  // Soumettre le formulaire
  // Soumettre le formulaire
const handleSubmit = async () => {
  // Validation côté frontend
  if (!formData.title || !formData.description || !formData.date_lancement || !formData.date_limite) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  if (!formData.type_epreuve) {
    alert("Veuillez sélectionner au moins un type d'épreuve.");
    return;
  }

  // Validation des dates d'épreuves selon le type
  if (formData.type_epreuve === "ecrit" && !formData.date_ecrit) {
    alert("Veuillez spécifier la date de l'épreuve écrite.");
    return;
  }
  
  if (formData.type_epreuve === "oral" && !formData.date_oral) {
    alert("Veuillez spécifier la date de l'épreuve orale.");
    return;
  }
  
  if (formData.type_epreuve === "ecrit_oral" && (!formData.date_ecrit || !formData.date_oral)) {
    alert("Veuillez spécifier les dates des épreuves écrite et orale.");
    return;
  }

  try {
    const form = new FormData();
    
    // Ajouter tous les champs requis
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('date_lancement', formData.date_lancement);
    form.append('date_limite', formData.date_limite);
    form.append('type_epreuve', formData.type_epreuve);
    
    // Ajouter les dates d'épreuves seulement si elles sont définies
    if (formData.date_ecrit && (formData.type_epreuve === "ecrit" || formData.type_epreuve === "ecrit_oral")) {
      form.append('date_ecrit', formData.date_ecrit);
    }
    if (formData.date_oral && (formData.type_epreuve === "oral" || formData.type_epreuve === "ecrit_oral")) {
      form.append('date_oral', formData.date_oral);
    }
    
    // Ajouter le fichier PDF s'il existe
    if (pdfFile) {
      form.append('pdf_file', pdfFile);
    }

   // Pour déboguer le contenu du FormData
form.forEach((value, key) => {
  console.log(`${key}:`, value);
});
    const response = await axios.post("http://127.0.0.1:8000/api/concours", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Concours publié avec succès !");
    setConcoursList((prev) => [response.data, ...prev]);
    
    // Réinitialiser le formulaire
    setFormData({
      title: "",
      description: "",
      date_lancement: "",
      date_limite: "",
      date_ecrit: "",
      date_oral: "",
      type_epreuve: "ecrit_oral",
    });
    setPdfFile(null);
    
  } catch (error) {
    console.error("Erreur lors de la publication :", error);
    
    // Afficher plus de détails sur l'erreur
    if (error.response) {
      console.error("Réponse du serveur:", error.response.data);
      console.error("Status:", error.response.status);
      alert(`Erreur ${error.response.status}: ${error.response.data.message || 'Erreur lors de la publication du concours.'}`);
    } else {
      alert("Erreur réseau lors de la publication du concours.");
    }
  }
};

  const handleSave = async () => {
    const formData = new FormData()

    // Laravel attend _method=PUT pour comprendre que c'est une mise à jour
    formData.append("_method", "PUT")

    formData.append("title", selectedConcours.title)
    formData.append("description", selectedConcours.description)
    formData.append("date_lancement", selectedConcours.date_lancement)
    formData.append("date_limite", selectedConcours.date_limite)
    formData.append("type_epreuve", selectedConcours.type_epreuve)
    formData.append("date_ecrit", selectedConcours.date_ecrit)
    formData.append("date_oral", selectedConcours.date_oral)

    if (pdfFile) {
      formData.append("pdf_file", pdfFile)
    }

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/concours/${selectedConcours.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200) {
        alert("Concours mis à jour avec succès !")
        setConcoursList((prev) =>
          prev.map((concours) => (concours.id === selectedConcours.id ? response.data : concours)),
        )
        setOpenEditDialog(false)
      } else {
        alert("Erreur lors de la mise à jour du concours.")
      }
    } catch (error) {
      console.error("Erreur réseau:", error.response?.data || error.message)
      alert("Erreur lors de la mise à jour du concours.")
    }
  }

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "#F5F5F5", py: 5, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          {/* En-tête de page */}
          <PageHeader>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: "bold",
                mb: 1,
                background: `linear-gradient(45deg, #2C3E50, #B36B39)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              Gestion des Concours
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: alpha("#2C3E50", 0.7), maxWidth: "700px", mx: "auto" }}
            >
              Créez, modifiez et gérez les concours de l'université
            </Typography>
          </PageHeader>

          {/* Section Concours en cours */}
          <StyledPaper elevation={3}>
            <SectionHeader>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#fff" }}
              >
                <CalendarMonth /> Concours en cours
              </Typography>
            </SectionHeader>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4} justifyContent="center">
                {paginatedConcours.length > 0 ? (
                  paginatedConcours.map((concours) => (
                    <Grid item xs={12} sm={6} md={4} key={concours.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "4px",
                            background: `linear-gradient(90deg, #B36B39, #D9A77F)`,
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3, flexGrow: 1 }}>
                          <CardTitle variant="h6" gutterBottom>
                            {concours.title}
                          </CardTitle>

                          <Stack spacing={2}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: alpha("#B36B39", 0.1),
                                  color: "#B36B39",
                                  fontSize: "0.8rem",
                                }}
                              >
                                <CalendarMonth fontSize="small" />
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                <Box component="span" sx={{ color: alpha("#2C3E50", 0.7), mr: 0.5 }}>
                                  Lancement:
                                </Box>
                                {formatDate(concours.date_lancement)}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                              <Badge
                                badgeContent={
                                  <AccessTime
                                    fontSize="small"
                                    sx={{ fontSize: "0.7rem", color: "#E74C3C", mr: -0.5 }}
                                  />
                                }
                                sx={{
                                  "& .MuiBadge-badge": {
                                    bgcolor: "white",
                                    border: `1px solid #E74C3C`,
                                    top: -2,
                                    right: -2,
                                  },
                                }}
                              >
                                <StatusChip
                                  label={`Date limite: ${formatDate(concours.date_limite)}`}
                                  color="error"
                                  variant="outlined"
                                />
                              </Badge>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                              {concours.type_epreuve && (
                                <DateBadge
                                  icon={<AccessTime fontSize="small" />}
                                  label={`Type: ${concours.type_epreuve === "ecrit" ? "Écrit" : concours.type_epreuve === "oral" ? "Oral" : "Écrit & Oral"}`}
                                  color="secondary"
                                  size="small"
                                  sx={{ mb: 1 }}
                                />
                              )}
                              {(concours.type_epreuve === "ecrit" || concours.type_epreuve === "ecrit_oral") && (
                                <DateBadge
                                  icon={<CalendarMonth fontSize="small" />}
                                  label={`Écrit: ${formatDate(concours.date_ecrit)}`}
                                  color="primary"
                                  size="small"
                                />
                              )}
                              {(concours.type_epreuve === "oral" || concours.type_epreuve === "ecrit_oral") && (
                                <DateBadge
                                  icon={<CalendarMonth fontSize="small" />}
                                  label={`Oral: ${formatDate(concours.date_oral)}`}
                                  color="primary"
                                  size="small"
                                />
                              )}
                            </Box>

                            <Divider sx={{ my: 1.5 }} />

                            <Typography
                              variant="body2"
                              sx={{
                                color: alpha("#2C3E50", 0.7),
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                fontStyle: "italic",
                                lineHeight: 1.5,
                              }}
                            >
                              {concours.description}
                            </Typography>
                          </Stack>
                        </CardContent>
                        <CardActions
                          sx={{
                            bgcolor: alpha("#F5F5F5", 0.7),
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            borderTop: `1px solid rgba(179, 107, 57, 0.1)`,
                          }}
                        >
                          <ActionButton
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => window.open(`http://127.0.0.1:8000/storage/${concours.pdf_file}`, "_blank")}
                          >
                            Voir Détails
                          </ActionButton>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              onClick={() => handleEditConcours(concours.id)}
                              sx={{
                                bgcolor: alpha("#2C3E50", 0.1),
                                "&:hover": { bgcolor: alpha("#2C3E50", 0.2) },
                                color: "#2C3E50",
                              }}
                              size="small"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteConcours(concours.id)}
                              sx={{
                                bgcolor: alpha("#E74C3C", 0.1),
                                "&:hover": { bgcolor: alpha("#E74C3C", 0.2) },
                                color: "#E74C3C",
                              }}
                              size="small"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 6,
                        px: 2,
                        bgcolor: alpha("#fff", 0.5),
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: alpha("#2C3E50", 0.7), mb: 2 }}>
                        Aucun concours disponible pour le moment
                      </Typography>
                      <Typography variant="body2" sx={{ color: alpha("#2C3E50", 0.5), maxWidth: 500, mx: "auto" }}>
                        Utilisez le formulaire ci-dessous pour créer votre premier concours
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {concoursList.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={Math.ceil(concoursList.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      p: 1,
                      bgcolor: "white",
                      borderRadius: 10,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      "& .MuiPaginationItem-root": {
                        color: "#2C3E50",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#2C3E50",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#1A252F", // Optionnel : survol
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </StyledPaper>

          {/* Section Création de concours */}
          <StyledPaper elevation={3}>
            <SectionHeader>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#fff" }}
              >
                <Add /> Créer un nouveau concours
              </Typography>
            </SectionHeader>
            <CardContent sx={{ p: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: alpha("#B36B39", 0.03),
                  border: `1px dashed rgba(179, 107, 57, 0.2)`,
                }}
              >
                <Typography variant="body2" sx={{ color: alpha("#2C3E50", 0.7) }}>
                  Remplissez le formulaire ci-dessous pour créer un nouveau concours. Tous les champs sont obligatoires.
                  Le fichier PDF doit contenir les détails complets du concours.
                </Typography>
              </Paper>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nom du concours"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{ mb: 3, "& .MuiInputBase-root": { bgcolor: "white" } }}
                    placeholder="Ex: Concours d'entrée en Master Informatique"
                  />
                  <TextField
                    fullWidth
                    label="Description du concours"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    sx={{ mb: 3, "& .MuiInputBase-root": { bgcolor: "white" } }}
                    placeholder="Décrivez brièvement le concours, les conditions d'admission, etc."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        name="date_lancement"
                        value={formData.date_lancement}
                        onChange={handleInputChange}
                        label="Date de lancement"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 3, "& .MuiInputBase-root": { bgcolor: "white" } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        name="date_limite"
                        value={formData.date_limite}
                        onChange={handleInputChange}
                        label="Date limite"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 3, "& .MuiInputBase-root": { bgcolor: "white" } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: alpha("#2C3E50", 0.7) }}>
                          Type d'épreuve
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant={
                              formData.type_epreuve === "ecrit" || formData.type_epreuve === "ecrit_oral"
                                ? "contained"
                                : "outlined"
                            }
                            color="primary"
                            onClick={() => {
                              if (formData.type_epreuve === "ecrit") {
                                setFormData({ ...formData, type_epreuve: "ecrit_oral" })
                              } else if (formData.type_epreuve === "ecrit_oral") {
                                setFormData({ ...formData, type_epreuve: "oral" })
                              } else {
                                setFormData({ ...formData, type_epreuve: "ecrit" })
                              }
                            }}
                            sx={{ borderRadius: 2, flex: 1 }}
                          >
                            Épreuve Écrite
                          </Button>
                          <Button
                            variant={
                              formData.type_epreuve === "oral" || formData.type_epreuve === "ecrit_oral"
                                ? "contained"
                                : "outlined"
                            }
                            color="primary"
                            onClick={() => {
                              if (formData.type_epreuve === "oral") {
                                setFormData({ ...formData, type_epreuve: "ecrit_oral" })
                              } else if (formData.type_epreuve === "ecrit_oral") {
                                setFormData({ ...formData, type_epreuve: "ecrit" })
                              } else {
                                setFormData({ ...formData, type_epreuve: "oral" })
                              }
                            }}
                            sx={{ borderRadius: 2, flex: 1 }}
                          >
                            Épreuve Orale
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                    {(formData.type_epreuve === "ecrit" || formData.type_epreuve === "ecrit_oral") && (
                      <Grid item xs={12} sm={formData.type_epreuve === "ecrit_oral" ? 6 : 12}>
                        <TextField
                          fullWidth
                          type="date"
                          name="date_ecrit"
                          value={formData.date_ecrit}
                          onChange={handleInputChange}
                          label="Date du concours écrit"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3, "& .MuiInputBase-root": { bgcolor: "white" } }}
                        />
                      </Grid>
                    )}
                    {(formData.type_epreuve === "oral" || formData.type_epreuve === "ecrit_oral") && (
                      <Grid item xs={12} sm={formData.type_epreuve === "ecrit_oral" ? 6 : 12}>
                        <TextField
                          fullWidth
                          type="date"
                          name="date_oral"
                          value={formData.date_oral}
                          onChange={handleInputChange}
                          label="Date du concours oral"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3, "& .MuiInputBase-root": { bgcolor: "white" } }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha("#fff", 0.7),
                }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  color="secondary"
                  startIcon={<CloudUpload />}
                  sx={{ borderWidth: 2 }}
                >
                  Importer un fichier PDF
                  <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
                </Button>
                {pdfFile && (
                  <Chip
                    label={pdfFile.name}
                    color="primary"
                    onDelete={() => setPdfFile(null)}
                    sx={{ maxWidth: 200, overflow: "hidden" }}
                  />
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  startIcon={<Add />}
                  sx={{ ml: { xs: 0, md: "auto" } }}
                >
                  Publier le concours
                </Button>
              </Box>
            </CardContent>
          </StyledPaper>

          {/* Dialog de modification */}
          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            fullWidth
            maxWidth="md"
            PaperProps={{
              sx: { borderRadius: 4, overflow: "hidden" },
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: "#2C3E50",
                background: `linear-gradient(to right, #2C3E50, #4A6785)`,
                color: "white",
                py: 2.5,
                px: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#fff" }}
              >
                <Edit fontSize="small" /> Modifier le concours
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Titre"
                    value={selectedConcours?.title || ""}
                    onChange={(e) => setSelectedConcours({ ...selectedConcours, title: e.target.value })}
                    sx={{ mb: 2, "& .MuiInputBase-root": { bgcolor: "white" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={selectedConcours?.description || ""}
                    onChange={(e) => setSelectedConcours({ ...selectedConcours, description: e.target.value })}
                    sx={{ mb: 2, "& .MuiInputBase-root": { bgcolor: "white" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Date de lancement"
                    type="date"
                    value={selectedConcours?.date_lancement || ""}
                    onChange={(e) => setSelectedConcours({ ...selectedConcours, date_lancement: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2, "& .MuiInputBase-root": { bgcolor: "white" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Date limite"
                    type="date"
                    value={selectedConcours?.date_limite || ""}
                    onChange={(e) => setSelectedConcours({ ...selectedConcours, date_limite: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2, "& .MuiInputBase-root": { bgcolor: "white" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: alpha("#2C3E50", 0.7) }}>
                      Type d'épreuve
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant={
                          selectedConcours?.type_epreuve === "ecrit" || selectedConcours?.type_epreuve === "ecrit_oral"
                            ? "contained"
                            : "outlined"
                        }
                        color="primary"
                        onClick={() => {
                          if (selectedConcours?.type_epreuve === "ecrit") {
                            setSelectedConcours({ ...selectedConcours, type_epreuve: "ecrit_oral" })
                          } else if (selectedConcours?.type_epreuve === "ecrit_oral") {
                            setSelectedConcours({ ...selectedConcours, type_epreuve: "ecrit" })
                          } else {
                            setSelectedConcours({ ...selectedConcours, type_epreuve: "ecrit" })
                          }
                        }}
                        sx={{ borderRadius: 2, flex: 1 }}
                      >
                        Épreuve Écrite
                      </Button>
                      <Button
                        variant={
                          selectedConcours?.type_epreuve === "oral" || selectedConcours?.type_epreuve === "ecrit_oral"
                            ? "contained"
                            : "outlined"
                        }
                        color="primary"
                        onClick={() => {
                          if (selectedConcours?.type_epreuve === "oral") {
                            setSelectedConcours({ ...selectedConcours, type_epreuve: "ecrit_oral" })
                          } else if (selectedConcours?.type_epreuve === "ecrit_oral") {
                            setSelectedConcours({ ...selectedConcours, type_epreuve: "ecrit" })
                          } else {
                            setSelectedConcours({ ...selectedConcours, type_epreuve: "oral" })
                          }
                        }}
                        sx={{ borderRadius: 2, flex: 1 }}
                      >
                        Épreuve Orale
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                {(selectedConcours?.type_epreuve === "ecrit" || selectedConcours?.type_epreuve === "ecrit_oral") && (
                  <Grid item xs={12} sm={selectedConcours?.type_epreuve === "ecrit_oral" ? 6 : 12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Date d'écrit"
                      type="date"
                      value={selectedConcours?.date_ecrit || ""}
                      onChange={(e) => setSelectedConcours({ ...selectedConcours, date_ecrit: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2, "& .MuiInputBase-root": { bgcolor: "white" } }}
                    />
                  </Grid>
                )}
                {(selectedConcours?.type_epreuve === "oral" || selectedConcours?.type_epreuve === "ecrit_oral") && (
                  <Grid item xs={12} sm={selectedConcours?.type_epreuve === "ecrit_oral" ? 6 : 12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Date orale"
                      type="date"
                      value={selectedConcours?.date_oral || ""}
                      onChange={(e) => setSelectedConcours({ ...selectedConcours, date_oral: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      sx={{ mb: 2, "& .MuiInputBase-root": { bgcolor: "white" } }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha("#F5F5F5", 0.5),
                      border: `1px dashed rgba(44, 62, 80, 0.2)`,
                    }}
                  >
                    <Button
                      variant="outlined"
                      component="label"
                      color="secondary"
                      startIcon={<CloudUpload />}
                      sx={{ borderWidth: 2 }}
                    >
                      Mettre à jour le PDF
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0]
                          setSelectedConcours({ ...selectedConcours, pdf_file: file })
                        }}
                        accept=".pdf"
                      />
                    </Button>
                    <Typography variant="body2" sx={{ color: alpha("#2C3E50", 0.7), fontStyle: "italic" }}>
                      {selectedConcours?.pdf_file
                        ? `Fichier actuel: ${
                            typeof selectedConcours.pdf_file === "string"
                              ? selectedConcours.pdf_file.split("/").pop()
                              : selectedConcours.pdf_file.name
                          }`
                        : "Aucun fichier sélectionné"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: alpha("#F5F5F5", 0.5) }}>
              <Button
                onClick={() => setOpenEditDialog(false)}
                color="secondary"
                variant="outlined"
                sx={{
                  borderColor: "#B36B39",
                  color: "#B36B39",
                  "&:hover": {
                    borderColor: "#8C4E1E",
                    backgroundColor: "rgba(179, 107, 57, 0.05)",
                  },
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                sx={{
                  backgroundColor: "#B36B39",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#8C4E1E",
                  },
                }}
              >
                Enregistrer les modifications
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default GestionConcours