import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/common/Layout';
import { useLanguage } from './context/LanguageContext';

import HomePage from './pages/HomePage';
import HealthcarePage from './pages/HealthcarePage';
import EmergencyPage from './pages/EmergencyPage';
import DisasterPage from './pages/DisasterPage';
import MelaSurakshaPage from './pages/MelaSurakshaPage';
import VolunteersPage from './pages/VolunteersPage';
import AiSaarthiPage from './pages/AiSaarthiPage';
import CommandCentrePage from './pages/CommandCentrePage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';

function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="container-page py-16 text-center">
      <h1 className="page-title">{t('notfound.title')}</h1>
      <p className="mt-2 text-ink-soft">{t('notfound.body')}</p>
      <Link to="/" className="btn-primary mt-6">{t('notfound.cta')}</Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="healthcare" element={<HealthcarePage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="disaster" element={<DisasterPage />} />
        <Route path="mela" element={<MelaSurakshaPage />} />
        <Route path="volunteers" element={<VolunteersPage />} />
        <Route path="ai-saarthi" element={<AiSaarthiPage />} />
        <Route path="command-centre" element={<CommandCentrePage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
