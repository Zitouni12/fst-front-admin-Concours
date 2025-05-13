"use client"
import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper, TablePagination, Button, Container, Grid, CssBaseline } from '@mui/material';
import { styled, createTheme, ThemeProvider } from "@mui/material/styles"
import * as XLSX from 'xlsx';
import FiliereFilter from '../../components/Concours/FiliereFilter';
import PhaseNavigation from '../../components/Concours/PhaseNavigation';
import CandidatureActions from '../../components/Concours/CandidatureActions';
import ImportExcelData from '../../components/Concours/ImportExcelData';
import AutomaticAdmission from '../../components/Concours/AutomaticAdmission';
import CandidatTable from '../../components/Concours/CandidatTable';
import DocumentDialog from '../../components/Concours/DocumentDialog';

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

const ColorBox = ({ bgcolor, color = "#fff", children }) => (
    <Box
        sx={{
            width: "100%",
            height: 100,
            backgroundColor: bgcolor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: color,
            marginBottom: 16,
            borderRadius: 8,
        }}
    >
        {children}
    </Box>
);

const GestionCandidaturesPhases = () => {
    const [phase, setPhase] = useState('candidature');
    const [selectedFields, setSelectedFields] = useState(['S1', 'S2', 'S3', 'S4']);
    const [extraFormula, setExtraFormula] = useState('');
    const [sortByAverage, setSortByAverage] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [autoAdmitCount, setAutoAdmitCount] = useState(0);
    const [filiereFilter, setFiliereFilter] = useState('');
    const [afficherListe, setAfficherListe] = useState(false);
    const [candidatureData, setCandidatureData] = useState([
        { id: 1, name: 'Alice Dupont', status: "Admis en liste principale", filiere: "Ingénierie des Réseaux et Systèmes Informatiques", bacYear: 2021, S1: 14, S2: 15, S3: 13, S4: 14, S5: 15, S6: 16, documents: ["docs/Concours.pdf"], writtenAverage: null, oralAverage: null },
        { id: 2, name: 'Bob Martin', status: 'Candidature rejetée', filiere: "Génie électrique", bacYear: 2020, S1: 12, S2: 11, S3: 10, S4: 12, S5: 11, S6: 13, writtenAverage: null, oralAverage: null },
        { id: 3, name: 'Claire Dubois', status: "Admis en liste d attente", filiere: "Ingénierie des Réseaux et Systèmes Informatiques", bacYear: 2022, S1: 15, S2: 14, S3: 15, S4: 14, S5: 15, S6: 14, writtenAverage: null, oralAverage: null },
        { id: 5, name: 'Eve Garcia', status: 'Admis à l\'épreuve orale', filiere: "Génie électrique", bacYear: 2021, S1: 13, S2: 14, S3: 12, S4: 13, S5: 14, S6: 15, writtenAverage: null, oralAverage: null },
        { id: 6, name: 'Frank Thomas', status: 'Non Admis', filiere: "Ingénierie des Réseaux et Systèmes Informatiques", bacYear: 2020, S1: 11, S2: 10, S3: 11, S4: 10, S5: 12, S6: 11, writtenAverage: null, oralAverage: null },
        { id: 8, name: 'Henri Leroy', status: "Admis en liste principale", filiere: "Ingénierie des Réseaux et Systèmes Informatiques", bacYear: 2023, S1: 15, S2: 16, S3: 15, S4: 16, S5: 15, S6: 16, writtenAverage: null, oralAverage: null },
        { id: 9, name: 'Isabelle Roux', status: "Admis en liste d'attente", filiere: "Ingénierie des Réseaux et Systèmes Informatiques", bacYear: 2021, S1: 12, S2: 13, S3: 12, S4: 13, S5: 12, S6: 13, writtenAverage: null, oralAverage: null },
    ]);
    const [ecritsData, setEcritsData] = useState([]);
    const [oralData, setOralData] = useState([]);
    const phases = [
        { id: 'candidature', label: 'Phase de Candidature' },
        { id: 'ecrits', label: 'Phase Épreuve Écrite' },
        { id: 'oral', label: 'Phase Épreuve Orale' },
        { id: 'final', label: 'Admis Final' },
    ];
    const filieres = [
        'Génie électrique',
        'Ingénierie des Réseaux et Systèmes Informatiques',
        'Génie Civil'
    ];
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState([]);

    const handleChangeStatus = (id, newStatus) => {
        currentDataSetter((prevData) =>
            prevData.map((row) =>
                row.id === id ? { ...row, status: newStatus } : row
            )
        );
    };

    const handleFieldChange = (field) => {
        setSelectedFields(prevFields =>
            prevFields.includes(field)
                ? prevFields.filter(f => f !== field)
                : [...prevFields, field]
        );
    };

    const calculateSelectionAverage = (candidate) => {
        const selectedNotes = selectedFields.map(field => candidate[field]).filter(note => typeof note === 'number');
        if (selectedNotes.length === 0) {
            return 'N/A';
        }
        const total = selectedNotes.reduce((acc, note) => acc + note, 0);
        const average = total / selectedNotes.length;
        let additionalPoints = 0;

        if (extraFormula) {
            try {
                const { bacYear, filiere, S1, S2, S3, S4, S5, S6 } = candidate;
                const calcFunc = new Function('bacYear', 'filiere', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'average', `return ${extraFormula};`);
                additionalPoints = calcFunc(bacYear, filiere, S1, S2, S3, S4, S5, S6, average);
            } catch (error) {
                console.error("Erreur dans la formule :", error);
                alert("Votre formule contient une erreur. Veuillez la vérifier.");
                additionalPoints = 0;
            }
        }
        return (average + additionalPoints).toFixed(2);
    };

    const handleImportData = useCallback((file, phaseType) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            if (arrayBuffer instanceof ArrayBuffer) {
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                if (jsonData && jsonData.length > 0) {
                    const newData = jsonData.map((row, index) => ({
                        id: index + 1,
                        name: row['Nom'] !== undefined ? row['Nom'] : '',
                        filiere: row['Filière'] !== undefined ? row['Filière'] : 'Non spécifiée',
                        bacYear: row['Année Bac'] !== undefined ? row['Année Bac'] : 'N/A',
                        writtenAverage: phaseType === 'ecrits' && row['Moyenne Écrit'] !== undefined ? parseFloat(row["Moyenne Écrit"]) : null,
                        oralAverage: phaseType === 'oral' && row['Moyenne Oral'] !== undefined ? parseFloat(row["Moyenne Oral"]) : null,
                    }));
                    if (phaseType === 'ecrits') {
                        setEcritsData(newData);
                    } else if (phaseType === 'oral') {
                        setOralData(newData);
                    }
                } else {
                    alert('Le fichier Excel est vide ou le format est incorrect.');
                }
            }
        };
        reader.readAsArrayBuffer(file);
    }, [setEcritsData, setOralData]);

    const getDataSetter = () => {
        if (phase === 'candidature') {
            return setCandidatureData;
        } else if (phase === 'ecrits') {
            return setEcritsData;
        } else if (phase === 'oral') {
            return setOralData;
        }
        return () => { };
    };

    const currentDataSetter = getDataSetter();

    const getDisplayedData = () => {
        let dataToDisplay;
        if (phase === 'candidature') {
            dataToDisplay = candidatureData;
            if (sortByAverage) {
                dataToDisplay = [...dataToDisplay].sort((a, b) => {
                    const avgA = calculateSelectionAverage(a);
                    const avgB = calculateSelectionAverage(b);
                    if (avgA === 'N/A') return 1;
                    if (avgB === 'N/A') return -1;
                    return parseFloat(avgB) - parseFloat(avgA);
                });
            }
        } else if (phase === 'ecrits') {
            dataToDisplay = ecritsData;
        } else if (phase === 'oral') {
            dataToDisplay = oralData;

        } else if (phase === 'final') {
            // Afficher uniquement les candidats "Admis en liste principale" ou "Admis"
            dataToDisplay = candidatureData.filter(candidate =>
                candidate.status === "Admis en liste principale" || candidate.status === "Admis en liste d'attente"
            );
        }
        else {
            dataToDisplay = [];
        }

        return filiereFilter === 'Toutes'
            ? dataToDisplay
            : dataToDisplay.filter(c => c.filiere === filiereFilter);
    };

    const displayedData = getDisplayedData();
    const currentData = displayedData;

    const getStatusColor = (status) => {
        if (
            status === "Admis à l'épreuve écrite" ||
            status === "Admis à l'épreuve orale" ||
            status === "Admis en liste principale" ||
            status === "Admis"
        ) {
            return 'success.main';
        }
        if (status === "Non Admis" || status === "Candidature rejetée") {
            return 'error.main';
        }
        if (status === "Admis en liste d\'attente") {
            return 'warning.main';
        }
        return 'text.primary';
    };

    //handleExportExcelv1
    const handleExportExcelv1 = () => {

        const dataToExport = displayedData.filter(row =>

            row.status.includes("Admis") && !row.status.includes("Non Admis") &&

            (filiereFilter === 'Toutes' || row.filiere === filiereFilter)

        );



        if (dataToExport.length === 0) {

            alert("Aucun candidat admis à exporter pour la filière sélectionnée !");

            return;

        }

        const ws = XLSX.utils.json_to_sheet(dataToExport.map(row => ({
            Nom: row.name, Filière: row.filiere, "Année Bac": row.bacYear, Statut: row.status
        })));

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Candidats Admis");

        XLSX.writeFile(wb, "Candidats_Admis.xlsx");

    };

    const handleExportExcel = (data, fileName) => {
        if (data.length === 0) {
            alert(`Aucun candidat à exporter dans la liste ${fileName.replace('.xlsx', '').toLowerCase()} pour la filière sélectionnée !`);
            return;
        }
        const ws = XLSX.utils.json_to_sheet(data.map(row => ({
            Nom: row.name,
            Filière: row.filiere,
            "Année Bac": row.bacYear,
            Statut: row.status
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, fileName.replace('.xlsx', ''));
        XLSX.writeFile(wb, fileName);
    };

    const handleExportAdmisPrincipale = () => {
        const dataToExport = displayedData.filter(row =>
            row.status === "Admis en liste principale" &&
            (filiereFilter === 'Toutes' || row.filiere === filiereFilter)
        ).sort((a, b) => a.name.localeCompare(b.name));
        handleExportExcel(dataToExport, "Liste_Principale.xlsx");
    };

    const handleExportAdmisAttente = () => {
        const dataToExport = displayedData.filter(row =>
            row.status === "Admis en liste d\'attente" &&
            (filiereFilter === 'Toutes' || row.filiere === filiereFilter)
        ).sort((a, b) => {
            const avgA = calculateSelectionAverage(a);
            const avgB = calculateSelectionAverage(b);
            if (avgA === 'N/A') return 1;
            if (avgB === 'N/A') return -1;
            return parseFloat(avgB) - parseFloat(avgA);
        });
        handleExportExcel(dataToExport, "Liste_Attente.xlsx");
    };

    const handleOpenDialog = (docs) => {
        setSelectedDocs(docs);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleAutomaticAdmission = () => {
        if (!autoAdmitCount || autoAdmitCount <= 0) {
            alert("Veuillez entrer un nombre valide de candidats.");
            return;
        }

        const currentlyAdmitted = [...displayedData].filter(candidate => {
            if (phase === 'candidature') {
                return candidate.status === "Admis à l'épreuve écrite";
            } else if (phase === 'ecrits') {
                return candidate.status === "Admis à l'épreuve orale";
            } else if (phase === 'oral') {
                return candidate.status === "Admis en liste principale" || candidate.status === "Admis";
            }
            return false;
        });

        const sortedAdmitted = [...currentlyAdmitted].sort((a, b) => {
            const avgA = calculateSelectionAverage(a);
            const avgB = calculateSelectionAverage(b);
            if (avgA === 'N/A') return 1;
            if (avgB === 'N/A') return -1;
            return parseFloat(avgB) - parseFloat(avgA);
        });

        const toKeep = sortedAdmitted.slice(0, autoAdmitCount);
        const toReject = sortedAdmitted.slice(autoAdmitCount);

        currentDataSetter(prevData =>
            prevData.map(candidate => {
                const isToKeep = toKeep.some(k => k.id === candidate.id);
                const isToReject = toReject.some(r => r.id === candidate.id);

                if (isToKeep) {
                    return candidate;
                } else if (isToReject) {
                    return { ...candidate, status: "Non Admis" };
                }
                return candidate;
            })
        );

        alert(`${toKeep.length} candidats conservent leur statut d'admission et ${toReject.length} ont été marqués comme "Non Admis" pour la phase ${phases.find(p => p.id === phase)?.label}.`);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
                <FiliereFilter
                    filiereFilter={filiereFilter}
                    setFiliereFilter={setFiliereFilter}
                    afficherListe={afficherListe}
                    setAfficherListe={setAfficherListe}
                    filieres={filieres}
                />
                <Paper sx={{ p: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3, width: '100%' }}>
                    <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                        Gestion des Candidatures
                    </Typography>

                    <PhaseNavigation phase={phase} setPhase={setPhase} phases={phases} />

                    {phase === 'ecrits' && (
                        <ImportExcelData phase={phase} handleImportData={handleImportData} />
                    )}

                    {phase === 'oral' && (
                        <ImportExcelData phase={phase} handleImportData={handleImportData} />
                    )}

                    {phase !== 'final' && (
                        <AutomaticAdmission
                            autoAdmitCount={autoAdmitCount}
                            setAutoAdmitCount={setAutoAdmitCount}
                            handleAutomaticAdmission={handleAutomaticAdmission}
                        />
                    )}
                    {phase === 'candidature' && (
                        <CandidatureActions
                            selectedFields={selectedFields}
                            handleFieldChange={handleFieldChange}
                            extraFormula={extraFormula}
                            setExtraFormula={setExtraFormula}
                            sortByAverage={sortByAverage}
                            setSortByAverage={setSortByAverage}
                        />
                    )}


                    <CandidatTable
                        currentData={currentData}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangeStatus={handleChangeStatus}
                        getStatusColor={getStatusColor}
                        phase={phase}
                        calculateSelectionAverage={calculateSelectionAverage}
                        handleOpenDialog={handleOpenDialog}
                        setEcritsData={setEcritsData}
                        setOralData={setOralData}
                    />

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={displayedData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                    />

                    <DocumentDialog
                        openDialog={openDialog}
                        handleCloseDialog={handleCloseDialog}
                        selectedDocs={selectedDocs}
                    />

                    {phase !== 'final' && (
                        <Button variant="contained" onClick={handleExportExcelv1} sx={{ mt: 3 }}>
                            Exporter les candidats admis
                        </Button>
                    )}
                    {phase === 'final' && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-start' }}>

                            <Button variant="contained" onClick={handleExportAdmisPrincipale}>
                                Télécharger Liste Principale
                            </Button>

                            <Button variant="contained" onClick={handleExportAdmisAttente}>
                                Télécharger Liste d'Attente
                            </Button>

                        </Box>
                    )}

                    <DocumentDialog

                        openDialog={openDialog}

                        handleCloseDialog={handleCloseDialog}

                        selectedDocs={selectedDocs}

                    />
                </Paper>
            </Box>
        </ThemeProvider>
    );
};

const StyleGuide = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h1">Charte Graphique UCA</Typography>

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
export default GestionCandidaturesPhases;
