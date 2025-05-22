import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  IconButton, 
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ListItemButton from '@mui/material/ListItemButton';
import { Button } from '@mui/material';

// Définition des couleurs principales selon la charte graphique UCA
const primaryColor = "#B36B39"; // Couleur bronze/cuivre du logo
const secondaryColor = "#2C3E50"; // Bleu foncé pour le contraste
const backgroundColor = "#F5F5F5"; // Gris clair pour le fond

const DocumentDialog = ({ openDialog, handleCloseDialog, selectedDocs }) => {
    const [selectedDocIndex, setSelectedDocIndex] = useState(0);

    const getFileIcon = (filename) => {
        if (!filename) return <InsertDriveFileIcon />;
        
        const extension = filename.split('.').pop().toLowerCase();
        
        if (['pdf'].includes(extension)) {
            return <PictureAsPdfIcon color="error" />;
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
            return <ImageIcon color="primary" />;
        } else {
            return <InsertDriveFileIcon />;
        }
    };

    const getFileType = (filename) => {
        if (!filename) return 'unknown';
        
        const extension = filename.split('.').pop().toLowerCase();
        
        if (['pdf'].includes(extension)) {
            return 'pdf';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
            return 'image';
        } else {
            return 'other';
        }
    };

    const renderDocument = (document) => {
        const baseUrl = 'http://localhost:8000/storage/';
        const documentValue = typeof document === 'object' && document.valeur ? document.valeur : document;
        const documentUrl = `${baseUrl}${documentValue}`;
        const fileType = getFileType(documentValue);
        const documentTitle = typeof document === 'object' && document.champ ? document.champ.nom : 'Document';
        
        switch (fileType) {
            case 'pdf':
                return (
                    <iframe 
                        src={`${documentUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                        width="100%" 
                        height="100%" 
                        style={{ 
                            border: 'none', 
                            borderRadius: '4px',
                            overflow: 'hidden',
                            display: 'block',
                            backgroundColor: 'white'
                        }}
                        title={documentTitle}
                    />
                );
            case 'image':
                return (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        overflow: 'auto'
                    }}>
                        <img 
                            src={documentUrl} 
                            alt={documentTitle} 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: '4px'
                            }} 
                        />
                    </Box>
                );
            default:
                return (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        p: 3
                    }}>
                        <InsertDriveFileIcon sx={{ fontSize: 60, color: primaryColor, mb: 2 }} />
                        <Typography variant="h6">
                            Ce type de fichier ne peut pas être prévisualisé
                        </Typography>
                        <Button 
                            variant="contained" 
                            sx={{ mt: 2 }}
                            onClick={() => {
                                window.open(documentUrl, '_blank');
                            }}
                        >
                            Télécharger le fichier
                        </Button>
                    </Box>
                );
        }
    };

    // Vérifier si les documents sont au format attendu
    const isValidDocFormat = selectedDocs && selectedDocs.length > 0 && 
                            typeof selectedDocs[0] === 'object' && 
                            selectedDocs[0].champ && 
                            selectedDocs[0].valeur;

    return (
        <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog} 
            fullWidth 
            maxWidth="lg"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    height: '90vh', // Utiliser une hauteur fixe pour le dialogue
                    maxHeight: '90vh'
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
                Documents du Candidat
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
                    backgroundColor: backgroundColor,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    height: 'calc(90vh - 64px)', // Calculer la hauteur en soustrayant la hauteur du titre
                    overflow: 'hidden'
                }}
            >
                {selectedDocs && selectedDocs.length > 0 ? (
                    <>
                        <Box sx={{ 
                            width: { xs: '100%', md: '30%' },
                            mb: { xs: 2, md: 0 },
                            height: { xs: 'auto', md: '100%' },
                            overflow: 'auto'
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 2,
                                    color: secondaryColor,
                                    fontWeight: 600
                                }}
                            >
                                Liste des documents
                            </Typography>
                            <List sx={{ 
                                bgcolor: 'white', 
                                borderRadius: 2, 
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                {selectedDocs.map((doc, index) => (
                                    <ListItem
                                        key={index}
                                        disablePadding
                                        sx={{
                                            borderBottom: index < selectedDocs.length - 1 ? '1px solid #eee' : 'none'
                                        }}
                                    >
                                        <ListItemButton
                                            onClick={() => setSelectedDocIndex(index)}
                                            selected={selectedDocIndex === index}
                                            sx={{
                                                '&.Mui-selected': {
                                                    backgroundColor: `${primaryColor}20`,
                                                    borderLeft: `4px solid ${primaryColor}`,
                                                },
                                                '&:hover': {
                                                    backgroundColor: `${primaryColor}10`,
                                                },
                                            }}
                                        >
                                            <ListItemIcon>
                                                {getFileIcon(isValidDocFormat ? doc.valeur : doc)}
                                            </ListItemIcon>
                                            <Tooltip title={isValidDocFormat ? doc.champ.nom : `Document ${index + 1}`}>
                                                <ListItemText 
                                                    primary={isValidDocFormat ? doc.champ.nom : `Document ${index + 1}`}
                                                    primaryTypographyProps={{
                                                        fontWeight: 600,
                                                        color: selectedDocIndex === index ? primaryColor : secondaryColor,
                                                        noWrap: true
                                                    }}
                                                />
                                            </Tooltip>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box sx={{ 
                            width: { xs: '100%', md: '70%' },
                            bgcolor: 'white',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            height: '100%',
                            display: 'flex'
                        }}>
                            {selectedDocs[selectedDocIndex] && renderDocument(selectedDocs[selectedDocIndex])}
                        </Box>
                    </>
                ) : (
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            textAlign: 'center',
                            py: 4,
                            color: '#333',
                            fontStyle: 'italic',
                            width: '100%'
                        }}
                    >
                        Aucun document disponible pour ce candidat.
                    </Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DocumentDialog;
