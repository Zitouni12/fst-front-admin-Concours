import React, { useState } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Typography,
    Paper,
    Chip,
    Button
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import ScoreMeriteConfig from './ScoreMeriteConfig';
import Switch from '@mui/material/Switch';

const primaryColor = "#B36B39";
const secondaryColor = "#2C3E50";

const FinalAdmissionsTable = ({
    currentData,
    page,
    rowsPerPage,
    getStatusColor,
    onConfigureScoreMerite,
    scoreMeriteConfig,
    sortByNote,
    onSortByNote
}) => {
    const [configDialogOpen, setConfigDialogOpen] = useState(false);

    // Colonnes pour la phase finale
    const columns = [
        { id: 'rang', label: 'Liste' },
        { id: 'rang_numero', label: 'Rang' },
        { id: 'numero_apogee', label: 'Numéro Apogée' },
        { id: 'cin', label: 'CIN' },
        { id: 'cne', label: 'CNE' },
        { id: 'name', label: 'Nom' },
        { id: 'prenom', label: 'Prénom' },
        { id: 'note_dossier', label: 'Note de dossier' },
        { id: 'note_ecrite', label: 'Note Écrite' },
        { id: 'note_orale', label: 'Note Orale' },
        { id: 'score_merite', label: 'Score Mérite' }
    ];

    const handleConfigSave = (config) => {
        console.log("Configuration reçue:", config);
        onConfigureScoreMerite(config);
    };

    if (!currentData || currentData.length === 0) {
        return (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
                <Typography variant="h6" align="center" sx={{ py: 5 }}>
                    Aucune donnée disponible pour cette phase
                </Typography>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SettingsIcon />}
                        onClick={() => setConfigDialogOpen(true)}
                        sx={{
                            backgroundColor: primaryColor,
                            '&:hover': {
                                backgroundColor: `${primaryColor}CC`,
                            }
                        }}
                    >
                        Configurer le Score Mérite
                    </Button>
                </Box>
                
                <ScoreMeriteConfig
                    open={configDialogOpen}
                    onClose={() => setConfigDialogOpen(false)}
                    onSave={handleConfigSave}
                    initialConfig={scoreMeriteConfig || {
                        includeDossier: true,
                        includeEcrit: true,
                        includeOral: true,
                        coeffDossier: 0.5,
                        coeffEcrit: 1,
                        coeffOral: 0.25
                    }}
                />
            </Paper>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            {/* NOUVEAU : Bloc de configuration séparé comme dans la phase orale */}
            <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    {/* Bouton Configurer à gauche*/}
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

                    {/* Tri par Score Mérite à droite */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ mr: 1, color: secondaryColor, fontWeight: 500 }}>
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
                
                {/* Configuration actuelle en dessous */}
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
            </Paper>

            {/* Tableau principal */}
            <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
                {/* En-tête simplifié */}
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
                    <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 'bold' }}>
                        Résultats Finaux du Concours
                    </Typography>
                </Box>

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
                                .map((row) => (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { backgroundColor: '#F5F5F5' },
                                            backgroundColor: row.statut === 'Admis liste principale' ? '#f0f7ff' : '#fffbf0'
                                        }}
                                    >
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
                                        <TableCell>{row.numero_apogee || '-'}</TableCell>
                                        <TableCell>{row.cin || '-'}</TableCell>
                                        <TableCell>{row.cne || '-'}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.prenom}</TableCell>
                                        <TableCell>{row.note_dossier || '-'}</TableCell>
                                        <TableCell>{row.note_ecrite || '-'}</TableCell>
                                        <TableCell>{row.note_orale || '-'}</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: primaryColor }}>
                                            {row.score_merite || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Dialog de configuration */}
            <ScoreMeriteConfig
                open={configDialogOpen}
                onClose={() => setConfigDialogOpen(false)}
                onSave={handleConfigSave}
                initialConfig={scoreMeriteConfig || {
                    includeDossier: true,
                    includeEcrit: true,
                    includeOral: true,
                    coeffDossier: 0.5,
                    coeffEcrit: 1,
                    coeffOral: 0.25
                }}
            />
        </Box>
    );
};

export default FinalAdmissionsTable;
