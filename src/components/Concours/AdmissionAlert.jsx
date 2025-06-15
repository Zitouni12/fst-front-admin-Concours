import React from 'react';
import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import { CheckCircle, Group, TrendingUp } from '@mui/icons-material';

// Couleurs de votre charte
const primaryColor = "#B36B39"; // Bronze/cuivre
const secondaryColor = "#2C3E50"; // Bleu foncé
const accentColor = "#E74C3C"; // Rouge pour l'accent

const AdmissionAlert = ({ 
    message, 
    admisCount, 
    nonAdmisCount, 
    changesCount,
    statutAdmis,
    onClose, 
    autoHideDuration = 6000 
}) => {
    React.useEffect(() => {
        if (autoHideDuration > 0) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, autoHideDuration);
            
            return () => clearTimeout(timer);
        }
    }, [autoHideDuration, onClose]);

    // Déterminer l'icône selon le type d'admission
    const getIcon = () => {
        if (statutAdmis?.includes('liste principale')) {
            return <CheckCircle sx={{ fontSize: '2rem', color: primaryColor }} />;
        } else if (statutAdmis?.includes('liste attente')) {
            return <TrendingUp sx={{ fontSize: '2rem', color: '#FF9800' }} />;
        }
        return <Group sx={{ fontSize: '2rem', color: primaryColor }} />;
    };

    // Déterminer la couleur de fond selon le type
    const getBackgroundColor = () => {
        if (statutAdmis?.includes('liste principale')) {
            return '#f0f7ff'; // Bleu très clair
        } else if (statutAdmis?.includes('liste attente')) {
            return '#fffbf0'; // Orange très clair
        }
        return '#fefcf9'; // Bronze très clair
    };

    // Déterminer la couleur de bordure
    const getBorderColor = () => {
        if (statutAdmis?.includes('liste principale')) {
            return primaryColor;
        } else if (statutAdmis?.includes('liste attente')) {
            return '#FF9800';
        }
        return primaryColor;
    };

    return (
        <Alert 
            severity="success" 
            onClose={onClose}
            icon={getIcon()}
            sx={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 9999,
                minWidth: 400,
                maxWidth: 550,
                boxShadow: '0 12px 40px rgba(179, 107, 57, 0.2)',
                borderRadius: 4,
                border: `2px solid ${getBorderColor()}`,
                backgroundColor: getBackgroundColor(),
                backdropFilter: 'blur(10px)',
                animation: 'slideInRight 0.5s ease-out',
                '@keyframes slideInRight': {
                    '0%': {
                        transform: 'translateX(100%)',
                        opacity: 0
                    },
                    '100%': {
                        transform: 'translateX(0)',
                        opacity: 1
                    }
                },
                '& .MuiAlert-icon': {
                    alignSelf: 'flex-start',
                    mt: 0.5,
                    filter: 'drop-shadow(0 2px 4px rgba(179, 107, 57, 0.3))'
                },
                '& .MuiAlert-message': {
                    padding: 0,
                    width: '100%'
                },
                '& .MuiAlert-action': {
                    color: secondaryColor,
                    '&:hover': {
                        backgroundColor: `${primaryColor}15`
                    }
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${getBorderColor()} 0%, ${getBorderColor()}CC 50%, ${getBorderColor()} 100%)`,
                    borderRadius: '4px 4px 0 0'
                }
            }}
        >
            <Box sx={{ width: '100%' }}>
                <AlertTitle sx={{ 
                    color: secondaryColor,
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    mb: 1.5,
                    fontFamily: '"Roboto", "Arial", sans-serif',
                    textShadow: '0 1px 2px rgba(44, 62, 80, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    🎓 Admission automatique effectuée !
                </AlertTitle>
                
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: secondaryColor,
                        fontWeight: 500,
                        mb: 2,
                        fontSize: '1rem'
                    }}
                >
                    {message}
                </Typography>
                
                {/* Statistiques d'admission */}
                <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: 1.5,
                    mb: 1.5
                }}>
                    {admisCount > 0 && (
                        <Box sx={{ 
                            backgroundColor: `${primaryColor}15`,
                            padding: '8px 12px',
                            borderRadius: 2,
                            border: `1px solid ${primaryColor}40`,
                            textAlign: 'center'
                        }}>
                            <Typography variant="h6" sx={{ 
                                color: primaryColor, 
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>
                                {admisCount}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                                color: secondaryColor,
                                fontSize: '0.8rem'
                            }}>
                                Candidats admis
                            </Typography>
                        </Box>
                    )}
                    
                    {nonAdmisCount > 0 && (
                        <Box sx={{ 
                            backgroundColor: `${accentColor}15`,
                            padding: '8px 12px',
                            borderRadius: 2,
                            border: `1px solid ${accentColor}40`,
                            textAlign: 'center'
                        }}>
                            <Typography variant="h6" sx={{ 
                                color: accentColor, 
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>
                                {nonAdmisCount}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                                color: secondaryColor,
                                fontSize: '0.8rem'
                            }}>
                                Non admis
                            </Typography>
                        </Box>
                    )}
                    
                    {changesCount > 0 && (
                        <Box sx={{ 
                            backgroundColor: `${secondaryColor}15`,
                            padding: '8px 12px',
                            borderRadius: 2,
                            border: `1px solid ${secondaryColor}40`,
                            textAlign: 'center'
                        }}>
                            <Typography variant="h6" sx={{ 
                                color: secondaryColor, 
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>
                                {changesCount}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                                color: secondaryColor,
                                fontSize: '0.8rem'
                            }}>
                                Modifications
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Statut d'admission */}
                {statutAdmis && (
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: getBorderColor(),
                            fontStyle: 'italic',
                            fontSize: '0.9rem',
                            backgroundColor: `${getBorderColor()}08`,
                            padding: '6px 10px',
                            borderRadius: 2,
                            border: `1px solid ${getBorderColor()}30`,
                            textAlign: 'center'
                        }}
                    >
                        📋 Statut appliqué : <strong>{statutAdmis}</strong>
                    </Typography>
                )}
            </Box>
        </Alert>
    );
};

export default AdmissionAlert;
