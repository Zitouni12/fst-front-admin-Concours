"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Paper, TablePagination, Button, Container, Grid, CssBaseline, Chip } from '@mui/material';
import { styled, createTheme, ThemeProvider } from "@mui/material/styles"
import { Switch } from '@mui/material'
import * as XLSX from 'xlsx';
import FiliereFilter from '../../components/Concours/FiliereFilter';
import PhaseNavigation from '../../components/Concours/PhaseNavigation';
import CandidatureActions from '../../components/Concours/CandidatureActions';
import ImportExcelData from '../../components/Concours/ImportExcelData';
import ImportExcelNotesFormat from '../../components/Concours/ImportExcelData';
import AutomaticAdmission from '../../components/Concours/AutomaticAdmission';
import CandidatTable from '../../components/Concours/CandidatTable';
import FinalAdmissionsTable from '../../components/Concours/FinalAdmissionsTable';
import DocumentDialog from '../../components/Concours/DocumentDialog';
import SuccessAlert from '../../components/Concours/SuccessAlert';
// Importez le nouveau composant
import AdmissionAlert from '../../components/Concours/AdmissionAlert';
import DashboardHome from '../../components/Concours/DashboardHome';
import WelcomePage from '../../components/Concours/WelcomePage';
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
    const [selectedConcours, setSelectedConcours] = useState(null); // Nouveau state
    const [afficherListe, setAfficherListe] = useState(true);
    const [candidatureData, setCandidatureData] = useState([]);
    const [ecritsData, setEcritsData] = useState([]);
    const [oralData, setOralData] = useState([]);
    const [finalAdmissionsData, setFinalAdmissionsData] = useState([]);
    const [champsConcours, setChampsConcours] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState([]);
    const [selectedInscriptionId, setSelectedInscriptionId] = useState(null);
   /////////
   const [scoreMeriteConfig, setScoreMeriteConfig] = useState(null);
  const [sortByNote, setSortByNote] = useState(false); // NOUVEAU STATE pour le tri par note
const [scoreMeriteConfigEcrits, setScoreMeriteConfigEcrits] = useState(null);
const [scoreMeriteConfigOral, setScoreMeriteConfigOral] = useState(null);
const [successAlert, setSuccessAlert] = useState(null);

