// components/Concours/ScoreMeriteConfig.jsx
import React, { useState } from 'react';
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
    } 
}) => {
    const [config, setConfig] = useState(initialConfig);
    const [errors, setErrors] = useState({});

    const validateConfig = () => {
        const newErrors = {};
        
        // Vérifier qu'au moins un type de note est sélectionné
        if (!config.includeDossier && !config.includeEcrit && !config.includeOral) {
            newErrors.general = "Veuillez sélectionner au moins un type de note";
        }
        
        // Vérifier que les coefficients sont valides
        if (config.includeDossier && (config.coeffDossier <= 0 || config.coeffDossier > 5)) {
            newErrors.coeffDossier = "Le coefficient doit être entre 0.01 et 5";
        }
        
        if (config.includeEcrit && (config.coeffEcrit <= 0 || config.coeffEcrit > 5)) {
            newErrors.coeffEcrit = "Le coefficient doit être entre 0.01 et 5";
        }
        
        if (config.includeOral && (config.coeffOral <= 0 || config.coeffOral > 5)) {
            newErrors.coeffOral = "Le coefficient doit être entre 0.01 et 5";
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#B36B39' }}>
                    Configuration du Score Mérite
                </Typography>
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
                    {/* Note de Dossier */}
                    <Grid item xs={12} md={4}>
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
                                    inputProps={{ step: 0.01, min: 0.01, max: 5 }}
                                    error={!!errors.coeffDossier}
                                    helperText={errors.coeffDossier}
                                    fullWidth
                                    sx={{ mt: 1 }}
                                />
                            )}
                        </Box>
                    </Grid>

                    {/* Note Écrite */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={config.includeEcrit}
                                        onChange={(e) => setConfig({...config, includeEcrit: e.target.checked})}
                                        color="primary"
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
                                    inputProps={{ step: 0.01, min: 0.01, max: 5 }}
                                    error={!!errors.coeffEcrit}
                                    helperText={errors.coeffEcrit}
                                    fullWidth
                                    sx={{ mt: 1 }}
                                />
                            )}
                        </Box>
                    </Grid>

                    {/* Note Orale */}
                    <Grid item xs={12} md={4}>
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
                                    inputProps={{ step: 0.01, min: 0.01, max: 5 }}
                                    error={!!errors.coeffOral}
                                    helperText={errors.coeffOral}
                                    fullWidth
                                    sx={{ mt: 1 }}
                                />
                            )}
                        </Box>
                    </Grid>
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
