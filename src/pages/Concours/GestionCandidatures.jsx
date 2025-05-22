"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Paper, TablePagination, Button, Container, Grid, CssBaseline } from '@mui/material';
import { styled, createTheme, ThemeProvider } from "@mui/material/styles"
import * as XLSX from 'xlsx';
import FiliereFilter from '../../components/Concours/FiliereFilter';
import PhaseNavigation from '../../components/Concours/PhaseNavigation';
import CandidatureActions from '../../components/Concours/CandidatureActions';
import ImportExcelData from '../../components/Concours/ImportExcelData';
import ImportExcelNotesFormat from '../../components/Concours/ImportExcelData';
import AutomaticAdmission from '../../components/Concours/AutomaticAdmission';
import CandidatTable from '../../components/Concours/CandidatTable';
import DocumentDialog from '../../components/Concours/DocumentDialog';
import axios from 'axios';

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
const [selectedFields, setSelectedFields] = useState([]);
const [extraFormula, setExtraFormula] = useState('');
const [sortByAverage, setSortByAverage] = useState(false);
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);
const [autoAdmitCount, setAutoAdmitCount] = useState(0);
const [concours, setConcours] = useState([]);
const [selectedConcoursId, setSelectedConcoursId] = useState(null);
const [afficherListe, setAfficherListe] = useState(true);
const [candidatureData, setCandidatureData] = useState([]);
const [ecritsData, setEcritsData] = useState([]);
const [oralData, setOralData] = useState([]);
const [champsConcours, setChampsConcours] = useState([]);
const [openDialog, setOpenDialog] = useState(false);
const [selectedDocs, setSelectedDocs] = useState([]);
const [selectedInscriptionId, setSelectedInscriptionId] = useState(null);

const phases = [
    { id: 'candidature', label: 'Phase de Candidature' },
    { id: 'ecrits', label: 'Phase Épreuve Écrite' },
    { id: 'oral', label: 'Phase Épreuve Orale' },
    { id: 'final', label: 'Admis Final' },
];

// Récupérer la liste des concours
useEffect(() => {
    axios.get('http://localhost:8000/api/concours/all')
        .then(response => {
            console.log("Réponse concours :", response.data);
            setConcours(response.data);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des concours:", error);
        });
}, []);

// Récupérer les champs et candidatures pour le concours sélectionné
useEffect(() => {
    if (selectedConcoursId) {
        // Récupérer les champs spécifiques au concours sélectionné
        axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/champs`)
            .then(response => {
                console.log("Champs du concours:", response.data);
                setChampsConcours(response.data);
                
                // Réinitialiser selectedFields à vide pour que la moyenne soit vide au début
                setSelectedFields([]);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des champs du concours:", error);
                setChampsConcours([]);
                setSelectedFields([]);
            });

        // Récupérer les candidatures filtrées
        axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/candidatures-filtered`)
            .then(response => {
                console.log("Candidatures filtrées:", response.data);
                setCandidatureData(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des candidatures:", error);
                setCandidatureData([]);
            });
    } else {
        setCandidatureData([]);
        setChampsConcours([]);
        setSelectedFields([]);
    }
}, [selectedConcoursId]);

// Force refresh when selectedFields changes
useEffect(() => {
    if (phase === 'candidature') {
        const newData = [...candidatureData]; // Create a shallow copy to trigger re-render
        setCandidatureData(newData);
    }
}, [selectedFields, extraFormula]);

// Récupérer les documents d'un candidat
useEffect(() => {
    if (selectedInscriptionId) {
        axios.get(`http://localhost:8000/api/candidatures/${selectedInscriptionId}/valeurs`)
            .then(response => {
                const documents = response.data
                    .filter(valeur => valeur.champ.type === 'Fichier')
                    .map(valeur => valeur.valeur);
                setSelectedDocs(documents);
                setOpenDialog(true);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des documents:", error);
                setSelectedDocs([]);
                setOpenDialog(false);
            });
    } else {
        setOpenDialog(false);
        setSelectedDocs([]);
    }
}, [selectedInscriptionId]);

