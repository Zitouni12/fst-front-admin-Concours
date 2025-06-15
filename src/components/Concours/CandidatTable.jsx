import React, { useEffect } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    MenuItem,
    Box,
    Button,
    Typography,
    Paper,
    TextField,
    Chip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { Switch } from '@mui/material'; // AJOUTER cet import si pas déjà présent

const primaryColor = "#B36B39";
const secondaryColor = "#2C3E50";
const accentColor = "#E74C3C";

const CandidatTable = ({
    currentData,
    page,
    rowsPerPage,
    handleChangeStatus,
    getStatusColor,
    phase,
    calculateSelectionAverage,
    handleOpenDialog,
    setEcritsData,
    setOralData,
    setCandidatureData,
    dynamicFields,
    selectedConcoursId,
    selectedFields,
    sortByNote, // NOUVELLE PROP
    onSortByNote // NOUVELLE PROP

}) => {
    // CORRECTION : Déplacer useEffect au niveau du composant principal
    useEffect(() => {
        if (phase === 'candidature' && currentData && currentData.length > 0) {
            currentData.forEach((row) => {
                const calculatedNote = calculateSelectionAverage ? calculateSelectionAverage(row) : '';
                
                if (calculatedNote && calculatedNote !== '' && !row.note_dossier) {
                    // Délai pour éviter trop d'appels API
                    setTimeout(() => {
                        saveCalculatedNote(row.id, calculatedNote);
                    }, 1000);
                }
            });
        }
    }, [currentData, phase, selectedFields]);

    // NOUVELLE FONCTION : Enregistrer automatiquement la note calculée
    const saveCalculatedNote = async (inscriptionId, calculatedNote) => {
        if (calculatedNote && calculatedNote !== '' && !isNaN(parseFloat(calculatedNote))) {
            try {
                await axios.patch(`http://localhost:8000/api/candidatures/${inscriptionId}/note-dossier`, { 
                    note_dossier: parseFloat(calculatedNote)
                });
                console.log("Note calculée enregistrée automatiquement:", calculatedNote);
                
                // Mettre à jour l'état local
                if (setCandidatureData) {
                    setCandidatureData(prev =>
                        prev.map(item =>
                            item.id === inscriptionId
                                ? { ...item, note_dossier: parseFloat(calculatedNote) }
                                : item
                        )
                    );
                }
            } catch (error) {
                console.error("Erreur lors de l'enregistrement automatique:", error);
            }
        }
    };

    // Fonctions existantes pour épreuves écrites et orales
    const updateEcritNote = async (id, newNote) => {
        try {
            await axios.patch(`http://localhost:8000/api/epreuves-ecrits/${id}`, { note: newNote });
            console.log("Note écrite mise à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la note écrite:", error);
        }
    };

    const updateOralNote = async (id, newNote) => {
        try {
            await axios.patch(`http://localhost:8000/api/epreuves-orales/${id}`, { note: newNote });
            console.log("Note orale mise à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la note orale:", error);
        }
    };

    // Colonnes dynamiques selon la phase
    const getColumns = () => {
        const baseColumns = [];

        if (phase === 'candidature') {
            baseColumns.push(
                { id: 'nom', label: 'Nom' },
                { id: 'prenom', label: 'Prénom' },
                { id: 'anneeBac', label: 'Année d obtention du Bac' },
                { id: 'type_diplome', label: 'Type de diplome' },
                { id: 'note_dossier', label: 'Note de dossier' },
                { id: 'statut', label: 'Statut' },
                { id: 'documents', label: 'Documents' }
            );
        } else {
            baseColumns.push(
                { id: 'name', label: 'Nom' },
                { id: 'email', label: 'Adresse E-mail Personnelle' }
            );

            if (phase === 'ecrits' || phase === 'oral') {
                baseColumns.push(
                    { id: 'anneeBac', label: 'Année d obtention du Bac' },
                    { id: 'filiere', label: 'Type de diplome' }
                );
            }

            if (phase === 'ecrits' || phase === 'oral') {
                baseColumns.push(
                    { id: 'note', label: phase === 'ecrits' ? 'Note Écrit' : 'Note Oral' },
                    { id: 'statut', label: 'Statut' }
                );
            } 
            
        }
        return baseColumns;
    };

    const columns = getColumns();

    if (!currentData || currentData.length === 0) {
        return (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
                <Typography variant="h6" align="center" sx={{ py: 5 }}>
                    Aucune donnée disponible pour cette phase
                </Typography>
            </Paper>
        );
    }

    return (
         <>
          {/* NOUVEAU : Composant de tri pour les phases écrits/oral */}
            {(phase === 'ecrits' || phase === 'oral') && (
                <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <Typography variant="subtitle1" sx={{ mr: 1, color: secondaryColor, fontWeight: 500 }}>
                            {phase === 'ecrits' ? 'Trier par Note Écrite' : 'Trier par Note Orale'}
                        </Typography>
                        <Switch
                            checked={sortByNote || false}
                            onChange={(e) => onSortByNote && onSortByNote(e.target.checked)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: primaryColor,
                                    '&:hover': { backgroundColor: `${primaryColor}1A` },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: primaryColor,
                                },
                            }}
                        />
                    </Box>
                </Paper>
            )}
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: secondaryColor }}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                // Extraction des valeurs selon la phase
                                let nom, email, anneeBac, filiere, prenom;

                                if (phase === 'candidature') {
                                    nom = row.nom || (row.valeursFormulaire 
                                        ? row.valeursFormulaire.find(v => v.champ.nom === "Nom")?.valeur 
                                        : 'N/A') || 'N/A';
                                    
                                    prenom = row.prenom || (row.valeursFormulaire 
                                        ? row.valeursFormulaire.find(v => v.champ.nom === "Prénom")?.valeur 
                                        : 'N/A') || 'N/A';
                                    
                                    filiere = row.type_diplome || (row.valeursFormulaire 
                                        ? row.valeursFormulaire.find(v => v.champ.nom === "Type de diplome")?.valeur 
                                        : 'N/A') || 'N/A';
                                    
                                    anneeBac = row.valeursFormulaire 
                                        ? row.valeursFormulaire.find(v => v.champ.nom === "Année d obtention du Bac")?.valeur || 'N/A'
                                        : 'N/A';
                                
                                } else {
                                    nom = row.valeursFormulaire
                                        ? row.valeursFormulaire.find(v => v.champ.nom === "Nom")?.valeur || 'N/A'
                                        : 'N/A';
                                    email = row.valeursFormulaire
                                        ? row.valeursFormulaire.find(v => v.champ.nom === "Email" || v.champ.nom === "Adresse E-mail Personnelle")?.valeur || 'N/A'
                                        : 'N/A';
                                    anneeBac = row.valeursFormulaire
                                        ? row.valeursFormulaire.find(v => v.champ.nom === "Année d obtention du Bac")?.valeur || 'N/A'
                                        : 'N/A';
                                    filiere = row.valeursFormulaire
                                        ? row.valeursFormulaire.find(v => v.champ.nom === "Type de diplome")?.valeur || 'N/A'
                                        : 'N/A';
                                    prenom = row.valeursFormulaire
                                        ? row.valeursFormulaire.find(v => v.champ.nom === "Prénom")?.valeur || ''
                                        : '';
                                }

                                // CALCULER LA NOTE (sans useEffect ici)
                                const calculatedNote = calculateSelectionAverage ? calculateSelectionAverage(row) : '';

                                return (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { backgroundColor: '#F5F5F5' },
                                            backgroundColor: phase === 'final' 
                                                ? (row.statut === 'Admis liste principale' ? '#f0f7ff' : '#fffbf0')
                                                : 'inherit'
                                        }}
                                    >
                                        {phase === 'candidature' ? (
                                            <>
                                                <TableCell>{nom}</TableCell>
                                                <TableCell>{prenom}</TableCell>
                                                <TableCell>{anneeBac}</TableCell>
                                                <TableCell>{filiere}</TableCell>
                                                <TableCell>
                                                    {/* NOTE DE DOSSIER EN LECTURE SEULE */}
                                                    <Box
                                                        sx={{
                                                            backgroundColor: '#f5f5f5',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            padding: '8px 12px',
                                                            minWidth: '80px',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            color: '#666',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {row.note_dossier || calculatedNote || 'N/A'}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        variant="standard"
                                                        value={row.statut || ''}
                                                        onChange={(e) => {
                                                            const newStatut = e.target.value;
                                                            handleChangeStatus(row.id, newStatut);
                                                            if (setCandidatureData) {
                                                                setCandidatureData(prev =>
                                                                    prev.map(item =>
                                                                        item.id === row.id
                                                                            ? { ...item, statut: newStatut }
                                                                            : item
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                        sx={{
                                                            minWidth: 200,
                                                            color: getStatusColor(row.statut),
                                                            fontWeight: 'bold',
                                                        }}
                                                        renderValue={(selected) => (
                                                            <Box sx={{ color: getStatusColor(selected) }}>
                                                                {selected || 'Sélectionner un statut'}
                                                            </Box>
                                                        )}
                                                    >
                                                          <MenuItem value="">Sélectionner un statut</MenuItem>
                                                        <MenuItem value="En attente">En attente</MenuItem>
                                                        <MenuItem value="Admis epreuve ecrite" sx={{ color: 'success.main' }}>
                                                            Admis à l'épreuve écrite
                                                        </MenuItem>
                                                        <MenuItem value="Candidature rejetee" sx={{ color: accentColor }}>
                                                            Candidature rejetée
                                                        </MenuItem>
                                                        <MenuItem value="Admis epreuve orale" sx={{ color: 'success.main' }}>
                                                            Admis à l'épreuve orale
                                                        </MenuItem>
                                                        <MenuItem value="Non Admis" sx={{ color: accentColor }}>
                                                            Non Admis
                                                        </MenuItem>
                                                        <MenuItem value="Admis liste principale" sx={{ color: 'success.main' }}>
                                                            Admis en liste principale
                                                        </MenuItem>
                                                        <MenuItem value="Admis liste attente" sx={{ color: 'warning.main' }}>
                                                            Admis en liste d'attente
                                                        </MenuItem>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => handleOpenDialog(row.inscription_id || row.id)}
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        sx={{
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            borderRadius: 30,
                                                            padding: '8px 16px',
                                                        }}
                                                    >
                                                        <VisibilityIcon sx={{ fontSize: 20, mr: 1 }} /> Voir
                                                    </Button>
                                                </TableCell>
                                            </>
                                        ) : (
                                            // Affichage pour les autres phases (écrits, oral)
                                            <>
                                                <TableCell>{nom}</TableCell>
                                                <TableCell>{email}</TableCell>
                                                {(phase === 'ecrits' || phase === 'oral') && (
                                                    <>
                                                        <TableCell>{anneeBac}</TableCell>
                                                        <TableCell>{filiere}</TableCell>
                                                    </>
                                                )}
                                                {(phase === 'ecrits' || phase === 'oral') && (
                                                    <>
                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                value={row.note || ''}
                                                                onChange={(e) => {
                                                                    const newNote = e.target.value;
                                                                    if (phase === 'ecrits' && setEcritsData) {
                                                                        setEcritsData(prev =>
                                                                            prev.map(item =>
                                                                                item.id === row.id
                                                                                    ? { ...item, note: newNote }
                                                                                    : item
                                                                            )
                                                                        );
                                                                    }
                                                                    if (phase === 'oral' && setOralData) {
                                                                        setOralData(prev =>
                                                                            prev.map(item =>
                                                                                item.id === row.id
                                                                                    ? { ...item, note: newNote }
                                                                                    : item
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                                onBlur={(e) => {
                                                                    const newNote = e.target.value;
                                                                    if (phase === 'ecrits') {
                                                                        updateEcritNote(row.id, newNote);
                                                                    } else if (phase === 'oral') {
                                                                        updateOralNote(row.id, newNote);
                                                                    }
                                                                }}
                                                                size="small"
                                                                inputProps={{
                                                                    step: "0.01",
                                                                    min: "0",
                                                                    max: "20"
                                                                }}
                                                                sx={{ width: '100px' }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                            variant="standard"
                                                            value={row.statut || ''}
                                                            onChange={(e) => handleChangeStatus(row.id, e.target.value)}
                                                            sx={{
                                                                minWidth: 200,
                                                                color: getStatusColor(row.statut),
                                                                fontWeight: 'bold',
                                                            }}
                                                            renderValue={(selected) => (
                                                                <Box sx={{ color: getStatusColor(selected) }}>{selected || 'Sélectionner un statut'}</Box>
                                                            )}
                                                        >
                                                               <MenuItem value="">Sélectionner un statut</MenuItem>
                                                            <MenuItem value="En attente">En attente</MenuItem>
                                                            <MenuItem value="Admis epreuve ecrite" sx={{ color: 'success.main' }}>
                                                                Admis à l'épreuve écrite
                                                            </MenuItem>
                                                            <MenuItem value="Candidature rejetee" sx={{ color: accentColor }}>
                                                                Candidature rejetée
                                                            </MenuItem>
                                                            <MenuItem value="Admis epreuve orale" sx={{ color: 'success.main' }}>
                                                                Admis à l'épreuve orale
                                                            </MenuItem>
                                                            <MenuItem value="Non Admis" sx={{ color: accentColor }}>
                                                                Non Admis
                                                            </MenuItem>
                                                            <MenuItem value="Admis liste principale" sx={{ color: 'success.main' }}>
                                                                Admis en liste principale
                                                            </MenuItem>
                                                            <MenuItem value="Admis liste attente" sx={{ color: 'warning.main' }}>
                                                                Admis en liste d'attente
                                                            </MenuItem>
                                                            </Select>
                                                        </TableCell>
                                                    </>
                                                )}
                                              
                                            </>
                                        )}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
         </>
    );
};

export default CandidatTable;
