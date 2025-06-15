import React, { useEffect, useState } from 'react';
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
    Chip,
    DialogTitle
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { Switch } from '@mui/material';
import axios from 'axios';
import ScoreMeriteConfig from './ScoreMeriteConfig';

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
    sortByNote,
    onSortByNote,
    onConfigureScoreMerite,
    scoreMeriteConfig,
    typeEpreuve // ✅ NOUVELLE PROP
}) => {

    useEffect(() => {
        if (phase === 'candidature' && currentData && currentData.length > 0) {
            currentData.forEach((row) => {
                const calculatedNote = calculateSelectionAverage ? calculateSelectionAverage(row) : '';
                
                if (calculatedNote && calculatedNote !== '' && !row.note_dossier) {
                    setTimeout(() => {
                        saveCalculatedNote(row.id, calculatedNote);
                    }, 1000);
                }
            });
        }
    }, [currentData, phase, selectedFields]);

      const [configDialogOpen, setConfigDialogOpen] = useState(false);

    // NOUVELLE FONCTION : Enregistrer automatiquement la note calculée
    const saveCalculatedNote = async (inscriptionId, calculatedNote) => {
        if (calculatedNote && calculatedNote !== '' && !isNaN(parseFloat(calculatedNote))) {
            try {
                await axios.patch(`http://localhost:8000/api/candidatures/${inscriptionId}/note-dossier`, { 
                    note_dossier: parseFloat(calculatedNote)
                });
                console.log("Note calculée enregistrée automatiquement:", calculatedNote);
                
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

    const handleConfigSave = (config) => {
        console.log("Configuration reçue:", config);
        if (onConfigureScoreMerite) {
        onConfigureScoreMerite(config); // ✅ Appel direct de la fonction
    }
    setConfigDialogOpen(false);
    };

    // NOUVELLES COLONNES selon la phase
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
        } else if (phase === 'ecrits') {
            // NOUVELLES COLONNES pour la phase écrite
            baseColumns.push(
                { id: 'cin', label: 'CIN' },
                { id: 'cne', label: 'CNE' },
                { id: 'nom', label: 'Nom' },
                { id: 'prenom', label: 'Prénom' },
                { id: 'note', label: 'Note Écrite' },
                { id: 'score_merite', label: 'Score Mérite' },
                { id: 'statut', label: 'Statut' }
            );
        } else if (phase === 'oral') {
            // NOUVELLES COLONNES pour la phase orale
            baseColumns.push(
                { id: 'cin', label: 'CIN' },
                { id: 'cne', label: 'CNE' },
                { id: 'nom', label: 'Nom' },
                { id: 'prenom', label: 'Prénom' },
                { id: 'note_ecrite', label: 'Note Écrite' },
                { id: 'note', label: 'Note Orale' },
                { id: 'score_merite', label: 'Score Mérite' },
                { id: 'statut', label: 'Statut' }
            );
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
            {/* NOUVEAU : Bloc de configuration Score Mérite pour les phases écrits/oral */}
            {(phase === 'ecrits' || phase === 'oral') && (
                <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Bouton Configurer Score Mérite à gauche */}
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<SettingsIcon />}
                            onClick={() => setConfigDialogOpen(true)}
                            sx={{ 
                                borderColor: primaryColor, 
                                color: primaryColor,
                                '&:hover': {
                                    borderColor: `${primaryColor}CC`,
                                    backgroundColor: `${primaryColor}10`,
                                }
                            }}
                        >
                            Configurer Score Mérite
                        </Button>

                      {/* Tri par Note à droite */}
<Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography variant="subtitle1" sx={{ mr: 1, color: secondaryColor, fontWeight: 500 }}>
        {/* ✅ CORRECTION : Toujours afficher "Trier par Score Mérite" */}
        Trier par Score Mérite
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

                    </Box>
                    
                    {/* Configuration actuelle */}
                    {scoreMeriteConfig && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                Configuration actuelle : 
                                {scoreMeriteConfig.includeDossier && ` Dossier (${scoreMeriteConfig.coeffDossier})`}
                                {scoreMeriteConfig.includeEcrit && ` + Écrit (${scoreMeriteConfig.coeffEcrit})`}
                                {scoreMeriteConfig.includeOral && ` + Oral (${scoreMeriteConfig.coeffOral})`}
                            </Typography>
                        </Box>
                    )}

                 
{/* Dialog de configuration */}
<ScoreMeriteConfig
    open={configDialogOpen}
    onClose={() => setConfigDialogOpen(false)}
    onSave={handleConfigSave}
    initialConfig={scoreMeriteConfig || {
        includeDossier: true,
        // ✅ CORRECTION : Note écrite disponible en phase écrits
        includeEcrit: (phase === 'ecrits') || 
                     (phase === 'oral' && typeEpreuve !== 'oral'),
        // ✅ CORRECTION : Note orale disponible seulement en phase orale
        includeOral: (phase === 'oral'),
        coeffDossier: 0.5,
        // ✅ CORRECTION : Coefficient écrit selon la disponibilité
        coeffEcrit: ((phase === 'ecrits') || 
                    (phase === 'oral' && typeEpreuve !== 'oral')) ? 1 : 0,
        // ✅ CORRECTION : Coefficient oral selon la disponibilité
        coeffOral: (phase === 'oral') ? 0.25 : 0
    }}
    phase={phase}
    typeEpreuve={typeEpreuve}
/>


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
                                    let nom, email, anneeBac, filiere, prenom, cin, cne;

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
                                        // Pour les phases écrits et oral - nouvelles colonnes
                                        cin = row.valeursFormulaire 
                                            ? row.valeursFormulaire.find(v => v.champ.nom === "CIN")?.valeur || 'N/A'
                                            : 'N/A';
                                        cne = row.valeursFormulaire 
                                            ? row.valeursFormulaire.find(v => v.champ.nom === "CNE")?.valeur || 'N/A'
                                            : 'N/A';
                                        nom = row.nom || (row.valeursFormulaire 
                                            ? row.valeursFormulaire.find(v => v.champ.nom === "Nom")?.valeur 
                                            : 'N/A') || 'N/A';
                                        
                                        prenom = row.prenom || (row.valeursFormulaire 
                                            ? row.valeursFormulaire.find(v => v.champ.nom === "Prénom")?.valeur 
                                            : 'N/A') || 'N/A';
                                    }

                                    const calculatedNote = calculateSelectionAverage ? calculateSelectionAverage(row) : '';

                                    return (
                                        <TableRow
                                            key={row.id}
                                            hover
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '&:hover': { backgroundColor: '#F5F5F5' },
                                            }}
                                        >
                                            {phase === 'candidature' ? (
                                                <>
                                                    <TableCell>{nom}</TableCell>
                                                    <TableCell>{prenom}</TableCell>
                                                    <TableCell>{anneeBac}</TableCell>
                                                    <TableCell>{filiere}</TableCell>
                                                    <TableCell>
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
                                                        >
                                                            <MenuItem value="">Sélectionner un statut</MenuItem>
                                                            <MenuItem value="En attente">En attente</MenuItem>
                                                            <MenuItem value="Admis epreuve ecrite">Admis à l'épreuve écrite</MenuItem>
                                                            <MenuItem value="Candidature rejetee">Candidature rejetée</MenuItem>
                                                            <MenuItem value="Admis epreuve orale">Admis à l'épreuve orale</MenuItem>
                                                            <MenuItem value="Non Admis">Non Admis</MenuItem>
                                                            <MenuItem value="Admis liste principale">Admis en liste principale</MenuItem>
                                                            <MenuItem value="Admis liste attente">Admis en liste d'attente</MenuItem>
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
                                            ) : phase === 'ecrits' ? (
                                                // NOUVELLES COLONNES pour la phase écrite
                                                <>
                                                    <TableCell>{cin}</TableCell>
                                                    <TableCell>{cne}</TableCell>
                                                    <TableCell>{nom}</TableCell>
                                                    <TableCell>{prenom}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={row.note || ''}
                                                            onChange={(e) => {
                                                                const newNote = e.target.value;
                                                                if (setEcritsData) {
                                                                    setEcritsData(prev =>
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
                                                                updateEcritNote(row.id, newNote);
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
                                                    <TableCell sx={{ fontWeight: 'bold', color: primaryColor }}>
                                                        {row.score_merite || '-'}
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
                                                        >
                                                            <MenuItem value="">Sélectionner un statut</MenuItem>
                                                            <MenuItem value="En attente">En attente</MenuItem>
                                                            <MenuItem value="Admis epreuve orale">Admis à l'épreuve orale</MenuItem>
                                                            <MenuItem value="Non Admis">Non Admis</MenuItem>
                                                            <MenuItem value="Admis liste principale">Admis en liste principale</MenuItem>
                                                            <MenuItem value="Admis liste attente">Admis en liste d'attente</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                // NOUVELLES COLONNES pour la phase orale
                                                <>
                                                    <TableCell>{cin}</TableCell>
                                                    <TableCell>{cne}</TableCell>
                                                    <TableCell>{nom}</TableCell>
                                                    <TableCell>{prenom}</TableCell>
                                                    <TableCell>{row.note_ecrite || '-'}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={row.note || ''}
                                                            onChange={(e) => {
                                                                const newNote = e.target.value;
                                                                if (setOralData) {
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
                                                                updateOralNote(row.id, newNote);
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
                                                    <TableCell sx={{ fontWeight: 'bold', color: primaryColor }}>
                                                        {row.score_merite || '-'}
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
                                                        >
                                                            <MenuItem value="">Sélectionner un statut</MenuItem>
                                                            <MenuItem value="En attente">En attente</MenuItem>
                                                            <MenuItem value="Admis liste principale">Admis en liste principale</MenuItem>
                                                            <MenuItem value="Admis liste attente">Admis en liste d'attente</MenuItem>
                                                            <MenuItem value="Non Admis">Non Admis</MenuItem>
                                                        </Select>
                                                    </TableCell>
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
