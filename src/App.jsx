import ProfilePage from './pages/Profile/ProfilePage';
import SecuritePage from './pages/Securite/SecuritePage';
import StagePage from './pages/Stage/StagePage';

import AchatsPage from './pages/Achats/AchatsPage';

import ExamPlaningPage from './pages/ExamPlaning/ExamPlaningPage';
import RhPage from './pages/Rh/RhPage';
import ConcoursPage from './pages/Concours/ConcoursPage';

import DashboardLayoutBasic from './components/DashboardLayoutBasic'
import { Route, Routes } from 'react-router-dom';

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
      <Route path="concours" element={<ConcoursPage />} />
    </Route>
  </Routes>
  )
}

export default App;
