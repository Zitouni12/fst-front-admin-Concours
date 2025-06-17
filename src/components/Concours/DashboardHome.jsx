import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Chip,
    LinearProgress,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Button,
    Alert,
    AlertTitle
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    School as SchoolIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Cancel as CancelIcon,
    Analytics as AnalyticsIcon,
    Info as InfoIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios';

// Couleurs du thème
const primaryColor = "#B36B39";
const secondaryColor = "#2C3E50";
const backgroundColor = "#F5F5F5";
const accentColor = "#E74C3C";
const successColor = "#27AE60";
const warningColor = "#F39C12";

// Composant stylé pour les cartes de statistiques
const StatsCard = styled(Card)(({ theme, color }) => ({
    background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
    color: 'white',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    }
}));

// Composant stylé pour les cartes d'information
const InfoCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 16,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    border: `2px solid ${primaryColor}20`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderColor: `${primaryColor}40`,
    }
}));

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalConcours: 0,
        totalCandidatures: 0,
        candidaturesEnAttente: 0,
        candidaturesAcceptees: 0,
        candidaturesRejetees: 0,
        concoursActifs: 0,
        concoursTermines: 0
    });
    const [recentConcours, setRecentConcours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Récupérer les statistiques générales
            const statsResponse = await axios.get('http://localhost:8000/api/admin/dashboard/stats');
            setStats(statsResponse.data);

            // Récupérer les concours récents
            const concoursResponse = await axios.get('http://localhost:8000/api/admin/dashboard/recent-concours');
            setRecentConcours(concoursResponse.data);
            
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'actif': return successColor;
            case 'termine': return secondaryColor;
            case 'brouillon': return warningColor;
            default: return primaryColor;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'actif': return <CheckCircleIcon />;
            case 'termine': return <CancelIcon />;
            case 'brouillon': return <ScheduleIcon />;
            default: return <AssignmentIcon />;
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
                <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                    Chargement des données...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, backgroundColor: backgroundColor, minHeight: '100vh' }}>
            {/* En-tête de bienvenue */}
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 700, 
                        color: secondaryColor,
                        mb: 1,
                        background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Tableau de Bord - Gestion des Concours
                </Typography>
                <Typography variant="h6" sx={{ color: '#666', mb: 3 }}>
                    Vue d'ensemble de votre plateforme de gestion des candidatures
                </Typography>
                
                <Alert 
                    severity="info" 
                    icon={<InfoIcon />}
                    sx={{ 
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${primaryColor}10, ${primaryColor}05)`,
                        border: `1px solid ${primaryColor}30`
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 600 }}>Bienvenue dans votre espace d'administration</AlertTitle>
                    Sélectionnez un concours ci-dessous pour commencer la gestion des candidatures et accéder aux outils d'évaluation.
                </Alert>
            </Box>

            {/* Statistiques principales */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard color={primaryColor}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <SchoolIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                {stats.totalConcours}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Concours Total
                            </Typography>
                        </CardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard color={successColor}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <PeopleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                {stats.totalCandidatures}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Candidatures
                            </Typography>
                        </CardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard color={warningColor}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <ScheduleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                {stats.candidaturesEnAttente}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                En Attente
                            </Typography>
                        </CardContent>
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard color={accentColor}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <TrendingUpIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                {Math.round((stats.candidaturesAcceptees / stats.totalCandidatures) * 100) || 0}%
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Taux d'Admission
                            </Typography>
                        </CardContent>
                    </StatsCard>
                </Grid>
            </Grid>

            {/* Statistiques détaillées et concours récents */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Répartition des candidatures */}
                <Grid item xs={12} md={6}>
                    <InfoCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <AnalyticsIcon sx={{ color: primaryColor, mr: 2, fontSize: 32 }} />
                            <Typography variant="h5" sx={{ fontWeight: 600, color: secondaryColor }}>
                                Répartition des Candidatures
                            </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Acceptées</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: successColor }}>
                                    {stats.candidaturesAcceptees}
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(stats.candidaturesAcceptees / stats.totalCandidatures) * 100 || 0}
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': { backgroundColor: successColor }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">En Attente</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: warningColor }}>
                                    {stats.candidaturesEnAttente}
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(stats.candidaturesEnAttente / stats.totalCandidatures) * 100 || 0}
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': { backgroundColor: warningColor }
                                }}
                            />
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Rejetées</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: accentColor }}>
                                    {stats.candidaturesRejetees}
                                </Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(stats.candidaturesRejetees / stats.totalCandidatures) * 100 || 0}
                                sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': { backgroundColor: accentColor }
                                }}
                            />
                        </Box>
                    </InfoCard>
                </Grid>

                {/* Concours récents */}
                <Grid item xs={12} md={6}>
                    <InfoCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TimelineIcon sx={{ color: primaryColor, mr: 2, fontSize: 32 }} />
                            <Typography variant="h5" sx={{ fontWeight: 600, color: secondaryColor }}>
                                Concours Récents
                            </Typography>
                        </Box>
                        
                        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {recentConcours.map((concours, index) => (
                                <React.Fragment key={concours.id}>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ backgroundColor: getStatusColor(concours.statut) }}>
                                                {getStatusIcon(concours.statut)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {concours.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {concours.description?.substring(0, 60)}...
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                        <Chip 
                                                            label={concours.statut} 
                                                            size="small"
                                                            sx={{ 
                                                                backgroundColor: getStatusColor(concours.statut),
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                mr: 1
                                                            }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {concours.candidatures_count} candidatures
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < recentConcours.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </InfoCard>
                </Grid>
            </Grid>

            {/* Guide d'utilisation */}
            <InfoCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <InfoIcon sx={{ color: primaryColor, mr: 2, fontSize: 32 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: secondaryColor }}>
                        Guide d'Utilisation de la Plateforme
                    </Typography>
                </Box>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Avatar sx={{ 
                                backgroundColor: `${primaryColor}20`, 
                                color: primaryColor, 
                                width: 64, 
                                height: 64, 
                                mx: 'auto', 
                                mb: 2 
                            }}>
                                <SchoolIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: secondaryColor }}>
                                1. Sélection du Concours
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Choisissez le concours que vous souhaitez gérer dans la liste déroulante ci-dessus.
                            </Typography>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Avatar sx={{ 
                                backgroundColor: `${successColor}20`, 
                                color: successColor, 
                                width: 64, 
                                height: 64, 
                                mx: 'auto', 
                                mb: 2 
                            }}>
                                <PeopleIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: secondaryColor }}>
                                2. Gestion des Phases
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Naviguez entre les phases de candidature, épreuves écrites, orales et résultats finaux.
                            </Typography>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Avatar sx={{ 
                                backgroundColor: `${warningColor}20`, 
                                color: warningColor, 
                                width: 64, 
                                height: 64, 
                                mx: 'auto', 
                                mb: 2 
                            }}>
                                <AnalyticsIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: secondaryColor }}>
                                3. Évaluation et Export
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Évaluez les candidatures, importez les notes et exportez les résultats finaux.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </InfoCard>
        </Box>
    );
};

export default DashboardHome;