const [autoAdmitCountLP, setAutoAdmitCountLP] = useState(0);
const [autoAdmitCountLA, setAutoAdmitCountLA] = useState(0);
// Ajoutez ce state
const [admissionAlert, setAdmissionAlert] = useState(null);
    // Fonction pour générer les phases selon le type d'épreuve
    const getAvailablePhases = (typeEpreuve) => {
        const basePhases = [
            { id: 'candidature', label: 'Phase de Candidature' }
        ];

        if (typeEpreuve === 'ecrit') {
            return [
                ...basePhases,
                { id: 'ecrits', label: 'Phase Épreuve Écrite' },
                { id: 'final', label: 'Admis Final' }
            ];
        } else if (typeEpreuve === 'oral') {
            return [
                ...basePhases,
                { id: 'oral', label: 'Phase Épreuve Orale' },
                { id: 'final', label: 'Admis Final' }
            ];
        } else if (typeEpreuve === 'ecrit_oral') {
            return [
                ...basePhases,
                { id: 'ecrits', label: 'Phase Épreuve Écrite' },
                { id: 'oral', label: 'Phase Épreuve Orale' },
                { id: 'final', label: 'Admis Final' }
            ];
        }

        // Par défaut, toutes les phases
        return [
            ...basePhases,
            { id: 'ecrits', label: 'Phase Épreuve Écrite' },
            { id: 'oral', label: 'Phase Épreuve Orale' },
            { id: 'final', label: 'Admis Final' }
        ];
    };

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

    // Récupérer les détails du concours sélectionné
    useEffect(() => {
        if (selectedConcoursId) {
            axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}`)
                .then(response => {
                    console.log("Détails du concours:", response.data);
                    setSelectedConcours(response.data);
                    
                    // Réinitialiser la phase à 'candidature' quand on change de concours
                    setPhase('candidature');
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des détails du concours:", error);
                    setSelectedConcours(null);
                });
        } else {
            setSelectedConcours(null);
        }
    }, [selectedConcoursId]);

    // Récupérer les champs et candidatures pour le concours sélectionné
    useEffect(() => {
        if (selectedConcoursId) {
            // Récupérer les champs spécifiques au concours sélectionné
            axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/champs`)
                .then(response => {
                    console.log("Champs du concours:", response.data);
                    setChampsConcours(response.data);
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

    // Charger les données pour la phase finale
    useEffect(() => {
        if (selectedConcoursId && phase === 'final') {
           axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/final/admissions`)
     
                .then(response => {
                    console.log("Admissions finales:", response.data);
                    setFinalAdmissionsData(response.data);
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des admissions finales:", error);
                    setFinalAdmissionsData([]);
                });
        }
    }, [selectedConcoursId, phase]);

    // Vérifier si la phase actuelle est disponible pour le type d'épreuve
    useEffect(() => {
        if (selectedConcours) {
            const availablePhases = getAvailablePhases(selectedConcours.type_epreuve);
            const currentPhaseExists = availablePhases.some(p => p.id === phase);
            
            if (!currentPhaseExists) {
                setPhase('candidature'); // Revenir à la phase candidature si la phase actuelle n'est pas disponible
            }
        }
    }, [selectedConcours, phase]);

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
                    setSelectedDocs(response.data);
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
                
                // Évaluer la formule de manière sécurisée
                let result;
                
                // Méthode 1: Utiliser with et eval (moins sécurisé mais plus simple)
                const formulaFunction = new Function('data', `
                    with(data) {
                        try {
                            return ${extraFormula};
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
                
                // Calculer la moyenne avec bonus ici
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
                const avgA = a.calculatedAverage;
                const avgB = b.calculatedAverage;
                if (avgA === '') return 1;
                if (avgB === '') return -1;
                return parseFloat(avgB) - parseFloat(avgA);
            });
        }
    
    } else if (phase === 'ecrits' && ecritsData.length > 0) {
        dataToDisplay = ecritsData;
        // NOUVEAU : Tri par note écrite si demandé
      if (sortByNote) {
            dataToDisplay = [...dataToDisplay].sort((a, b) => {
                const scoreA = parseFloat(a.score_merite) || 0;
                const scoreB = parseFloat(b.score_merite) || 0;
                return scoreB - scoreA; // Tri décroissant
            });
        }
    } else if (phase === 'oral' && oralData.length > 0) {
        dataToDisplay = oralData;
        // NOUVEAU : Tri par note orale si demandé
        if (sortByNote) {
            dataToDisplay = [...dataToDisplay].sort((a, b) => {
                const scoreA = parseFloat(a.score_merite) || 0;
                const scoreB = parseFloat(b.score_merite) || 0;
                return scoreB - scoreA; // Tri décroissant
            });
        }
    } else if (phase === 'final' && finalAdmissionsData.length > 0) {
        dataToDisplay = finalAdmissionsData.map(admission => {
            // Extraire les valeurs importantes pour l'affichage
            const anneeBac = admission.valeursFormulaire?.find(
                v => v.champ && v.champ.nom === "Année d obtention du Bac"
            )?.valeur || 'N/A';
            
            const filiere = admission.valeursFormulaire?.find(
                v => v.champ && (v.champ.nom === "Type de diplome" || v.champ.nom === "Filière")
            )?.valeur || 'N/A';
            
            // Extraire le nom et prénom
            const nom = admission.valeursFormulaire?.find(v => v.champ && v.champ.nom === "Nom")?.valeur || admission.candidat?.name || 'N/A';
            const prenom = admission.valeursFormulaire?.find(v => v.champ && v.champ.nom === "Prénom")?.valeur || '';
            const email = admission.valeursFormulaire?.find(v => v.champ && (v.champ.nom === "Email" || v.champ.nom === "Adresse E-mail Personnelle"))?.valeur || admission.candidat?.email || 'N/A';
            
            return {
                ...admission,
                name: nom,
                prenom: prenom,
                email: email,
                filiere: filiere,
                anneeBac: anneeBac,
                rang: admission.statut === 'Admis liste principale' ? 'LP' : 'LA',
                rang_numero: 0 // Sera calculé ci-dessous
            };
        });
        
        // NOUVEAU : Tri par score mérite si demandé
        if (sortByNote) {
            dataToDisplay = [...dataToDisplay].sort((a, b) => {
                const scoreA = parseFloat(a.score_merite) || 0;
                const scoreB = parseFloat(b.score_merite) || 0;
                return scoreB - scoreA;
            });
        }
        
        // Calculer le rang dans chaque liste
        let rangLP = 1;
        let rangLA = 1;
        
        dataToDisplay.forEach(item => {
            if (item.statut === 'Admis liste principale') {
                item.rang_numero = rangLP++;
            } else if (item.statut === 'Admis liste attente') {
                item.rang_numero = rangLA++;
            }
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

  
    const handleExportExcel = async (statut = null) => {
        if (!selectedConcoursId) return;
        
        let url;
        if (phase === 'candidature') {
            // Utilise la route existante pour les phases candidature et final
            url = `http://localhost:8000/api/concours/${selectedConcoursId}/resultats/export?phase=${phase}`;
            
            // Ajouter le statut comme paramètre supplémentaire
            if (statut) {
                url += `&statut=${encodeURIComponent(statut)}`;
            } 
         } else if (phase === 'final') {
            // Utilise la route existante pour les phases candidature et final
            url = `http://localhost:8000/api/concours/${selectedConcoursId}/final/export`;
            
            // Ajouter le statut comme paramètre supplémentaire
            //if (statut) {
            //    url += `&statut=${encodeURIComponent(statut)}`;
           // }
        
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
            let filename = 'Candidats_Candidature_Admis.xlsx';
            if (phase === 'ecrits') filename = 'Candidats_Admis_Epreuves_Ecrites.xlsx';
            else if (phase === 'oral') filename = 'Candidats_Admis_Epreuves_Orales.xlsx';
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

    // Obtenir les phases disponibles pour le concours sélectionné
    const availablePhases = selectedConcours ? getAvailablePhases(selectedConcours.type_epreuve) : [];

    

    // Fonction pour configurer le Score Mérite
const handleConfigureScoreMerite = async (config) => {
    if (!selectedConcoursId) return;
    
    try {
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/final/configure-score-merite`,
            config
        );
        
        setScoreMeriteConfig(config);
        
        // Recharger les données de la phase finale
        if (phase === 'final') {
            axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/final/admissions`)
                .then(response => {
                    setFinalAdmissionsData(response.data);
                });
        }
        
        alert(`Configuration appliquée avec succès ! ${response.data.candidats_updated} candidats mis à jour.`);
    } catch (error) {
        console.error("Erreur lors de la configuration du Score Mérite:", error);
        alert("Erreur lors de la configuration du Score Mérite.");
    }
};

 // NOUVELLE FONCTION pour gérer le tri par note selon la phase

const handleSortByNote = (enabled) => {
    setSortByNote(enabled);
    
    // Recharger les données triées selon la phase
    if (enabled) {
        if (phase === 'ecrits' && ecritsData.length > 0) {
            const sortedData = [...ecritsData].sort((a, b) => {
                // ✅ CORRECTION : Tri par Score Mérite
                const scoreA = parseFloat(a.score_merite) || 0;
                const scoreB = parseFloat(b.score_merite) || 0;
                return scoreB - scoreA; // Tri décroissant
            });
            setEcritsData(sortedData);
        } else if (phase === 'oral' && oralData.length > 0) {
            const sortedData = [...oralData].sort((a, b) => {
                // ✅ CORRECTION : Tri par Score Mérite
                const scoreA = parseFloat(a.score_merite) || 0;
                const scoreB = parseFloat(b.score_merite) || 0;
                return scoreB - scoreA; // Tri décroissant
            });
            setOralData(sortedData);
        } else if (phase === 'final' && finalAdmissionsData.length > 0) {
            const sortedData = [...finalAdmissionsData].sort((a, b) => {
                const scoreA = parseFloat(a.score_merite) || 0;
                const scoreB = parseFloat(b.score_merite) || 0;
                return scoreB - scoreA; // Tri décroissant
            });
            setFinalAdmissionsData(sortedData);
        }
    }
};


// Nouvelles fonctions pour configurer le Score Mérite
const handleConfigureScoreMeriteEcrits = async (config) => {
    if (!selectedConcoursId) return;
    
    try {
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/ecrits/configure-score-merite`,
            config
        );
        
        setScoreMeriteConfigEcrits(config);
        
        // Recharger les données
        const dataResponse = await axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/ecrits`);
        setEcritsData(dataResponse.data);
        
        // ✅ NOUVELLE ALERTE STYLISÉE
        setSuccessAlert({
            message: `${response.data.epreuves_updated} épreuves mises à jour`,
            details: 'Les scores de mérite ont été recalculés selon la nouvelle configuration'
        });
        
    } catch (error) {
        console.error("Erreur lors de la configuration du Score Mérite écrits:", error);
        alert("Erreur lors de la configuration du Score Mérite.");
    }
};

const handleConfigureScoreMeriteOral = async (config) => {
    if (!selectedConcoursId) return;
    
    try {
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/oraux/configure-score-merite`,
            config
        );
        
        setScoreMeriteConfigOral(config);
        
        // Recharger les données de la phase orale
        if (phase === 'oral') {
            axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/oraux`)
                .then(response => {
                    setOralData(response.data);
                });
        }
        
         
        // ✅ NOUVELLE ALERTE STYLISÉE
        setSuccessAlert({
            message: `${response.data.epreuves_updated} épreuves mises à jour`,
            details: 'Les scores de mérite ont été recalculés selon la nouvelle configuration'
        });
        
    } catch (error) {
        console.error("Erreur lors de la configuration du Score Mérite oral:", error);
        alert("Erreur lors de la configuration du Score Mérite.");
    }
};


// Fonction d'admission automatique standard
const handleAutomaticAdmission = async () => {
    if (!selectedConcoursId) return;
    if (!autoAdmitCount || autoAdmitCount <= 0) {
        alert("Veuillez entrer un nombre valide de candidats.");
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/automatic-admission`, 
            { 
                count: autoAdmitCount, 
                phase: phase,
                type: 'standard'
            }
        );
        
        // Recharger les données selon la phase
        await reloadCurrentPhaseData();
        
       // ✅ NOUVELLE ALERTE STYLISÉE
        setAdmissionAlert({
            message: response.data.message,
            admisCount: response.data.admis_count,
            nonAdmisCount: response.data.non_admis_count,
            changesCount: response.data.changes_count,
            statutAdmis: response.data.statut_admis
        });
        setAutoAdmitCount(0);
    } catch (error) {
        console.error("Erreur lors de l'admission automatique:", error);
        alert("Erreur lors de l'admission automatique.");
    }
};

// Fonction d'admission automatique Liste Principale
const handleAutomaticAdmissionLP = async () => {
    if (!selectedConcoursId) return;
    if (!autoAdmitCountLP || autoAdmitCountLP <= 0) {
        alert("Veuillez entrer un nombre valide de candidats pour la Liste Principale.");
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/automatic-admission`, 
            { 
                count: autoAdmitCountLP, 
                phase: phase,
                type: 'liste_principale'
            }
        );
        
        await reloadCurrentPhaseData();
        
       {/* ✅ ALERTE D'ADMISSION */}
{admissionAlert && (
    <AdmissionAlert
        message={admissionAlert.message}
        admisCount={admissionAlert.admisCount}
        nonAdmisCount={admissionAlert.nonAdmisCount}
        changesCount={admissionAlert.changesCount}
        statutAdmis={admissionAlert.statutAdmis}
        onClose={() => setAdmissionAlert(null)}
    />
)}
        setAutoAdmitCountLP(0);
    } catch (error) {
        console.error("Erreur lors de l'admission en Liste Principale:", error);
        alert("Erreur lors de l'admission en Liste Principale.");
    }
};

// Fonction d'admission automatique Liste d'Attente
const handleAutomaticAdmissionLA = async () => {
    if (!selectedConcoursId) return;
    if (!autoAdmitCountLA || autoAdmitCountLA <= 0) {
        alert("Veuillez entrer un nombre valide de candidats pour la Liste d'Attente.");
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:8000/api/concours/${selectedConcoursId}/automatic-admission`, 
            { 
                count: autoAdmitCountLA, 
                phase: phase,
                type: 'liste_attente'
            }
        );
        
        await reloadCurrentPhaseData();
        
       // ✅ NOUVELLE ALERTE STYLISÉE
        setAdmissionAlert({
            message: response.data.message,
            admisCount: response.data.admis_count,
            nonAdmisCount: response.data.non_admis_count,
            changesCount: response.data.changes_count,
            statutAdmis: response.data.statut_admis
        });
        setAutoAdmitCountLA(0);
    } catch (error) {
        console.error("Erreur lors de l'admission en Liste d'Attente:", error);
        alert("Erreur lors de l'admission en Liste d'Attente.");
    }
};

// Fonction pour recharger les données de la phase actuelle
const reloadCurrentPhaseData = async () => {
    if (phase === 'candidature') {
        const response = await axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/candidatures-filtered`);
        setCandidatureData(response.data);
    } else if (phase === 'ecrits') {
        const response = await axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/ecrits`);
        setEcritsData(response.data);
    } else if (phase === 'oral') {
        const response = await axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/oraux`);
        setOralData(response.data);
    } else if (phase === 'final') {
        const response = await axios.get(`http://localhost:8000/api/concours/${selectedConcoursId}/final/admissions`);
        setFinalAdmissionsData(response.data);
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
            
            {selectedConcoursId && selectedConcours ? (
                <Paper sx={{ p: 4, backgroundColor: "white", borderRadius: 2, boxShadow: 3, width: '100%' }}>
                    <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                        Gestion des Candidatures - {selectedConcours.title}
                    </Typography>

                    {/* Affichage du type d'épreuve */}
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Chip 
                            label={`Type d'épreuve: ${
                                selectedConcours.type_epreuve === 'ecrit' ? 'Écrite' :
                                selectedConcours.type_epreuve === 'oral' ? 'Orale' :
                                'Écrite et Orale'
                            }`}
                            color="primary"
                            sx={{ 
                                fontWeight: 600,
                                backgroundColor: primaryColor,
                                color: 'white'
                            }}
                        />
                    </Box>

                    <PhaseNavigation 
                        phase={phase} 
                        setPhase={setPhase} 
                        phases={availablePhases} 
                    />

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
        autoAdmitCountLP={autoAdmitCountLP}
        setAutoAdmitCountLP={setAutoAdmitCountLP}
        autoAdmitCountLA={autoAdmitCountLA}
        setAutoAdmitCountLA={setAutoAdmitCountLA}
        handleAutomaticAdmissionLP={handleAutomaticAdmissionLP}
        handleAutomaticAdmissionLA={handleAutomaticAdmissionLA}
        phase={phase}
        typeEpreuve={selectedConcours?.type_epreuve}
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
                            forceRefresh={forceRefresh}
                        />
                    )}

                   
                    {phase === 'final' ? (
                        <FinalAdmissionsTable
                            currentData={displayedData}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            getStatusColor={getStatusColor}
                            onConfigureScoreMerite={handleConfigureScoreMerite}
                            scoreMeriteConfig={scoreMeriteConfig}
                            sortByNote={sortByNote}
                            onSortByNote={setSortByNote}
                        />
                    ) : (
                        <CandidatTable
                            key={selectedFields.join('-')}
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
                            sortByNote={sortByNote}
                            onSortByNote={setSortByNote}
                            onConfigureScoreMerite={
            phase === 'ecrits' 
                ?  handleConfigureScoreMeriteEcrits 
                : phase === 'oral' 
                    ?  handleConfigureScoreMeriteOral 
                    : null
        }
        scoreMeriteConfig={
            phase === 'ecrits' 
                ? scoreMeriteConfigEcrits 
                : phase === 'oral' 
                    ? scoreMeriteConfigOral 
                    : null
        }
        typeEpreuve={selectedConcours?.type_epreuve} // ✅ Passer directement le type
    />
                        
                    )}
                    
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
                                onClick={() => handleExportExcel('Admis liste principale')}
                            >
                                Télécharger Liste Final
                            </Button>
                           {/*   <Button
                                variant="contained"
                                onClick={() => handleExportExcel('Admis liste attente')}
                            >
                                Télécharger Liste d'Attente
                            </Button>  */}
                        </Box>
                    )}
                     {/* ✅ ALERTE DE SUCCÈS */}
            {successAlert && (
                <SuccessAlert
                    message={successAlert.message}
                    details={successAlert.details}
                    onClose={() => setSuccessAlert(null)}
                />
            
            )}
               {/* ✅ ALERTE D'ADMISSION - PLACEZ-LA ICI */}
            {admissionAlert && (
                <AdmissionAlert
                    message={admissionAlert.message}
                    admisCount={admissionAlert.admisCount}
                    nonAdmisCount={admissionAlert.nonAdmisCount}
                    changesCount={admissionAlert.changesCount}
                    statutAdmis={admissionAlert.statutAdmis}
                    onClose={() => setAdmissionAlert(null)}
                />
            )}
            </Paper>
            ) : (
    // ✅ NOUVEAU : Afficher le dashboard quand aucun concours n'est sélectionné
    //<DashboardHome />
    <WelcomePage onSelectConcours={() => {
        // Fonction pour mettre en évidence le sélecteur de concours
        const selector = document.querySelector('.MuiSelect-root') || 
                        document.querySelector('select');
        if (selector) {
            selector.scrollIntoView({ behavior: 'smooth', block: 'center' });
            selector.focus();
        }
    }} />
            
            )}
        </Box>
    </ThemeProvider>
);

}
export default GestionCandidaturesPhases;
