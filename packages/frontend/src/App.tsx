import { AppBridge } from '@jtl-software/cloud-apps-core';
import './App.css';
import { AnalyticsPage, ErpPage, GraphqlDemoPage, HubPage, PanePage, SetupPage, WelcomePage } from './pages';
import { useEffect } from 'react';

type AppMode = 'setup' | 'erp' | 'pane' | 'hub' | 'graphql-demo' | 'analytics';

const App: React.FC<{ appBridge: AppBridge | null }> = ({ appBridge }) => {
  const pathname = location.pathname.substring(1);
  const mode: AppMode = pathname.startsWith('analytics') ? 'analytics' : pathname as AppMode;

  useEffect((): void => {
    if (appBridge) {
      console.log('[HelloWorldApp] bridge created!');
    }
  }, [appBridge]);

  // Hub page runs standalone (no iframe, no AppBridge)
  if (mode === 'hub') {
    return <HubPage />;
  }

  // Analytics page can run in demo mode without AppBridge
  if (mode === 'analytics' && !appBridge) {
    // Create a mock appBridge for demo/testing
    const mockAppBridge = {
      method: {
        call: async <T,>(method: string): Promise<T> => {
          if (method === 'getSessionToken') {
            // Return empty - views will show error but UI will render
            throw new Error('Demo mode - no session token available. Install in JTL Platform for live data.');
          }
          return '' as T;
        },
      },
    } as AppBridge;
    return <AnalyticsPage appBridge={mockAppBridge} />;
  }

  if (!appBridge) {
    return <WelcomePage />;
  }

  switch (mode) {
    case 'setup':
      return <SetupPage appBridge={appBridge} />;
    case 'erp':
      return <ErpPage appBridge={appBridge} />;
    case 'pane':
      return <PanePage appBridge={appBridge} />;
    case 'graphql-demo':
      return <GraphqlDemoPage appBridge={appBridge} />;
    case 'analytics':
      return <AnalyticsPage appBridge={appBridge} />;
    default:
      return <WelcomePage connected />;
  }
};

export default App;
