import React, { useState } from 'react';
import { Typography, Box, Paper, Button, Alert, styled } from '@mui/material';
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

const ImportExcelNotesFormat = ({ phase, handleImportNotes }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log("Fichier sélectionné:", file);
        setSelectedFile(file);
        setError(null);
        setSuccess(false);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Veuillez sélectionner un fichier");
            return;
        }

        const extension = selectedFile.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(extension)) {
            setError("Format de fichier non supporté. Utilisez .xlsx ou .xls");
            return;
        }

        setLoading(true);
        try {
            console.log("Envoi du fichier:", selectedFile);
            
            const result = await handleImportNotes(selectedFile);
            console.log("Résultat de l'importation:", result);
            
            if (result.errors && result.errors.length > 0) {
                setError(`Importation terminée avec ${result.errors.length} erreurs. Vérifiez les données.`);
            } else {
                setSuccess(true);
                setError(null);
            }
        } catch (err) {
            console.error("Erreur complète:", err);
            setError("Erreur lors de l'importation: " + 
                (err.response?.data?.errors?.file?.[0] || 
                 err.response?.data?.error || 
                 err.message));
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const phaseLabel = phase === 'ecrits' ? "d'épreuves écrites" : "d'épreuves orales";

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
                Importer les notes {phaseLabel} (format spécifique)
            </Typography>
            
            <Typography 
                variant="body2" 
                sx={{ 
                    mb: 2, 
                    color: 'text.secondary',
                    fontStyle: 'italic'
                }}
            >
                Importez le fichier Excel au format (CNE, CIN, Nom, Prénom, Note Épreuve Écrite, Note Épreuve Orale) avec les notes remplies.
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    Les notes ont été importées avec succès!
                </Alert>
            )}
            
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    border: '2px dashed',
                    borderColor: error ? '#f44336' : selectedFile ? primaryColor : `${primaryColor}50`,
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
                    disabled={loading}
                    sx={{
                        borderRadius: 30,
                        textTransform: "none",
                        padding: "10px 20px",
                        transition: "all 0.3s ease",
                        fontWeight: 600,
                        boxShadow: "none",
                        background: loading 
                            ? `${primaryColor}80`
                            : `linear-gradient(45deg, ${primaryColor} 30%, ${primaryColor}CC 90%)`,
                        "&:hover": {
                            transform: loading ? "none" : "translateY(-3px)",
                            boxShadow: loading ? "none" : "0 4px 8px rgba(0,0,0,0.1)",
                            background: loading 
                                ? `${primaryColor}80`
                                : `linear-gradient(45deg, ${primaryColor}CC 30%, ${primaryColor} 90%)`,
                        },
                        "&:disabled": {
                            background: `${primaryColor}80`,
                            color: "rgba(255, 255, 255, 0.7)"
                        }
                    }}
                >
                    {loading ? "Importation..." : "Sélectionner un fichier"}
                    <VisuallyHiddenInput 
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </Button>
                
                <Typography 
                    variant="body2" 
                    sx={{ 
                        mt: 2, 
                        color: 'text.secondary',
                        fontStyle: selectedFile ? 'normal' : 'italic',
                        textAlign: 'center'
                    }}
                >
                    {selectedFile 
                        ? `Fichier sélectionné: ${selectedFile.name}` 
                        : 'Formats acceptés: .xlsx, .xls'
                    }
                </Typography>
                
                {selectedFile && !loading && !success && (
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        sx={{
                            mt: 2,
                            borderRadius: 30,
                            textTransform: "none",
                            padding: "8px 24px",
                            fontWeight: 600,
                            backgroundColor: primaryColor,
                            "&:hover": {
                                backgroundColor: `${primaryColor}CC`,
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }
                        }}
                    >
                        Importer les notes
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default ImportExcelNotesFormat;
