import React from 'react';
import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const SuccessAlert = ({ message, details, onClose, autoHideDuration = 5000 }) => {
    React.useEffect(() => {
        if (autoHideDuration > 0) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, autoHideDuration);
            
            return () => clearTimeout(timer);
        }
    }, [autoHideDuration, onClose]);

    return (
        <Alert 
            severity="success" 
            onClose={onClose}
            icon={<CheckCircle />}
            sx={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 9999,
                minWidth: 350,
                maxWidth: 500,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                borderRadius: 3,
                border: '1px solid #4caf50',
                backgroundColor: '#f8fff8',
                '& .MuiAlert-icon': {
                    color: '#2e7d32',
                    fontSize: '1.5rem'
                },
                '& .MuiAlert-message': {
                    padding: 0
                }
            }}
        >
            <AlertTitle sx={{ 
                color: '#2e7d32', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                mb: 1
            }}>
                Configuration appliquée avec succès !
            </AlertTitle>
            <Typography variant="body2" sx={{ color: '#1b5e20' }}>
                {message}
            </Typography>
            {details && (
                <Typography variant="caption" sx={{ color: '#388e3c', mt: 0.5, display: 'block' }}>
                    {details}
                </Typography>
            )}
        </Alert>
    );
};

export default SuccessAlert;
