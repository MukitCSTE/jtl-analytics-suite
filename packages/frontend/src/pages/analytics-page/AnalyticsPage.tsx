import { useState, useEffect } from 'react';
import IAnalyticsPageProps from './IAnalyticsPageProps';
import { Box } from '@jtl-software/platform-ui-react';
import Sidebar, { AnalyticsView } from './components/Sidebar';
import DashboardView from './views/DashboardView';
import FraudDetectorView from './views/FraudDetectorView';
import ReorderAlertsView from './views/ReorderAlertsView';
import CustomerValueView from './views/CustomerValueView';
import ShippingView from './views/ShippingView';
import ReturnRiskView from './views/ReturnRiskView';
import SalesHeatmapView from './views/SalesHeatmapView';
import ProductBundlerView from './views/ProductBundlerView';

function getInitialView(): AnalyticsView {
  const path = location.pathname;
  if (path.includes('/analytics/fraud')) return 'fraud';
  if (path.includes('/analytics/reorder')) return 'reorder';
  if (path.includes('/analytics/clv')) return 'clv';
  if (path.includes('/analytics/shipping')) return 'shipping';
  if (path.includes('/analytics/returns')) return 'returns';
  if (path.includes('/analytics/heatmap')) return 'heatmap';
  if (path.includes('/analytics/bundles')) return 'bundles';
  return 'dashboard';
}

const AnalyticsPage: React.FC<IAnalyticsPageProps> = ({ appBridge }) => {
  const [activeView, setActiveView] = useState<AnalyticsView>(getInitialView);

  useEffect(() => {
    // Update URL when view changes (without full navigation)
    const newPath = activeView === 'dashboard' ? '/analytics' : `/analytics/${activeView}`;
    if (location.pathname !== newPath) {
      history.pushState(null, '', newPath);
    }
  }, [activeView]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView appBridge={appBridge} />;
      case 'fraud':
        return <FraudDetectorView appBridge={appBridge} />;
      case 'reorder':
        return <ReorderAlertsView appBridge={appBridge} />;
      case 'clv':
        return <CustomerValueView appBridge={appBridge} />;
      case 'shipping':
        return <ShippingView appBridge={appBridge} />;
      case 'returns':
        return <ReturnRiskView appBridge={appBridge} />;
      case 'heatmap':
        return <SalesHeatmapView appBridge={appBridge} />;
      case 'bundles':
        return <ProductBundlerView appBridge={appBridge} />;
      default:
        return <DashboardView appBridge={appBridge} />;
    }
  };

  return (
    <div className="flex h-screen" style={{ background: 'var(--base-background)' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <Box className="flex-1 overflow-auto p-6">{renderView()}</Box>
    </div>
  );
};

export default AnalyticsPage;
