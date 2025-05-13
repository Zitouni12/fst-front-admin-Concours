// CreationFormulaire.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    List,
    ListItem,
    ListItemText,
    Paper,
    Divider,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

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
        h4: {
            fontSize: "2rem",
            fontWeight: 700,
            color: secondaryColor,
        },
        h6: {
            fontSize: "1.2rem",
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
});

const CreationFormulaire = () => {
    const [personalFields, setPersonalFields] = useState([]);
    const [selectedPersonalFields, setSelectedPersonalFields] = useState([]); // array of objects: { id, obligatoire }
    const [selectedAcademicFields, setSelectedAcademicFields] = useState([]); // array of objects: { id, obligatoire }
    const [academicFields, setAcademicFields] = useState([]);
    const [concoursList, setConcoursList] = useState([]); // Liste des concours
    const [selectedContest, setSelectedContest] = useState('');
    const [newCustomField, setNewCustomField] = useState({
        name: '',
        type: 'Texte',
        category: 'Personnelle',
        description: '',
        required: false,
    });
    const [createdForms, setCreatedForms] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true); // Ajout d'un état de chargement
    const [error, setError] = useState(null); // Ajout d'un état d'erreur
    const [selectedForm, setSelectedForm] = useState(null);
    const [openDetails, setOpenDetails] = useState(false);

    // Récupérer les champs personnels, académiques et les concours depuis l'API backend
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Récupérer les champs personnels
                const responsePersonal = await axios.get('http://localhost:8000/api/champs?category=Personnelle');
                console.log('Réponse API Champs Personnels:', responsePersonal.data); // Vérifiez la structure
                setPersonalFields(responsePersonal.data);

                // Récupérer les champs académiques
                const responseAcademic = await axios.get('http://localhost:8000/api/champs?category=Académique');
                console.log('Réponse API Champs Académiques:', responseAcademic.data); // Vérifiez la structure
                setAcademicFields(responseAcademic.data);

                // Récupérer les concours
                const responseConcours = await axios.get('http://localhost:8000/api/concours');
                console.log('Réponse API Concours:', responseConcours.data.data); // Vérifiez la structure
                setConcoursList(responseConcours.data.data);

                // 🆕 Charger les formulaires existants
                const responseFormulaires = await axios.get('http://localhost:8000/api/formulaires');
                console.log("Réponse brute:", responseFormulaires);
