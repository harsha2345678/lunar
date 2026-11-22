import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import MachineOverview from './pages/MachineOverview.jsx';
import ImageAnalysis from './pages/ImageAnalysis.jsx';
import BoulderDetection from './pages/BoulderDetection.jsx';
import LanderRisk from './pages/LanderRisk.jsx';
import RoverNavigation from './pages/RoverNavigation.jsx';
import MissionAnalytics from './pages/MissionAnalytics.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MachineOverview />} />
        <Route path="/image-analysis" element={<ImageAnalysis />} />
        <Route path="/boulder-detection" element={<BoulderDetection />} />
        <Route path="/lander-risk" element={<LanderRisk />} />
        <Route path="/rover-navigation" element={<RoverNavigation />} />
        <Route path="/mission-analytics" element={<MissionAnalytics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