const handleChangeStatus = async (id, newStatus) => {
    if (!selectedConcoursId) return;
    try {
        await axios.patch(`http://localhost:8000/api/candidatures/${id}/statut`, { statut: newStatus });
        // Mise à jour optimiste de l'UI
        setCandidatureData(prevData =>
            prevData.map(candidat =>
                candidat.id === id ? { ...candidat, statut: newStatus } : candidat
            )
        );
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
    }
};

//changement de statut pour epreuveecrit 
const handleChangeEcritStatus = async (epreuveEcritId, newStatus) => {
    try {
        await axios.patch(
            `http://localhost:8000/api/epreuves-ecrits/${epreuveEcritId}/statut`,
            { statut: newStatus }
        );
        // Mise à jour optimiste de l'UI
        setEcritsData(prev =>
            prev.map(item =>
                item.id === epreuveEcritId ? { ...item, statut: newStatus } : item
            )
        );
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de l'épreuve écrite:", error);
    }
};

//oral status 
const handleChangeOralStatus = async (epreuveOraleId, newStatus) => {
    try {
        await axios.patch(
            `http://localhost:8000/api/epreuves-orales/${epreuveOraleId}/statut`,
            { statut: newStatus }
        );
        // Mise à jour optimiste de l'UI
        setOralData(prev =>
            prev.map(item =>
                item.id === epreuveOraleId ? { ...item, statut: newStatus } : item
            )
        );
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de l'épreuve orale:", error);
    }
};

const handleFieldChange = (field) => {
    console.log("Changing field:", field);
    setSelectedFields(prevFields => {
        const newFields = prevFields.includes(field)
            ? prevFields.filter(f => f !== field)
            : [...prevFields, field];
        console.log("New selectedFields:", newFields);
        return newFields;
    });
};

const calculateSelectionAverage = (candidate) => {
    // Si aucun champ n'est sélectionné, retourner une chaîne vide
    if (selectedFields.length === 0) {
        return '';
    }

    // Récupérer les notes des semestres sélectionnés
    const selectedNotes = selectedFields.map(field => {
        // Chercher avec différentes variantes de noms (S1, Note S1, Note Semestre 1)
        const valeurFormulaire = candidate.valeursFormulaire.find(v => 
            v.champ.nom === field || 
            v.champ.nom === `Note ${field}` || 
            v.champ.nom === `Note Semestre ${field.replace('S', '')}`
        );
        
        return valeurFormulaire && !isNaN(parseFloat(valeurFormulaire.valeur)) 
            ? parseFloat(valeurFormulaire.valeur) 
            : null;
    }).filter(note => note !== null);

    if (selectedNotes.length === 0) {
        return '';
    }

    // Calculer la moyenne
    const total = selectedNotes.reduce((acc, note) => acc + note, 0);
    const average = total / selectedNotes.length;
    
    // Appliquer une formule supplémentaire si définie
    if (extraFormula) {
        try {
            // Créer un objet avec toutes les valeurs numériques du formulaire
            const candidateDataForFormula = {};
            
            // Ajouter uniquement les valeurs numériques pour éviter les problèmes de syntaxe
            candidate.valeursFormulaire.forEach(v => {
                if (!isNaN(parseFloat(v.valeur))) {
                    // Utiliser le nom du champ comme clé (avec underscores pour les espaces)
                    const fieldName = v.champ.nom.replace(/\s+/g, '_');
                    candidateDataForFormula[fieldName] = parseFloat(v.valeur);
                }
            });
            
            // Ajouter la moyenne calculée
            candidateDataForFormula.average = average;
            
            // Utiliser eval au lieu de new Function pour éviter les problèmes de syntaxe
            // Remplacer les références aux champs dans la formule
            let safeFormula = extraFormula;
            
            // Évaluer la formule de manière sécurisée
            let result;
            
            // Méthode 1: Utiliser with et eval (moins sécurisé mais plus simple)
            const formulaFunction = new Function('data', `
                with(data) {
                    try {
                        return ${safeFormula};
                    } catch(e) {
                        console.error("Erreur dans l'évaluation de la formule:", e);
                        return ${average};
                    }
                }
            `);
            
            result = formulaFunction(candidateDataForFormula);
            
            // Retourner le résultat formaté
            return parseFloat(result).toFixed(2);
        } catch (error) {
            console.error("Erreur dans la formule :", error);
            return average.toFixed(2); // En cas d'erreur, retourner la moyenne sans bonus
        }
    }
    
    // Si pas de formule, retourner simplement la moyenne
    return average.toFixed(2);
};


