import React from 'react';
import { Link } from 'react-router-dom';  // Pour gérer les routes
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

export const NAVIGATION = [
  {
    segment: 'Profile',
    title: 'Profile',
    icon: <AccountCircleIcon />,
    path: '/profile',  
  },
  {
    segment: 'Securite',
    title: 'Securite',
    icon: <AdminPanelSettingsIcon />,
    path: '/securite', 
  },
  {
    segment: 'ExamPlaning',
    title: 'Exam & Planing',
    icon: <AccessTimeIcon />,
    path: '/examplaning', 
  },
  {
    segment: 'Stage',
    title: 'Stage',
    icon: <WorkIcon />,
    path: '/stage', 
  },



  // Les autres éléments de navigation ici...
  {
    segment: 'Concours',
    title: 'Concours',
    icon: <AssignmentIcon />,
    children: [
      {
        segment: 'CreationFormulaire',
        title: 'Création Formulaire',
        icon: <DescriptionIcon />,
        path: 'Concours/CreationFormulaire',
      },
      {
        segment: 'GestionConcours',
        title: 'Gestion Concours',
        icon: <DescriptionIcon />,
        path: '/Concours/Gestionconcours',
      },
      {
        segment: 'GestionCandidatures',
        title: 'Gestion Candidatures',
        icon: <DescriptionIcon />,
        path: '/Concours/Gestioncandidatures',
      },
    ],
  },
  

  {
    segment: 'Achats',
    title: 'Achats',
    icon: <ShoppingBasketIcon />,
    path: '/achats', 
  },
  {
    segment: 'RH',
    title: 'RH',
    icon: <PeopleIcon />,
    children: [
      {
        segment: 'Personel',
        title: 'Personnel',
        icon: <AccountCircleIcon />,
        path: '/rh/personnel',  
      },
      {
        segment: 'Conges et Absences',
        title: 'Conges et Absences',
        icon: <CalendarMonthIcon />,
        path: '/rh/conges',  
      },
      {
        segment: 'Taches et Missions',
        title: 'Taches et Missions',
        icon: <HomeRepairServiceIcon />,
        path: '/rh/taches',  
      },
      {
        segment: 'Rapports',
        title: 'Rapports',
        icon: <DescriptionIcon />,
        path: '/rh/rapports',  
      },
    ],
  },
  {
    segment: 'charte_graphique',
    title: 'Charte Graphique',
    icon: <AssignmentIcon />,
    path: '/charte_graphique', 
  },


];

export default function Navigation() {
  return (
    <List>
    {NAVIGATION.map((item) => (
      <div key={item.segment}>
        {item.path ? (
          <ListItem button component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ) : (
          <ListItem>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        )}
  
        {item.children && (
          <List>
            {item.children.map((child) => (
              <ListItem button component={Link} to={child.path} key={child.segment}>
                <ListItemIcon>{child.icon}</ListItemIcon>
                <ListItemText primary={child.title} />
              </ListItem>
            ))}
          </List>
        )}
      </div>
    ))}
  </List>
  
  );
}
