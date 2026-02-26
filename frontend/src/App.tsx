import { useState } from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { PollutionDashboard } from './pages/PollutionDashboard';
import { RainfallDashboard } from './pages/RainfallDashboard';
import { ClimateDashboard } from './pages/ClimateDashboard';
import { MLAnalytics } from './pages/MLAnalytics';

function App() {
  const [activeTab, setActiveTab] = useState('pollution');

  return (
    <PageLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'pollution' && <PollutionDashboard />}
      {activeTab === 'rainfall' && <RainfallDashboard />}
      {activeTab === 'climate' && <ClimateDashboard />}
      {activeTab === 'predictions' && <MLAnalytics />}
    </PageLayout>
  );
}

export default App;
