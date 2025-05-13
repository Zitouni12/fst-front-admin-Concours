import ProfilePage from './pages/Profile/ProfilePage';
import SecuritePage from './pages/Securite/SecuritePage';
import StagePage from './pages/Stage/StagePage';

import AchatsPage from './pages/Achats/AchatsPage';

import ExamPlaningPage from './pages/ExamPlaning/ExamPlaningPage';
import RhPage from './pages/Rh/RhPage';
import ConcoursPage from './pages/Concours/ConcoursPage';
import Charte_graphiquePage from './pages/Charte_Graphique/charte'

import DashboardLayoutBasic from './components/DashboardLayoutBasic'

//Routes Concours 
import CreationFormulaire from './pages/Concours/CreationFormulaire';
import GestionConcours from './pages/Concours/GestionConcours';
import GestionCandidatures from './pages/Concours/GestionCandidatures';

import { Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
    <Route path="/" element={<DashboardLayoutBasic />}>
      <Route path="profile" element={<ProfilePage />} />
      <Route path="securite" element={<SecuritePage />} />
      <Route path="stage" element={<StagePage />} />
      <Route path="achats" element={<AchatsPage />} />
      <Route path="examplaning" element={<ExamPlaningPage />} />
      <Route path="rh" element={<RhPage />} />
      
      <Route path="charte_graphique" element={<Charte_graphiquePage />} />

     
  
      <Route path="Concours/Gestionconcours" element={<GestionConcours />} />
      <Route path="Concours/Gestioncandidatures" element={<GestionCandidatures />} />
      <Route path="Concours/CreationFormulaire" element={<CreationFormulaire />} />

    </Route>
  </Routes>
  )
}

export default App;
