import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  TextField, 
  Button, 
  Box, 
  Switch,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Chip
} from '@mui/material';

// Définition des couleurs principales selon la charte graphique UCA
const primaryColor = "#B36B39"; // Couleur bronze/cuivre du logo
const secondaryColor = "#2C3E50"; // Bleu foncé pour le contraste
const backgroundColor = "#F5F5F5"; // Gris clair pour le fond
const accentColor = "#E74C3C"; // Rouge pour l'accent

const CandidatureActions = ({ 
  selectedFields, 
  handleFieldChange, 
  extraFormula, 
  setExtraFormula, 
  sortByAverage, 
  setSortByAverage, 
  dynamicFields,
  forceRefresh // Nouvelle prop pour forcer le rafraîchissement du parent
}) => {
    // États pour les bonus
    const [bacBonusEnabled, setBacBonusEnabled] = useState(false);
    const [mentionBonusEnabled, setMentionBonusEnabled] = useState(false);
    
    // États pour le bonus basé sur l'année du bac
    const [bacComparison, setBacComparison] = useState('<');
    const [bacYear, setBacYear] = useState('');
    const [bacBonus, setBacBonus] = useState('');
    const [bacFormula, setBacFormula] = useState('');
    
    // État pour le bonus basé sur la mention
    const [selectedMention, setSelectedMention] = useState('');
    const [mentionBonus, setMentionBonus] = useState('');
    const [mentionFormula, setMentionFormula] = useState('');
    
    // État pour le type de bonus actuellement en édition
    const [activeBonus, setActiveBonus] = useState('');

    // Mettre à jour la formule combinée quand les formules individuelles changent
    useEffect(() => {
        updateExtraFormula();
    }, [bacBonusEnabled, mentionBonusEnabled, bacFormula, mentionFormula]);

    // Fonction pour appliquer le bonus du bac
    const applyBacBonus = () => {
        const formula = `Année_d_obtention_du_Bac ${bacComparison} ${bacYear} ? ${bacBonus} : 0`;
        setBacFormula(formula);
        setBacBonusEnabled(true);
        setActiveBonus('');
    };

    // Fonction pour appliquer le bonus de mention
    const applyMentionBonus = () => {
        let formula = '';
        if (selectedMention === 'passable') {
            formula = `(average >= 10 && average < 12) ? ${mentionBonus} : 0`;
        } else if (selectedMention === 'assez_bien') {
            formula = `(average >= 12 && average < 14) ? ${mentionBonus} : 0`;
        } else if (selectedMention === 'bien') {
            formula = `(average >= 14 && average < 16) ? ${mentionBonus} : 0`;
        } else if (selectedMention === 'tres_bien') {
            formula = `average >= 16 ? ${mentionBonus} : 0`;
        }
        setMentionFormula(formula);
        setMentionBonusEnabled(true);
        setActiveBonus('');
    };

    // Fonction pour désactiver un bonus
    const disableBonus = (type) => {
        if (type === 'bac') {
            setBacBonusEnabled(false);
        } else if (type === 'mention') {
            setMentionBonusEnabled(false);
        }
        // Mettre à jour la formule immédiatement après désactivation
        setTimeout(() => updateExtraFormula(), 0);
    };

    // Fonction pour mettre à jour la formule combinée
    const updateExtraFormula = () => {
        const combinedFormula = `average + ${bacBonusEnabled ? `(${bacFormula})` : '0'} + ${mentionBonusEnabled ? `(${mentionFormula})` : '0'}`;
        setExtraFormula(combinedFormula);
        
        // Forcer un rafraîchissement du composant parent pour recalculer les moyennes
        if (forceRefresh) {
            setTimeout(() => forceRefresh(), 0);
        }
    };

    // Fonction pour éditer un bonus existant
    const editBonus = (type) => {
        setActiveBonus(type);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 4 }}>
            <Typography 
                variant="h2" 
                sx={{ 
                    fontSize: "1.5rem", 
                    fontWeight: 600, 
                    color: secondaryColor,
                    mb: 2
                }}
            >
                Configuration des critères
            </Typography>
            
            <Typography 
                variant="h6" 
                sx={{ 
                    color: primaryColor, 
                    fontWeight: 600,
                    mb: 1
                }}
            >
                Champs à inclure :
            </Typography>
            
            <FormGroup row sx={{ mb: 3 }}>
                {dynamicFields
                   .filter(field => 
                        (field.nom.includes('Note S') && !field.nom.includes('Relevé')) || 
                        (field.nom.includes('Note Semestre') && !field.nom.includes('Relevé'))
                    )
                  .map((field, index) => {
                        const shortName = field.nom.includes('Note S') ? 
                            field.nom.replace('Note S', 'S') : 
                            field.nom.includes('Note Semestre') ? 
                                field.nom.replace('Note Semestre', 'S') : field.nom;
                        
                        return (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox 
                                        checked={selectedFields.includes(field.nom)}
                                        onChange={() => handleFieldChange(field.nom)}
                                        sx={{
                                            color: primaryColor,
                                            '&.Mui-checked': {
                                                color: primaryColor,
                                            },
                                        }}
                                    />
                                }
                                label={shortName}
                            />
                        );
                    })
                }
            </FormGroup>

            <Typography 
                variant="h6" 
                sx={{ 
                    mt: 3, 
                    color: primaryColor, 
                    fontWeight: 600,
                    mb: 1
                }}
            >
                Définissez des règles pour ajouter des bonus
            </Typography>
            
            <Typography 
                variant="body2" 
                sx={{ 
                    color: "text.secondary",
                    mb: 2
                }}
            >
                Vous pouvez ajouter plusieurs bonus qui s'additionnent pour donner un bonus total à la moyenne.
            </Typography>

            {/* Afficher les bonus actifs sous forme de chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {bacBonusEnabled && (
                    <Chip 
                        label={`Bonus Bac: ${bacComparison} ${bacYear} (+${bacBonus})`}
                        color="primary"
                        sx={{ bgcolor: primaryColor }}
                        onDelete={() => disableBonus('bac')}
                        onClick={() => editBonus('bac')}
                    />
                )}
                {mentionBonusEnabled && (
                    <Chip 
                        label={`Bonus Mention: ${selectedMention.replace('_', ' ')} (+${mentionBonus})`}
                        color="primary"
                        sx={{ bgcolor: primaryColor }}
                        onDelete={() => disableBonus('mention')}
                        onClick={() => editBonus('mention')}
                    />
                )}
            </Box>

            {/* Sélection du type de bonus à ajouter */}
            {!activeBonus && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                        Ajouter un nouveau bonus :
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button 
                                variant="outlined"
                                onClick={() => setActiveBonus('bac')}
                                disabled={bacBonusEnabled}
                                sx={{ 
                                    borderColor: primaryColor,
                                    color: primaryColor,
                                    '&:hover': {
                                        borderColor: primaryColor,
                                        backgroundColor: `${primaryColor}10`,
                                    }
                                }}
                            >
                                Bonus Année Bac
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="outlined"
                                onClick={() => setActiveBonus('mention')}
                                disabled={mentionBonusEnabled}
                                sx={{ 
                                    borderColor: primaryColor,
                                    color: primaryColor,
                                    '&:hover': {
                                        borderColor: primaryColor,
                                        backgroundColor: `${primaryColor}10`,
                                    }
                                }}
                            >
                                Bonus Mention
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
            
            {/* Formulaire pour le bonus basé sur l'année du bac */}
            {activeBonus === 'bac' && (
                <Box sx={{ mb: 3, p: 2, border: `1px solid ${backgroundColor}`, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        Configuration du bonus Année Bac
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: primaryColor }}>Comparaison</InputLabel>
                                <Select
                                    value={bacComparison}
                                    onChange={(e) => setBacComparison(e.target.value)}
                                    label="Comparaison"
                                    sx={{
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: primaryColor,
                                        },
                                    }}
                                >
                                    <MenuItem value="<">Avant</MenuItem>
                                    <MenuItem value=">">Après</MenuItem>
                                    <MenuItem value="==">Égal à</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="Année"
                                type="number"
                                value={bacYear}
                                onChange={(e) => setBacYear(e.target.value)}
                                placeholder="Ex: 2021"
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: primaryColor,
                                        },
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Bonus"
                                type="number"
                                value={bacBonus}
                                onChange={(e) => setBacBonus(e.target.value)}
                                placeholder="Ex: 2"
                                inputProps={{ step: "0.5" }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: primaryColor,
                                        },
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setActiveBonus('')}
                            sx={{ 
                                borderColor: accentColor,
                                color: accentColor,
                                '&:hover': {
                                    borderColor: accentColor,
                                    backgroundColor: `${accentColor}10`,
                                }
                            }}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="contained"
                            onClick={applyBacBonus}
                            disabled={!bacYear || !bacBonus}
                            sx={{ 
                                borderRadius: 30,
                                textTransform: "none",
                                padding: "8px 16px",
                                transition: "all 0.3s ease",
                                fontWeight: 600,
                                background: `linear-gradient(45deg, ${primaryColor} 30%, ${primaryColor}CC 90%)`,
                                "&:hover": {
                                    background: `linear-gradient(45deg, ${primaryColor}CC 30%, ${primaryColor} 90%)`,
                                    transform: "translateY(-3px)",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                },
                            }}
                        >
                            Appliquer
                        </Button>
                    </Box>
                </Box>
            )}
            
            {/* Formulaire pour le bonus basé sur la mention */}
            {activeBonus === 'mention' && (
                <Box sx={{ mb: 3, p: 2, border: `1px solid ${backgroundColor}`, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        Configuration du bonus Mention
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={8}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: primaryColor }}>Mention</InputLabel>
                                <Select
                                    value={selectedMention}
                                    onChange={(e) => setSelectedMention(e.target.value)}
                                    label="Mention"
                                    sx={{
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: primaryColor,
                                        },
                                    }}
                                >
                                    <MenuItem value="passable">Passable (10-12)</MenuItem>
                                    <MenuItem value="assez_bien">Assez Bien (12-14)</MenuItem>
                                    <MenuItem value="bien">Bien (14-16)</MenuItem>
                                    <MenuItem value="tres_bien">Très Bien (16+)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Bonus"
                                type="number"
                                value={mentionBonus}
                                onChange={(e) => setMentionBonus(e.target.value)}
                                placeholder="Ex: 1"
                                inputProps={{ step: "0.5" }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: primaryColor,
                                        },
                                    },
                                    '& .MuiFormLabel-root.Mui-focused': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setActiveBonus('')}
                            sx={{ 
                                borderColor: accentColor,
                                color: accentColor,
                                '&:hover': {
                                    borderColor: accentColor,
                                    backgroundColor: `${accentColor}10`,
                                }
                            }}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="contained"
                            onClick={applyMentionBonus}
                            disabled={!selectedMention || !mentionBonus}
                            sx={{ 
                                borderRadius: 30,
                                textTransform: "none",
                                padding: "8px 16px",
                                transition: "all 0.3s ease",
                                fontWeight: 600,
                                background: `linear-gradient(45deg, ${primaryColor} 30%, ${primaryColor}CC 90%)`,
                                "&:hover": {
                                    background: `linear-gradient(45deg, ${primaryColor}CC 30%, ${primaryColor} 90%)`,
                                    transform: "translateY(-3px)",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                },
                            }}
                        >
                            Appliquer
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Afficher la formule combinée */}
            {(bacBonusEnabled || mentionBonusEnabled) && (
                <Box sx={{ mt: 2, p: 2, bgcolor: backgroundColor, borderRadius: 2, mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: secondaryColor }}>
                        Formule appliquée :
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
                        {extraFormula}
                    </Typography>
                </Box>
            )}

            <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="flex-end" 
                mb={2}
                sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: `1px solid ${backgroundColor}`
                }}
            >
                <Typography 
                    variant="subtitle1" 
                    sx={{ 
                        mr: 1,
                        color: secondaryColor,
                        fontWeight: 500
                    }}
                >
                    Trier par Note de dossier
                </Typography>
                
                <Switch
                    checked={sortByAverage}
                    onChange={(e) => setSortByAverage(e.target.checked)}
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                            color: primaryColor,
                            '&:hover': {
                                backgroundColor: `${primaryColor}1A`,
                            },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: primaryColor,
                        },
                    }}
                />
            </Box>
        </Paper>
    );
};

export default CandidatureActions;
