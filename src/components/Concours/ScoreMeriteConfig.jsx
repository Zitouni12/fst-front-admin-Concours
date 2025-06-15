import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    FormControlLabel,
    Checkbox,
    Grid,
    Alert
} from '@mui/material';

const ScoreMeriteConfig = ({ 
    open, 
    onClose, 
    onSave, 
    initialConfig = { 
        includeDossier: true, 
        includeEcrit: true, 
        includeOral: true,
        coeffDossier: 0.5,
        coeffEcrit: 1,
        coeffOral: 0.25
    },
    phase, // NOUVELLE PROP
    typeEpreuve // NOUVELLE PROP
}) => {
    const [config, setConfig] = useState(initialConfig);
    const [errors, setErrors] = useState({});

    // ✅ CORRECTION : Adapter la configuration selon la phase et le type d'épreuve
    useEffect(() => {
        let adaptedConfig = { ...initialConfig };
        
        if (phase === 'ecrits') {
            // ✅ En phase écrits : Note écrite DISPONIBLE, note orale PAS ENCORE
            adaptedConfig.includeEcrit = true;
            adaptedConfig.coeffEcrit = adaptedConfig.coeffEcrit || 1;
            
            // Pas de note orale (pas encore passée)
            adaptedConfig.includeOral = false;
            adaptedConfig.coeffOral = 0;
            
        } else if (phase === 'oral') {
            // En phase orale, selon le type de concours
            if (typeEpreuve === 'oral') {
                // Concours oral uniquement : pas de note écrite
                adaptedConfig.includeEcrit = false;
                adaptedConfig.coeffEcrit = 0;
            } else if (typeEpreuve === 'ecrit_oral') {
                // Concours écrit + oral : note écrite disponible
                adaptedConfig.includeEcrit = true;
                adaptedConfig.coeffEcrit = adaptedConfig.coeffEcrit || 1;
            }
            
            // Note orale toujours disponible en phase orale
            adaptedConfig.includeOral = true;
            adaptedConfig.coeffOral = adaptedConfig.coeffOral || 0.25;
        }
        
        setConfig(adaptedConfig);
    }, [phase, typeEpreuve, initialConfig]);

    const validateConfig = () => {
        const newErrors = {};
        
        if (!config.includeDossier && !config.includeEcrit && !config.includeOral) {
            newErrors.general = "Veuillez sélectionner au moins un type de note";
        }
        
        // ✅ AUTORISER 0 dans les coefficients
        if (config.includeDossier && (config.coeffDossier < 0 || config.coeffDossier > 5)) {
            newErrors.coeffDossier = "Le coefficient doit être entre 0 et 5";
        }
        
        if (config.includeEcrit && (config.coeffEcrit < 0 || config.coeffEcrit > 5)) {
            newErrors.coeffEcrit = "Le coefficient doit être entre 0 et 5";
        }
        
        if (config.includeOral && (config.coeffOral < 0 || config.coeffOral > 5)) {
            newErrors.coeffOral = "Le coefficient doit être entre 0 et 5";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateConfig()) {
            onSave(config);
            onClose();
        }
    };

    const calculateExample = () => {
        let score = 0;
        const exampleNotes = { dossier: 12, ecrit: 13, oral: 12 };
        
        if (config.includeDossier) score += exampleNotes.dossier * config.coeffDossier;
        if (config.includeEcrit) score += exampleNotes.ecrit * config.coeffEcrit;
        if (config.includeOral) score += exampleNotes.oral * config.coeffOral;
        
        return score.toFixed(2);
    };

    // ✅ CORRECTION : Déterminer quels types de notes afficher selon la phase et le type d'épreuve
    const shouldShowDossier = true; // Toujours disponible

    // Note écrite disponible en phase écrits ET selon le type d'épreuve en phase orale
    const shouldShowEcrit = (phase === 'ecrits') || 
                           (phase === 'oral' && typeEpreuve !== 'oral');

    // Note orale disponible seulement en phase orale
    const shouldShowOral = (phase === 'oral');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Configuration du Score Mérite
            </DialogTitle>
            
            <DialogContent>
                {errors.general && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.general}
                    </Alert>
                )}
                
                <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                    Définissez les pondérations pour calculer le Score Mérite. 
                    Formule : Score Mérite = Note Dossier × Coeff1 + Note Écrite × Coeff2 + Note Orale × Coeff3
                </Typography>

                <Grid container spacing={3}>
                    {/* Note de Dossier - Toujours disponible */}
                    {shouldShowDossier && (
                        <Grid item xs={12} md={shouldShowEcrit && shouldShowOral ? 4 : shouldShowEcrit || shouldShowOral ? 6 : 12}>
                            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={config.includeDossier}
                                            onChange={(e) => setConfig({...config, includeDossier: e.target.checked})}
                                            color="primary"
                                        />
                                    }
                                    label={<Typography variant="h6">Note de Dossier</Typography>}
                                />
                                
                                {config.includeDossier && (
                                    <TextField
                                        label="Coefficient"
                                        type="number"
                                        value={config.coeffDossier}
                                        onChange={(e) => setConfig({...config, coeffDossier: parseFloat(e.target.value) || 0})}
                                        inputProps={{ step: 0.01, min: 0, max: 5 }}
                                        error={!!errors.coeffDossier}
                                        helperText={errors.coeffDossier}
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    )}

                    {/* Note Écrite - Selon le contexte */}
                    {shouldShowEcrit && (
                        <Grid item xs={12} md={shouldShowDossier && shouldShowOral ? 4 : shouldShowDossier || shouldShowOral ? 6 : 12}>
                            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={config.includeEcrit}
                                            onChange={(e) => setConfig({...config, includeEcrit: e.target.checked})}
                                            color="primary"
                                            // ✅ CORRECTION : Ne pas désactiver en phase écrits
                                            disabled={false}
                                        />
                                    }
                                    label={<Typography variant="h6">Note Écrite</Typography>}
                                />
                                
                                {config.includeEcrit && (
                                    <TextField
                                        label="Coefficient"
                                        type="number"
                                        value={config.coeffEcrit}
                                        onChange={(e) => setConfig({...config, coeffEcrit: parseFloat(e.target.value) || 0})}
                                        inputProps={{ step: 0.01, min: 0, max: 5 }}
                                        error={!!errors.coeffEcrit}
                                        helperText={errors.coeffEcrit}
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    )}

                    {/* Note Orale - Selon le contexte */}
                    {shouldShowOral && (
                        <Grid item xs={12} md={shouldShowDossier && shouldShowEcrit ? 4 : shouldShowDossier || shouldShowEcrit ? 6 : 12}>
                            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={config.includeOral}
                                            onChange={(e) => setConfig({...config, includeOral: e.target.checked})}
                                            color="primary"
                                        />
                                    }
                                    label={<Typography variant="h6">Note Orale</Typography>}
                                />
                                
                                {config.includeOral && (
                                    <TextField
                                        label="Coefficient"
                                        type="number"
                                        value={config.coeffOral}
                                        onChange={(e) => setConfig({...config, coeffOral: parseFloat(e.target.value) || 0})}
                                        inputProps={{ step: 0.01, min: 0, max: 5 }}
                                        error={!!errors.coeffOral}
                                        helperText={errors.coeffOral}
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Exemple de calcul */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, color: '#B36B39' }}>
                        Exemple de calcul :
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Avec les notes : Dossier = 12, Écrite = 13, Orale = 12
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Score Mérite = {calculateExample()}
                    </Typography>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="secondary">
                    Annuler
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Appliquer la Configuration
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScoreMeriteConfig;
