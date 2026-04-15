import { useState } from 'react';
import { Text } from '@jtl-software/platform-ui-react';
import {
  LayoutDashboard,
  AlertTriangle,
  Package,
  Users,
  Truck,
  RotateCcw,
  Calendar,
  ShoppingBag,
  BarChart3,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export type AnalyticsView =
  | 'dashboard'
  | 'fraud'
  | 'reorder'
  | 'clv'
  | 'shipping'
  | 'returns'
  | 'heatmap'
  | 'bundles'
  | 'ai'
  | 'faq';

interface SidebarProps {
  activeView: AnalyticsView;
  onNavigate: (view: AnalyticsView) => void;
}

const menuItems: { id: AnalyticsView; label: string; icon: React.FC<{ size?: number; className?: string }>; isNew?: boolean }[] = [
  { id: 'ai', label: 'AI Assistant', icon: Sparkles, isNew: true },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'fraud', label: 'Fraud Detector', icon: AlertTriangle },
  { id: 'reorder', label: 'Reorder Alerts', icon: Package },
  { id: 'clv', label: 'Customer Value', icon: Users },
  { id: 'shipping', label: 'Fulfillment', icon: Truck },
  { id: 'returns', label: 'Return Risk', icon: RotateCcw },
  { id: 'heatmap', label: 'Sales Heatmap', icon: Calendar },
  { id: 'bundles', label: 'Product Analysis', icon: ShoppingBag },
  { id: 'faq', label: 'FAQ & Setup', icon: HelpCircle },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const [hoveredItem, setHoveredItem] = useState<AnalyticsView | null>(null);

  return (
    <div
      className="h-full border-r flex flex-col"
      style={{
        width: '260px',
        minWidth: '260px',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        borderColor: '#334155',
      }}
    >
      {/* Header */}
      <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: '#334155' }}>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
        >
          <BarChart3 size={22} color="white" />
        </div>
        <div>
          <Text type="small" weight="bold" style={{ color: '#ffffff' }}>
            Analytics Suite
          </Text>
          <Text type="xs" style={{ color: '#ffffff' }}>
            JTL Cloud
          </Text>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200"
              style={{
                background: isActive
                  ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                  : isHovered
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'transparent',
                color: isActive ? '#ffffff' : isHovered ? '#ffffff' : '#94a3b8',
                transform: isHovered && !isActive ? 'translateX(4px)' : 'translateX(0)',
                boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
              }}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon size={20} className="shrink-0" />
              <Text type="small" weight={isActive ? 'semibold' : 'regular'} style={{ color: 'inherit' }}>
                {item.label}
              </Text>
              {item.isNew && (
                <span
                  className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    color: 'white',
                    fontSize: '0.65rem',
                  }}
                >
                  NEW
                </span>
              )}
              {isActive && !item.isNew && (
                <div
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{ background: '#ffffff', boxShadow: '0 0 8px rgba(255,255,255,0.6)' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: '#334155' }}>
        <div className="p-3 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <Text type="xs" style={{ color: '#60a5fa' }}>
            Pro Tip
          </Text>
          <Text type="xs" style={{ color: '#94a3b8', marginTop: '4px' }}>
            Use the heatmap to find your best selling times.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
