import React from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Card, 
    CardContent, 
    Grid, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    Chip,
    Button,
    Container,
    alpha,
    styled
} from '@mui/material';
import {
    Assignment,
    Edit,
    Visibility,
    GetApp,
    CheckCircle,
    Schedule,
    People,
    CalendarMonth,
    PlayArrow
} from '@mui/icons-material';

// Couleurs du thème (identiques à votre GestionConcours)
const primaryColor = "#B36B39";
const secondaryColor = "#2C3E50";
const backgroundColor = "#F5F5F5";

// Composants stylisés identiques à votre GestionConcours
const PageHeader = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, rgba(179, 107, 57, 0.15) 0%, rgba(44, 62, 80, 0.05) 100%)`,
    borderRadius: 24,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    border: `1px solid rgba(179, 107, 57, 0.1)`,
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "5px",
        background: `linear-gradient(90deg, #B36B39, #2C3E50)`,
    },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
    backgroundColor: "#B36B39",
    padding: theme.spacing(2.5),
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "30%",
        height: "100%",
        background: `linear-gradient(135deg, transparent 0%, #ffffff 100%)`,
        opacity: 0.1,
        borderRadius: "50% 0 0 50%",
    },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: theme.spacing(4),
    border: `1px solid rgba(179, 107, 57, 0.1)`,
    position: "relative",
}));

const ActionButton = styled(Button)(() => ({
    borderRadius: 30,
    textTransform: "none",
    fontWeight: 600,
    boxShadow: "none",
    padding: "12px 24px",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
    background: `linear-gradient(45deg, ${primaryColor} 30%, ${primaryColor}CC 90%)`,
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
        background: `linear-gradient(45deg, ${primaryColor}CC 30%, ${primaryColor} 90%)`,
    },
}));

