import React from 'react';
import { 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  TextField, 
  Button, 
  Box, 
  Switch,
  Paper
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
  setSortByAverage 
}) => {
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
                {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map(field => (
                    <FormControlLabel
                        key={field}
                        control={
                            <Checkbox 
                                checked={selectedFields.includes(field)} 
                                onChange={() => handleFieldChange(field)}
                                sx={{
                                    color: primaryColor,
                                    '&.Mui-checked': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                        }
                        label={field}
                    />
                ))}
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
                Définissez une règle pour ajouter un bonus
            </Typography>
            
            <Typography 
                variant="body2" 
                sx={{ 
                    color: "text.secondary",
                    mb: 2
                }}
            >
                Exemple : Si le bac est avant 2021 et la filière est "Génie électrique", alors ajouter 2 points.
            </Typography>

            <TextField
                fullWidth
                variant="outlined"
                value={extraFormula}
                onChange={(e) => {
                    const value = e.target.value;
                    setExtraFormula(value);
                    // Ne pas valider la formule si elle est vide ou incomplète
                    if (value.trim() === '') return;
                    
                    // Vérifier si la formule est complète (contient au moins une condition et un résultat)
                    const hasCondition = value.includes('?') && value.includes(':');
                    if (!hasCondition) return;
                    
                    try {
                        // Tester la formule avec des valeurs fictives
                        const testValues = {
                            bacYear: 2020,
                            filiere: "Test",
                            S1: 15,
                            S2: 15,
                            S3: 15,
                            S4: 15,
                            S5: 15,
                            S6: 15,
                            average: 15
                        };
                        const testFunc = new Function(...Object.keys(testValues), `return ${value};`);
                        testFunc(...Object.values(testValues));
                    } catch (error) {
                        console.error("Erreur dans la formule :", error);
                        alert("Votre formule contient une erreur. Veuillez la vérifier.");
                    }
                }}
                placeholder="Ex: (bacYear < 2021 && filiere === 'Génie électrique') ? 2 : 0"
                helperText="Utilisez les noms des champs (bacYear, filiere, S1, S2, etc.) et 'average'."
                sx={{ 
                    mt: 1, 
                    mb: 2,
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

            <Button
                variant="outlined"
                onClick={() => setExtraFormula('(bacYear < 2021 && filiere === "Génie électrique") ? 2 : 0')}
                sx={{ 
                    mb: 3,
                    borderRadius: 30,
                    textTransform: "none",
                    padding: "10px 20px",
                    transition: "all 0.3s ease",
                    fontWeight: 600,
                    borderColor: primaryColor,
                    color: primaryColor,
                    borderWidth: 2,
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        borderWidth: 2,
                        borderColor: primaryColor,
                    },
                }}
            >
                Appliquer un exemple
            </Button>

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
                    Trier par Moyenne Calculée
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