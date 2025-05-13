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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const primaryColor = "#B36B39"; // Couleur bronze/cuivre du logo
const secondaryColor = "#2C3E50"; // Bleu foncé pour le contraste
const accentColor = "#E74C3C"; // Rouge pour l'accent

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
}) => {
  const handleAverageChange = (id, newValue) => {
    // Mettre à jour la moyenne dans les données
    const updatedData = currentData.map(row => {
      if (row.id === id) {
        return {
          ...row,
          [phase === 'ecrits' ? 'writtenAverage' : 'oralAverage']: parseFloat(newValue) || null
        };
      }
      return row;
    });
    // Mettre à jour les données dans le composant parent
    if (phase === 'ecrits') {
      setEcritsData(updatedData);
    } else if (phase === 'oral') {
      setOralData(updatedData);
    }
  };

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
              <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>Filière</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>Année Bac</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {phase === 'ecrits'
                  ? 'Moyenne Écrit'
                  : phase === 'oral'
                  ? 'Moyenne Oral'
                  : 'Moyenne Calculée'}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>Statut</TableCell>
              {phase === 'candidature' && (
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff' }}>Documents</TableCell>
              )}
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
                  }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.filiere}</TableCell>
                  <TableCell>{row.bacYear}</TableCell>
                  <TableCell>
                    {phase === 'candidature' ? (
                      calculateSelectionAverage(row)
                    ) : phase === 'ecrits' || phase === 'oral' ? (
                      <TextField
                        type="number"
                        value={phase === 'ecrits' ? row.writtenAverage ?? '' : row.oralAverage ?? ''}
                        onChange={(e) => handleAverageChange(row.id, e.target.value)}
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
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Select
                      variant="standard"
                      value={row.status}
                      onChange={(e) => handleChangeStatus(row.id, e.target.value)}
                      sx={{
                        minWidth: 200,
                        color: getStatusColor(row.status),
                        fontWeight: 'bold',
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ color: getStatusColor(selected) }}>{selected || 'Sélectionner un statut'}</Box>
                      )}
                    >
                      <MenuItem value="">Sélectionner un statut</MenuItem>
                      <MenuItem value="Admis à l'épreuve écrite" sx={{ color: 'success.main' }}>
                        Admis à l'épreuve écrite
                      </MenuItem>
                      <MenuItem value="Candidature rejetée" sx={{ color: accentColor }}>
                        Candidature rejetée
                      </MenuItem>
                      <MenuItem value="Admis à l'épreuve orale" sx={{ color: 'success.main' }}>
                        Admis à l'épreuve orale
                      </MenuItem>
                      <MenuItem value="Non Admis" sx={{ color: accentColor }}>
                        Non Admis
                      </MenuItem>
                      <MenuItem value="Admis en liste principale" sx={{ color: 'success.main' }}>
                        Admis en liste principale
                      </MenuItem>
                      <MenuItem value="Admis en liste d attente" sx={{ color: 'warning.main' }}>
                        Admis en liste d'attente
                      </MenuItem>
                    </Select>
                  </TableCell>
                  {phase === 'candidature' && (
                    <TableCell>
                      {row.documents?.length > 0 ? (
                        <Button
                          onClick={() => handleOpenDialog(row.documents)}
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
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', fontStyle: 'italic', fontWeight: 'bold' }}
                        >
                          Aucun document
                        </Typography>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CandidatTable;