const handleImportData = useCallback(async (file, phaseType) => {
    if (!selectedConcoursId) return;
    
    console.log("Début de l'importation", file, phaseType);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        console.log(`Envoi vers: http://localhost:8000/api/concours/${selectedConcoursId}/${phaseType}/import`);
        
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/${phaseType}/import`, 
            formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        console.log("Réponse reçue:", response.data);
        
        if (phaseType === 'ecrits') {
            setEcritsData(response.data.data || []);
        } else if (phaseType === 'oraux') {
            setOralData(response.data.data || []);
        }
        
        return response.data;
    } catch (error) {
        console.error("Erreur complète:", error);
        throw error;
    }
}, [selectedConcoursId]);

// Fonction pour importer les notes depuis le format Excel spécifique
const handleImportNotesFromExcel = async (file) => {
    if (!file || !selectedConcoursId) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/ecrits/import-notes`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        
        if (response.data.success) {
            setEcritsData(response.data.data || []);
            return response.data;
        } else {
            throw new Error(response.data.error || "Erreur lors de l'importation");
        }
    } catch (error) {
        console.error("Erreur lors de l'importation des notes:", error);
        throw error;
    }
};

// Fonction pour importer les notes orales depuis le format Excel spécifique
const handleImportOralNotesFromExcel = async (file) => {
    if (!file || !selectedConcoursId) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/oraux/import-notes`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        
        if (response.data.success) {
            setOralData(response.data.data || []);
            return response.data;
        } else {
            throw new Error(response.data.error || "Erreur lors de l'importation");
        }
    } catch (error) {
        console.error("Erreur lors de l'importation des notes orales:", error);
        throw error;
    }
};


const getDataSetter = () => {
    if (phase === 'candidature') {
        return setCandidatureData;
    } else if (phase === 'ecrits') {
        return setEcritsData;
    } else if (phase === 'oral') {
        return setOralData;
    }
    return () => {};
};

const currentDataSetter = getDataSetter();

const getDisplayedData = () => {
    let dataToDisplay = [];
    
    if (phase === 'candidature' && candidatureData.length > 0) {
        dataToDisplay = candidatureData.map(candidat => {
            // Extraire les valeurs importantes pour l'affichage
            const anneeBac = candidat.valeursFormulaire.find(
                v => v.champ.nom === "Année d obtention du Bac"
            )?.valeur || 'N/A';
            
            const filiere = candidat.valeursFormulaire.find(
                v => v.champ.nom === "Type de diplome" || v.champ.nom === "Filière"
            )?.valeur || 'N/A';
            
            // Créer un objet avec toutes les valeurs de formulaire pour faciliter l'accès
            const formValues = {};
            candidat.valeursFormulaire.forEach(v => {
                formValues[v.champ.nom] = v.valeur;
            });

            
            return {
                ...candidat,
                name: candidat.candidat.name,
                email: candidat.candidat.email,
                telephone: candidat.candidat.telephone,
                filiere: filiere,
                anneeBac: anneeBac,
                formValues: formValues,
                
                // AJOUT : Calculer la moyenne avec bonus ici
                calculatedAverage: calculateSelectionAverage(candidat),
                // Ajouter les documents pour l'affichage
                documents: candidat.valeursFormulaire
                    .filter(v => v.champ.type === 'Fichier')
                    .map(v => v.valeur)
            };
        });
        
        // Trier par moyenne si demandé
        if (sortByAverage && selectedFields.length > 0) {
            dataToDisplay = [...dataToDisplay].sort((a, b) => {
                const avgA = a.calculatedAverage; // Utiliser la moyenne pré-calculée
                const avgB = b.calculatedAverage;
                if (avgA === '') return 1;
                if (avgB === '') return -1;
                return parseFloat(avgB) - parseFloat(avgA);
            });
        }
    
    } else if (phase === 'ecrits' && ecritsData.length > 0) {
        dataToDisplay = ecritsData;
    } else if (phase === 'oral' && oralData.length > 0) {
        dataToDisplay = oralData;
    } else if (phase === 'final' && candidatureData.length > 0) {
        // Filtrer les candidats admis pour la phase finale
        dataToDisplay = candidatureData.filter(candidate =>
            candidate.statut === "Admis en liste principale" || 
            candidate.statut === "Admis en liste d'attente"
        ).map(candidat => {
            const anneeBac = candidat.valeursFormulaire.find(
                v => v.champ.nom === "Année d obtention du Bac"
            )?.valeur || 'N/A';
            
            const filiere = candidat.valeursFormulaire.find(
                v => v.champ.nom === "Type de diplome" || v.champ.nom === "Filière"
            )?.valeur || 'N/A';
            
            return {
                ...candidat,
                name: candidat.candidat.name,
                filiere: filiere,
                anneeBac: anneeBac
            };
        });
    }

    return dataToDisplay;
};

const displayedData = getDisplayedData();

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
    if (status === "Admis en liste d'attente") {
        return 'warning.main';
    }
    return 'text.primary';
};

const handleAutomaticAdmission = async () => {
    if (!selectedConcoursId) return;
    if (!autoAdmitCount || autoAdmitCount <= 0) {
        alert("Veuillez entrer un nombre valide de candidats.");
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/resultats/automatic`, 
            { count: autoAdmitCount, phase: phase }
        );
        
        // Recharger les candidatures pour mettre à jour l'UI
        axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/candidatures-filtered`)
            .then(response => {
                setCandidatureData(response.data);
            });
            
        alert(`Admission automatique effectuée avec succès !`);
    } catch (error) {
        console.error("Erreur lors de l'admission automatique:", error);
        alert("Erreur lors de l'admission automatique.");
    }
};

const handleExportExcel = async (statut = null) => {
    if (!selectedConcoursId) return;
    
    let url;
    if (phase === 'candidature' || phase === 'final') {
        // Utilise la route existante pour les phases candidature et final
        url = `http://localhost:8000/api/concours/${selectedConcoursId}/resultats/export?phase=${phase}`;
        
        // Ajouter le statut comme paramètre supplémentaire
        if (statut) {
            url += `&statut=${encodeURIComponent(statut)}`;
        }
    } else if (phase === 'ecrits') {
        // Utilise la route spécifique pour les épreuves écrites
        url = `http://localhost:8000/api/concours/${selectedConcoursId}/ecrits/export`;
        
        // Ajouter le statut comme premier paramètre si nécessaire
        if (statut) {
            url += `?statut=${encodeURIComponent(statut)}`;
        }
    } else if (phase === 'oral') {
        // Utilise la route spécifique pour les épreuves orales
        url = `http://localhost:8000/api/concours/${selectedConcoursId}/oraux/export`;
        
        // Ajouter le statut comme premier paramètre si nécessaire
        if (statut) {
            url += `?statut=${encodeURIComponent(statut)}`;
        }
    }
    
    try {
        const response = await axios.get(url, { responseType: 'blob' });
        
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = blobUrl;
        
        // Nom de fichier selon la phase
        let filename = 'Export_Candidats.xlsx';
        if (phase === 'ecrits') filename = 'Export_Epreuves_Ecrites.xlsx';
        else if (phase === 'oral') filename = 'Export_Epreuves_Orales.xlsx';
        else if (statut && typeof statut === 'string') {
            filename = `Export_${statut.replace(/\s+/g, '_')}.xlsx`;
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Erreur lors de l'exportation Excel:", error);
        alert("Erreur lors de l'exportation des candidats.");
    }
};



