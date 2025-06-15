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
    Chip
} from '@mui/material';
import {
    Assignment,
    Edit,
    Visibility,
    GetApp,
    CheckCircle,
    Schedule,
    People
} from '@mui/icons-material';

const WelcomePage = () => {
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

    return (
        <Box sx={{ p: 4 }}>
            <Paper sx={{ p: 4, mb: 4, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                <Typography variant="h3" sx={{ mb: 2, color: '#2C3E50', fontWeight: 'bold' }}>
                    Système de Gestion des Concours
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', mb: 3 }}>
                    Plateforme complète pour la gestion des candidatures et des épreuves de concours
                </Typography>
                <Chip 
                    label="Sélectionnez un concours pour commencer" 
                    color="primary" 
                    
                    sx={{ fontSize: '1.1rem', py: 3 }}
                />
            </Paper>

            <Grid container spacing={4}>
                {/* Fonctionnalités principales */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h4" sx={{ mb: 3, color: '#B36B39' }}>
                        Fonctionnalités Principales
                    </Typography>
                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ color: '#B36B39', mr: 2 }}>
                                                {feature.icon}
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {feature.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Phases du concours */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h4" sx={{ mb: 3, color: '#B36B39' }}>
                        Phases du Concours
                    </Typography>
                    <List>
                        {phases.map((phase, index) => (
                            <ListItem key={index} sx={{ mb: 2 }}>
                                <Paper sx={{ width: '100%', p: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <ListItemIcon>
                                            <People sx={{ color: '#B36B39' }} />
                                        </ListItemIcon>
                                        <Chip 
                                            label={`${index + 1}`} 
                                            color="default"
                                            size="small"
                                            sx={{ mr: 2 }}
                                        />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            {phase.name}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 7 }}>
                                        {phase.description}
                                    </Typography>
                                </Paper>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>

            {/* Instructions */}
            <Paper sx={{ p: 3, mt: 4, backgroundColor: '#e3f2fd' }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#1976d2' }}>
                    Comment commencer ?
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    1. <strong>Sélectionnez un concours</strong> dans la liste déroulante ci-dessus
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    2. <strong>Naviguez entre les phases</strong> selon le type d'épreuve du concours
                </Typography>
                <Typography variant="body1">
                    3. <strong>Gérez les candidatures</strong> en attribuant des notes et en modifiant les statuts
                </Typography>
            </Paper>
        </Box>
    );
};

export default WelcomePage;
