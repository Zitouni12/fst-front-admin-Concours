import React from 'react';
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
    dynamicFields,
    selectedConcoursId,
    selectedFields,
}) => {
    // Fonction pour mettre à jour la note d'une épreuve écrite
    const updateEcritNote = async (id, newNote) => {
        try {
            await axios.patch(`http://localhost:8000/api/epreuves-ecrits/${id}`, { note: newNote });
            console.log("Note écrite mise à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la note écrite:", error);
        }
    };

    // Fonction pour mettre à jour la note d'une épreuve orale
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
        const baseColumns = [
            { id: 'name', label: 'Nom' },
            { id: 'email', label: 'Adresse E-mail Personnelle' },
        ];

        if (phase === 'candidature' || phase === 'ecrits' || phase === 'oral' || phase === 'final') {
            baseColumns.push(
                { id: 'anneeBac', label: 'Année d obtention du Bac' },
                { id: 'filiere', label: 'Type de diplome' }
            );
        }

        if (phase === 'candidature') {
            baseColumns.push(
                { id: 'average', label: 'Moyenne Calculée' },
                { id: 'statut', label: 'Statut' },
                { id: 'documents', label: 'Documents' }
            );
        } else if (phase === 'ecrits' || phase === 'oral') {
            baseColumns.push(
                { id: 'note', label: phase === 'ecrits' ? 'Note Écrit' : 'Note Oral' },
                { id: 'statut', label: 'Statut' }
            );
        } else if (phase === 'final') {
            // Colonnes spécifiques pour la phase finale
            baseColumns.splice(0, 2, 
                { id: 'rang', label: 'Liste' },
                { id: 'rang_numero', label: 'Rang' },
                { id: 'name', label: 'Nom' },
                { id: 'prenom', label: 'Prénom' },
                { id: 'email', label: 'Email' }
            );
            baseColumns.push(
                { id: 'note_ecrite', label: 'Note Écrite' },
                { id: 'note_orale', label: 'Note Orale' },
                { id: 'score_merite', label: 'Score Mérite' }
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
        <Paper
            elevation={3}
            sx={{
                borderRadius: 4,
                overflow: 'hidden',
                mb: 4
            }}
        >
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

                                if (phase === 'final') {
                                    // Pour la phase finale, utiliser les données déjà formatées
                                    nom = row.name;
                                    prenom = row.prenom;
                                    email = row.email;
                                    anneeBac = row.anneeBac;
                                    filiere = row.filiere;
                                } else {
                                    // Pour les autres phases, extraire depuis valeursFormulaire
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

                                return (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { backgroundColor: '#F5F5F5' },
                                            // Couleur de fond pour la phase finale
                                            backgroundColor: phase === 'final' 
                                                ? (row.statut === 'Admis liste principale' ? '#f0f7ff' : '#fffbf0')
                                                : 'inherit'
                                        }}
                                    >
                                        {phase === 'final' ? (
                                            // Affichage spécifique pour la phase finale
                                            <>
                                                <TableCell>
                                                    <Chip 
                                                        label={row.rang} 
                                                        color={row.statut === 'Admis liste principale' ? 'primary' : 'warning'}
                                                        sx={{ 
                                                            fontWeight: 'bold',
                                                            backgroundColor: row.statut === 'Admis liste principale' ? primaryColor : '#FFA726'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{row.rang_numero}</TableCell>
                                                <TableCell>{nom}</TableCell>
                                                <TableCell>{prenom}</TableCell>
                                                <TableCell>{email}</TableCell>
                                               
                                                <TableCell>{filiere}</TableCell>
                                                <TableCell>{row.note_ecrite || '-'}</TableCell>
                                                <TableCell>{row.note_orale || '-'}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{row.score_merite}</TableCell>
                                            </>
                                        ) : (
                                            // Affichage pour les autres phases
                                            <>
                                                {/* Nom */}
                                                <TableCell>{nom}</TableCell>
                                                {/* Email */}
                                                <TableCell>{email}</TableCell>
                                                {/* Année Bac */}
                                                <TableCell>{anneeBac}</TableCell>
                                                {/* Filière */}
                                                <TableCell>{filiere}</TableCell>
                                                
                                                {/* Moyenne ou Note */}
                                                {phase === 'candidature' && (
                                                    <TableCell>
                                                        {calculateSelectionAverage ? calculateSelectionAverage(row) : 'N/A'}
                                                    </TableCell>
                                                )}
                                                
                                                {(phase === 'ecrits' || phase === 'oral') && (
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
                                                                    updateEcritNote(row.id, newNote);
                                                                }
                                                                if (phase === 'oral' && setOralData) {
                                                                    setOralData(prev =>
                                                                        prev.map(item =>
                                                                            item.id === row.id
                                                                                ? { ...item, note: newNote }
                                                                                : item
                                                                        )
                                                                    );
                                                                    updateOralNote(row.id, newNote);
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
                                                            sx={{
                                                                width: '100px',
                                                                '& .MuiOutlinedInput-root': {
                                                                    '&.Mui-focused fieldset': {
                                                                        borderColor: primaryColor,
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                )}
                                                
                                                {/* Statut */}
                                                {phase !== 'final' && (
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
                                                )}
                                                
                                                {/* Documents */}
                                                {phase === 'candidature' && (
                                                    <TableCell>
                                                        <Button
                                                            onClick={() => handleOpenDialog(row.id)}
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            sx={{
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                borderRadius: 30,
                                                                padding: '8px 16px',
                                                                background: `linear-gradient(45deg, ${primaryColor} 30%, ${primaryColor}CC 90%)`,
                                                                '&:hover': {
                                                                    background: `linear-gradient(45deg, ${primaryColor}CC 30%, ${primaryColor} 90%)`,
                                                                    transform: 'translateY(-3px)',
                                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                                },
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <VisibilityIcon sx={{ fontSize: 20 }} /> Voir
                                                        </Button>
                                                    </TableCell>
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
    );
};

export default CandidatTable;
