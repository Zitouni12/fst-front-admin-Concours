import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  IconButton, 
  Box 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Définition des couleurs principales selon la charte graphique UCA
const primaryColor = "#B36B39"; // Couleur bronze/cuivre du logo
const secondaryColor = "#2C3E50"; // Bleu foncé pour le contraste
const backgroundColor = "#F5F5F5"; // Gris clair pour le fond

const DocumentDialog = ({ openDialog, handleCloseDialog, selectedDocs }) => {
    return (
        <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog} 
            fullWidth 
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    backgroundColor: secondaryColor, 
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2
                }}
            >
                Documents
                <IconButton 
                    edge="end" 
                    color="inherit" 
                    onClick={handleCloseDialog} 
                    aria-label="close"
                    sx={{
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent 
                sx={{ 
                    p: 3,
                    backgroundColor: backgroundColor
                }}
            >
                {selectedDocs.length > 0 ? (
                    selectedDocs.map((doc, index) => (
                        <Box
                            key={index}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    backgroundColor: primaryColor,
                                    color: '#ffffff',
                                    p: 1,
                                    pl: 2,
                                    fontWeight: 600
                                }}
                            >
                                Document {index + 1}
                            </Typography>
                            <iframe
                                src={doc}
                                width="100%"
                                height="500px"
                                style={{ 
                                    border: "none", 
                                    display: 'block'
                                }}
                                title={`Document ${index + 1}`}
                            />
                        </Box>
                    ))
                ) : (
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            textAlign: 'center',
                            py: 4,
                            color: '#333',
                            fontStyle: 'italic'
                        }}
                    >
                        Aucun document disponible.
                    </Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DocumentDialog;