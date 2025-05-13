import React from 'react';
import { Typography, Box, Paper, Button, styled } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileUploadIcon from '@mui/icons-material/FileUpload';

// Définition des couleurs principales selon la charte graphique UCA
const primaryColor = "#B36B39"; // Couleur bronze/cuivre du logo
const secondaryColor = "#2C3E50"; // Bleu foncé pour le contraste
const backgroundColor = "#F5F5F5"; // Gris clair pour le fond

// Style personnalisé pour l'input file
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImportExcelData = ({ phase, handleImportData }) => {
    const phaseLabel = phase === 'ecrits' ? "l'épreuve écrite" : phase === 'oral' ? "l'épreuve orale" : "";
    const phaseType = phase === 'ecrits' ? 'ecrits' : phase === 'oral' ? 'oral' : null;
    const [fileName, setFileName] = React.useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0] && phaseType) {
            setFileName(e.target.files[0].name);
            handleImportData(e.target.files[0], phaseType);
        }
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 4,
                backgroundColor: 'white',
                border: `1px solid ${backgroundColor}`
            }}
        >
            <Typography 
                variant="h6" 
                sx={{ 
                    color: secondaryColor,
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <UploadFileIcon sx={{ color: primaryColor }} />
                Importer les données de {phaseLabel} depuis Excel
            </Typography>
            
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    border: '2px dashed',
                    borderColor: `${primaryColor}50`,
                    borderRadius: 2,
                    backgroundColor: `${backgroundColor}80`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: primaryColor,
                        backgroundColor: backgroundColor,
                    }
                }}
            >
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<FileUploadIcon />}
                    sx={{
                        borderRadius: 30,
                        textTransform: "none",
                        padding: "10px 20px",
                        transition: "all 0.3s ease",
                        fontWeight: 600,
                        boxShadow: "none",
                        background: `linear-gradient(45deg, ${primaryColor} 30%, ${primaryColor}CC 90%)`,
                        "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            background: `linear-gradient(45deg, ${primaryColor}CC 30%, ${primaryColor} 90%)`,
                        },
                    }}
                >
                    Sélectionner un fichier
                    <VisuallyHiddenInput 
                        type="file"
                        accept=".xlsx, .csv"
                        onChange={handleFileChange}
                    />
                </Button>
                
                <Typography 
                    variant="body2" 
                    sx={{ 
                        mt: 2, 
                        color: 'text.secondary',
                        fontStyle: fileName ? 'normal' : 'italic'
                    }}
                >
                    {fileName ? `Fichier sélectionné: ${fileName}` : 'Formats acceptés: .xlsx, .csv'}
                </Typography>
            </Box>
            
            {fileName && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: primaryColor,
                            fontWeight: 500
                        }}
                    >
                        Les données ont été importées avec succès!
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default ImportExcelData;