const WelcomePage = ({ onSelectConcours }) => {
    const features = [
        {
            icon: <Assignment />,
            title: "Gestion des Candidatures",
            description: "Visualisez et gérez toutes les candidatures par phase"
        },
        {
            icon: <Edit />,
            title: "Notation des Dossiers",
            description: "Attribuez des notes aux dossiers de candidature"
        },
        {
            icon: <Visibility />,
            title: "Consultation des Documents",
            description: "Accédez aux documents soumis par les candidats"
        },
        {
            icon: <GetApp />,
            title: "Export Excel",
            description: "Exportez les données vers Excel avec tous les détails"
        },
        {
            icon: <CheckCircle />,
            title: "Gestion des Statuts",
            description: "Modifiez les statuts des candidatures selon les phases"
        },
        {
            icon: <Schedule />,
            title: "Suivi Multi-phases",
            description: "Gérez les phases : Candidature → Écrit → Oral → Final"
        }
    ];

    const phases = [
        {
            name: "Phase Candidature",
            description: "Gestion des dossiers de candidature et notation",
            color: "primary"
        },
        {
            name: "Phase Épreuve Écrite",
            description: "Saisie et gestion des notes d'épreuves écrites",
            color: "secondary"
        },
        {
            name: "Phase Épreuve Orale",
            description: "Saisie et gestion des notes d'épreuves orales",
            color: "warning"
        },
        {
            name: "Phase Finale",
            description: "Génération des listes principales et d'attente",
            color: "success"
        }
    ];

    const handleSelectConcours = () => {
        // Déclencher l'ouverture du sélecteur de concours
        if (onSelectConcours) {
            onSelectConcours();
        } else {
            // Alternative : faire défiler vers le haut pour voir le sélecteur
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Optionnel : mettre en évidence le sélecteur
            const selector = document.querySelector('[data-testid="concours-selector"]') || 
                           document.querySelector('select') ||
                           document.querySelector('.MuiSelect-root');
            if (selector) {
                selector.focus();
                selector.style.animation = 'pulse 1s ease-in-out 3';
            }
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: backgroundColor, py: 5, px: { xs: 2, md: 4 } }}>
            <Container maxWidth="lg">
                {/* En-tête de page - Style identique à GestionConcours */}
                <PageHeader>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            fontWeight: "bold",
                            mb: 1,
                            background: `linear-gradient(45deg, #2C3E50, #B36B39)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        Système de Gestion des Concours
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{ 
                            color: alpha("#2C3E50", 0.7), 
                            maxWidth: "700px", 
                            mx: "auto",
                            mb: 3
                        }}
                    >
                        Plateforme complète pour la gestion des candidatures et des épreuves de concours
                    </Typography>
                    
                    {/* Bouton de sélection de concours */}
                    <Box sx={{ textAlign: 'center' }}>
                        <ActionButton
                            variant="contained"
                            size="large"
                            startIcon={<PlayArrow />}
                            onClick={handleSelectConcours}
                            sx={{ 
                                fontSize: '1.2rem',
                                py: 1.5,
                                px: 4,
                                boxShadow: '0 4px 15px rgba(179, 107, 57, 0.3)'
                            }}
                        >
                            Sélectionner un Concours
                        </ActionButton>
                    </Box>
                </PageHeader>

                <Grid container spacing={4}>
                    {/* Fonctionnalités principales */}
                    <Grid item xs={12} md={8}>
                        <StyledPaper elevation={3}>
                            <SectionHeader>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#fff" }}
                                >
                                    <Assignment /> Fonctionnalités Principales
                                </Typography>
                            </SectionHeader>
                            <CardContent sx={{ p: 4 }}>
                                <Grid container spacing={3}>
                                    {features.map((feature, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Card 
                                                sx={{ 
                                                    height: '100%',
                                                    borderRadius: 16,
                                                    transition: 'all 0.3s ease',
                                                    border: `1px solid rgba(179, 107, 57, 0.1)`,
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                                        borderColor: `${primaryColor}40`,
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <Box sx={{ 
                                                            color: primaryColor, 
                                                            mr: 2,
                                                            p: 1,
                                                            borderRadius: 2,
                                                            backgroundColor: alpha(primaryColor, 0.1)
                                                        }}>
                                                            {feature.icon}
                                                        </Box>
                                                        <Typography variant="h6" sx={{ 
                                                            fontWeight: 'bold',
                                                            color: secondaryColor
                                                        }}>
                                                            {feature.title}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                        {feature.description}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </StyledPaper>
                    </Grid>

                    {/* Phases du concours */}
                    <Grid item xs={12} md={4}>
                        <StyledPaper elevation={3}>
                            <SectionHeader>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#fff" }}
                                >
                                    <CalendarMonth /> Phases du Concours
                                </Typography>
                            </SectionHeader>
                            <CardContent sx={{ p: 4 }}>
                                <List sx={{ p: 0 }}>
                                    {phases.map((phase, index) => (
                                        <ListItem key={index} sx={{ mb: 2, p: 0 }}>
                                            <Paper sx={{ 
                                                width: '100%', 
                                                p: 3,
                                                borderRadius: 12,
                                                border: `1px solid rgba(179, 107, 57, 0.1)`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateX(5px)',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                }
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                    <Chip 
                                                        label={`${index + 1}`} 
                                                        sx={{
                                                            backgroundColor: primaryColor,
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            mr: 2,
                                                            width: 32,
                                                            height: 32
                                                        }}
                                                    />
                                                    <Typography variant="subtitle1" sx={{ 
                                                        fontWeight: 'bold',
                                                        color: secondaryColor
                                                    }}>
                                                        {phase.name}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ 
                                                    ml: 5,
                                                    lineHeight: 1.5
                                                }}>
                                                    {phase.description}
                                                </Typography>
                                            </Paper>
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </StyledPaper>
                    </Grid>
                </Grid>

                {/* Instructions */}
                <StyledPaper elevation={3}>
                    <SectionHeader sx={{ backgroundColor: secondaryColor }}>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, color: "#fff" }}
                        >
                            <CheckCircle /> Comment commencer ?
                        </Typography>
                    </SectionHeader>
                    <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Box sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: alpha(primaryColor, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: primaryColor, fontWeight: 'bold' }}>
                                            1
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: secondaryColor }}>
                                        Sélectionnez un concours
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Choisissez le concours à gérer dans la liste déroulante
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Box sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: alpha(primaryColor, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: primaryColor, fontWeight: 'bold' }}>
                                            2
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: secondaryColor }}>
                                        Naviguez entre les phases
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Gérez chaque phase selon le type d'épreuve du concours
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Box sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: alpha(primaryColor, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <Typography variant="h4" sx={{ color: primaryColor, fontWeight: 'bold' }}>
                                            3
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: secondaryColor }}>
                                        Gérez les candidatures
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Attribuez des notes et modifiez les statuts des candidats
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </StyledPaper>
            </Container>
            
            {/* Style CSS pour l'animation pulse */}
            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                `}
            </style>
        </Box>
    );
};

export default WelcomePage;