console.log("Réponse .data:", responseFormulaires?.data);
setCreatedForms(responseFormulaires?.data ?? []);
            } catch (err) {
                console.error('Erreur lors du chargement des champs ou des concours:', err);
                setError(err.message || 'Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Ajouter un champ personnalisé
    const handleAddCustomField = async () => {
        if (newCustomField.name.trim() !== '') {
            try {
                const response = await axios.post('http://localhost:8000/api/champs', {
                    nom: newCustomField.name,
                    type: newCustomField.type,
                    categorie: newCustomField.category,
                    description: newCustomField.description,
                });

                if (newCustomField.category === 'Personnelle') {
                    setPersonalFields([...personalFields, response.data]);
                } else if (newCustomField.category === 'Académique') {
                    setAcademicFields([...academicFields, response.data]);
                }

                setNewCustomField({
                    name: '',
                    type: 'Texte',
                    category: 'Personnelle',
                    description: '',
                    required: false,
                });
            } catch (error) {
                console.error('Erreur lors de l\'ajout du champ:', error);
            }
        }
    };

    // Supprimer un champ personnel
    const handleDeletePersonalField = async (fieldId) => {
        try {
            await axios.delete(`http://localhost:8000/api/champs/${fieldId}`);
            setPersonalFields(personalFields.filter((field) => field.id !== fieldId));
        } catch (error) {
            console.error('Erreur lors de la suppression du champ:', error);
        }
    };

    // Soumettre le formulaire
    const handleSubmit = async () => {
        if (!selectedContest) {
            alert("Veuillez sélectionner un concours.");
            return;
        }

        const formFields = [
            ...selectedPersonalFields.map(f => ({
                champ_id: f.id,
                obligatoire: true // Obligatoire par défaut pour les champs personnels
            })),
            ...selectedAcademicFields.map(f => ({
                champ_id: f.id,
                obligatoire: f.obligatoire
            }))
        ];

        if (formFields.length === 0) {
            alert("Veuillez sélectionner au moins un champ pour le formulaire.");
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/formulaires', {
                concours_id: selectedContest,
                champs: formFields
            });
            alert('Formulaire créé avec succès !');
            // Réinitialiser les sélections après la soumission
            setSelectedPersonalFields([]);
            setSelectedAcademicFields([]);
            setSelectedContest('');
            setPage(1);
            // Recharger la liste des formulaires créés
            const responseFormulaires = await axios.get('http://localhost:8000/api/formulaires');
            const formulaires = responseFormulaires.data.data || [];
            setCreatedForms(formulaires);
        } catch (error) {
            console.error('Erreur lors de la création du formulaire :', error);
            alert('Erreur lors de la création du formulaire.');
        }
    };

    // Fonction pour changer de page (Précédent / Suivant)
    const handlePageChange = (direction) => {
        setPage((prevPage) => (direction === 'next' ? prevPage + 1 : prevPage - 1));
    };

    const handleViewDetails = (form) => {
        setSelectedForm(form);
        setOpenDetails(true);
    };

    if (loading) {
        return <Typography align="center">Chargement des données...</Typography>;
    }

    if (error) {
        return <Typography align="center" color="error">Erreur: {error}</Typography>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ p: 5 }}>
                <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Gestion des Formulaires d'Inscription
                </Typography>

                {/* Formulaires créés */}
                <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 2 }}>
                        Formulaires créés
                    </Typography>
                    <Divider sx={{ my: 2, backgroundColor: theme.palette.secondary.light }} />
                    {Array.isArray(createdForms) && createdForms.length > 0 ? (
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ backgroundColor: theme.palette.grey[200] }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.secondary.dark }}>Concours</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {createdForms.map((form, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                <Typography fontWeight="bold" color={theme.palette.secondary.main}>
                                                    {form.contestName || form.nom || 'Nom inconnu'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleViewDetails(form)}
                                                    sx={{
                                                        backgroundColor: "#B36B39",
                                                        color: "#ffffff",
                                                        "&:hover": {
                                                            backgroundColor: "#8C4E1E",
                                                        },
                                                    }}
                                                >
                                                    Voir détails
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body1" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                            Aucun formulaire créé pour le moment.
                        </Typography>
                    )}
                </Paper>

                {/* Dialog pour les détails */}
                <Dialog
                    open={openDetails}
                    onClose={() => setOpenDetails(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{ backgroundColor: "#B36B39", color: "#ffffff" }}>
                        Détails du formulaire
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        {selectedForm && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    {selectedForm.contestName || selectedForm.nom || 'Nom inconnu'}
                                </Typography>
                                
                                {/* Champs personnels */}
                                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                    Champs personnels
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Nom</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Obligatoire</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Array.isArray(selectedForm.fields) && selectedForm.fields
                                                .filter(f => personalFields.find(pf => pf.id === f.champ_id))
                                                .map((f, i) => {
                                                    const champ = personalFields.find(pf => pf.id === f.champ_id);
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell>{champ?.nom}</TableCell>
                                                            <TableCell>{champ?.type}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={f.obligatoire ? "Oui" : "Non"}
                                                                    size="small"
                                                                    color={f.obligatoire ? "primary" : "default"}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Champs académiques */}
                                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
                                    Champs académiques
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Nom</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Obligatoire</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Array.isArray(selectedForm.fields) && selectedForm.fields
                                                .filter(f => academicFields.find(af => af.id === f.champ_id))
                                                .map((f, i) => {
                                                    const champ = academicFields.find(af => af.id === f.champ_id);
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell>{champ?.nom}</TableCell>
                                                            <TableCell>{champ?.type}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={f.obligatoire ? "Oui" : "Non"}
                                                                    size="small"
                                                                    color={f.obligatoire ? "primary" : "default"}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenDetails(false)}
                            sx={{
                                color: "#B36B39",
                                "&:hover": {
                                    backgroundColor: "rgba(179, 107, 57, 0.05)",
                                },
                            }}
                        >
                            Fermer
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Sélection du concours */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Sélectionnez le concours</Typography>
                        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                            <InputLabel id="contest-select-label">Concours</InputLabel>
                            <Select
                                labelId="contest-select-label"
                                id="contest-select"
                                value={selectedContest}
                                onChange={(e) => setSelectedContest(e.target.value)}
                            >
                                {Array.isArray(concoursList) && concoursList.length > 0 ? (
                                    concoursList.map((concours) => (
                                        <MenuItem key={concours.id} value={concours.id}>
                                            {concours.title}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="">Aucun concours disponible</MenuItem>
                                )}
                            </Select>
                            </FormControl>
                    </CardContent>
                </Card>

                {/* Champs personnels */}
                {page === 1 && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Champs personnels</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Inclure</TableCell>
                                            <TableCell>Nom</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Obligatoire</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(personalFields) && personalFields.map((field) => {
                                            const isSelected = selectedPersonalFields.find(f => f.id === field.id);
                                            return (
                                                <TableRow key={field.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={!!isSelected}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedPersonalFields([
                                                                        ...selectedPersonalFields,
                                                                        { id: field.id, obligatoire: true }
                                                                    ]);
                                                                } else {
                                                                    setSelectedPersonalFields(
                                                                        selectedPersonalFields.filter(f => f.id !== field.id)
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{field.nom}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {field.type}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox disabled checked={isSelected?.obligatoire || true} />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => handlePageChange('next')}
                                disabled={selectedContest === ''}
                            >
                                Suivant
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Champs académiques */}
                {page === 2 && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Champs académiques</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Inclure</TableCell>
                                            <TableCell>Nom</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Obligatoire</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(academicFields) && academicFields.map((field) => {
                                            const isSelected = selectedAcademicFields.find(f => f.id === field.id);
                                            return (
                                                <TableRow key={field.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={!!isSelected}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedAcademicFields([
                                                                        ...selectedAcademicFields,
                                                                        { id: field.id, obligatoire: false }
                                                                    ]);
                                                                } else {
                                                                    setSelectedAcademicFields(
                                                                        selectedAcademicFields.filter(f => f.id !== field.id)
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{field.nom}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {field.type}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            disabled={!isSelected}
                                                            checked={isSelected?.obligatoire || false}
                                                            onChange={(e) => {
                                                                setSelectedAcademicFields(
                                                                    selectedAcademicFields.map(f =>
                                                                        f.id === field.id ? { ...f, obligatoire: e.target.checked } : f
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handlePageChange('previous')}
                                >
                                    Précédent
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={selectedContest === '' || (selectedPersonalFields.length === 0 && selectedAcademicFields.length === 0)}
                                >
                                    Soumettre le formulaire
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Ajouter un champ personnalisé */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ajouter un champ personnalisé</Typography>
                        <TextField
                            label="Nom du champ"
                            fullWidth
                            value={newCustomField.name}
                            onChange={(e) => setNewCustomField({ ...newCustomField, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={newCustomField.type}
                                onChange={(e) => setNewCustomField({ ...newCustomField, type: e.target.value })}
                            >
                                <MenuItem value="Texte">Texte</MenuItem>
                                <MenuItem value="Nombre">Nombre</MenuItem>
                                <MenuItem value="Fichier">Fichier</MenuItem>
                                <MenuItem value="Date">Date</MenuItem>
                                <MenuItem value="Image">Image</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Catégorie</InputLabel>
                            <Select
                                value={newCustomField.category}
                                onChange={(e) => setNewCustomField({ ...newCustomField, category: e.target.value })}
                            >
                                <MenuItem value="Personnelle">Personnelle</MenuItem>
                                <MenuItem value="Académique">Académique</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={2}
                            value={newCustomField.description}
                            onChange={(e) => setNewCustomField({ ...newCustomField, description: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleAddCustomField}
                        >
                            Ajouter le champ
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default CreationFormulaire;