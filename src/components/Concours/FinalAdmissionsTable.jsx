import React from 'react';
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
    Chip
} from '@mui/material';

const primaryColor = "#B36B39";
const secondaryColor = "#2C3E50";

const FinalAdmissionsTable = ({
    currentData,
    page,
    rowsPerPage,
    getStatusColor
}) => {
    // Colonnes pour la phase finale
    const columns = [
        { id: 'rang', label: 'Liste' },
        { id: 'rang_numero', label: 'Rang' },
        { id: 'name', label: 'Nom' },
        { id: 'prenom', label: 'Prénom' },
        { id: 'email', label: 'Email' },
        { id: 'note_ecrite', label: 'Note Écrite' },
        { id: 'note_orale', label: 'Note Orale' },
        { id: 'score_merite', label: 'Score Mérite' },
        { id: 'filiere', label: 'Type de diplôme' },
        { id: 'anneeBac', label: 'Année Bac' }
    ];

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
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.prenom}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.note_ecrite || '-'}</TableCell>
                                    <TableCell>{row.note_orale || '-'}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{row.score_merite}</TableCell>
                                    <TableCell>{row.filiere}</TableCell>
                                    <TableCell>{row.anneeBac}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default FinalAdmissionsTable;