const handleOpenDialog = (inscriptionId) => {
    setSelectedInscriptionId(inscriptionId);
};

const handleCloseDialog = () => {
    setSelectedInscriptionId(null);
    setOpenDialog(false);
    setSelectedDocs([]);
};

// Dans GestionCandidaturesPhases.jsx
const forceRefresh = () => {
  console.log("Force refresh appelé avec formule:", extraFormula);
  if (phase === 'candidature') {
    // Recalculer explicitement les moyennes pour tous les candidats
    setTimeout(() => {
      const updatedData = candidatureData.map(candidat => {
        // Créer une copie profonde du candidat
        const candidatCopy = JSON.parse(JSON.stringify(candidat));
        return candidatCopy;
      });
      
      console.log("Données mises à jour:", updatedData);
      setCandidatureData(updatedData);
    }, 50); // Petit délai pour s'assurer que extraFormula est à jour
  }
};

return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
            <FiliereFilter
                filiereFilter={selectedConcoursId}
                setFiliereFilter={setSelectedConcoursId}
                afficherListe={afficherListe}
                setAfficherListe={setAfficherListe}
                filieres={Array.isArray(concours) ? concours.map(c => ({ id: c.id, nom: c.title })) : []}
            />
            
            {selectedConcoursId && (
                <Paper sx={{ p: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3, width: '100%' }}>
                    <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                        Gestion des Candidatures - {concours.find(c => c.id === selectedConcoursId)?.title || 'N/A'}
                    </Typography>

                    <PhaseNavigation phase={phase} setPhase={setPhase} phases={phases} />

                 {phase === 'ecrits' && (
    <>
       
        <ImportExcelNotesFormat phase={phase} handleImportNotes={handleImportNotesFromExcel} />
    </>
)}

                    {phase === 'oral' && (
    <>
       
        <ImportExcelNotesFormat phase={phase} handleImportNotes={handleImportOralNotesFromExcel} />
    </>
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
                            key={selectedConcoursId}
                            selectedFields={selectedFields}
                            handleFieldChange={handleFieldChange}
                            extraFormula={extraFormula}
                            setExtraFormula={setExtraFormula}
                            sortByAverage={sortByAverage}
                            setSortByAverage={setSortByAverage}
                            dynamicFields={champsConcours.filter(champ => 
                                champ.nom.includes('Note Semestre') || 
                                champ.nom.includes('Note S') ||
                                champ.categorie === 'Académique'

                               
                            )}
                            forceRefresh={forceRefresh} // Ajouter cette prop
                        />
                    )}

                    <CandidatTable
                        key={selectedFields.join('-')} // Cette clé change quand selectedFields change
                        currentData={displayedData}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangeStatus={
                            phase === 'ecrits'
                                ? handleChangeEcritStatus
                                : phase === 'oral'
                                    ? handleChangeOralStatus
                                    : handleChangeStatus
                        }
                        getStatusColor={getStatusColor}
                        phase={phase}
                        calculateSelectionAverage={calculateSelectionAverage}
                        handleOpenDialog={handleOpenDialog}
                        setEcritsData={setEcritsData}
                        setOralData={setOralData}
                        dynamicFields={champsConcours.filter(champ => 
                            champ.nom.includes('Semestre') || 
                            champ.categorie === 'Académique'
                        )}
                        selectedConcoursId={selectedConcoursId}
                        selectedFields={selectedFields}
                    />
                    
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
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
                        <Button variant="contained" onClick={handleExportExcel} sx={{ mt: 3 }}>
                            Exporter les candidats admis
                        </Button>
                    )}
                    
                    {phase === 'final' && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-start' }}>
                            <Button
                                variant="contained"
                                onClick={() => handleExportExcel('Admis en liste principale')}
                            >
                                Télécharger Liste Principale
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => handleExportExcel('Admis en liste d\'attente')}
                            >
                                Télécharger Liste d'Attente
                            </Button>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    </ThemeProvider>
);
};

export default GestionCandidaturesPhases;
