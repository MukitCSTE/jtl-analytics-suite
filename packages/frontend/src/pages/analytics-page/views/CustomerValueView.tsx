import { useCallback, useEffect, useState } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import { Card, CardHeader, CardTitle, CardContent, Text, Stack, Box, Button, Badge } from '@jtl-software/platform-ui-react';
import { Users, Crown, Star, User, TrendingUp } from 'lucide-react';
import { gql } from 'graphql-request';
import { StatCard, DataTable } from '../components/shared';
import { SimpleDonutChart, SimpleBarChart, ProgressBar } from '../components/SimpleChart';
import { executeQuery } from '../utils/graphqlClient';

interface CustomerValueViewProps {
  appBridge: AppBridge;
}

interface SalesOrder {
  customerNumber: string;
  companyName: string;
  totalGrossAmount: number;
  salesOrderDate: string;
}

interface CustomerData {
  QuerySalesOrders: {
    totalCount: number;
    nodes: SalesOrder[];
  };
}

interface CustomerAnalysis {
  customerNumber: string;
  companyName: string;
  totalSpend: number;
  orderCount: number;
  avgOrderValue: number;
  firstOrderDate: string;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  tier: 'vip' | 'regular' | 'new';
  clvScore: number;
}

const CUSTOMER_QUERY = gql`
  query CustomerAnalysis {
    QuerySalesOrders(first: 500, order: [{ salesOrderDate: DESC }]) {
      totalCount
      nodes {
        customerNumber
        companyName
        totalGrossAmount
        salesOrderDate
      }
    }
  }
`;

function analyzeCustomers(orders: SalesOrder[]): CustomerAnalysis[] {
  const customerMap = new Map<string, SalesOrder[]>();

  orders.forEach(order => {
    const key = order.customerNumber || order.companyName;
    if (!customerMap.has(key)) {
      customerMap.set(key, []);
    }
    customerMap.get(key)!.push(order);
  });

  const analyses: CustomerAnalysis[] = [];
  // Use demo data reference date (July 2018)
  const now = new Date('2018-07-24');

  customerMap.forEach((customerOrders, key) => {
    const totalSpend = customerOrders.reduce((sum, o) => sum + o.totalGrossAmount, 0);
    const orderCount = customerOrders.length;
    const avgOrderValue = totalSpend / orderCount;

    const dates = customerOrders.map(o => new Date(o.salesOrderDate)).sort((a, b) => a.getTime() - b.getTime());
    const firstOrderDate = dates[0].toISOString();
    const lastOrderDate = dates[dates.length - 1].toISOString();
    const daysSinceLastOrder = Math.floor((now.getTime() - dates[dates.length - 1].getTime()) / (1000 * 60 * 60 * 24));

    // RFM-based CLV score calculation
    const recencyScore = Math.max(0, 100 - daysSinceLastOrder / 30);
    const frequencyScore = Math.min(100, orderCount * 15);
    const monetaryScore = Math.min(100, totalSpend / 50);
    const clvScore = Math.round((recencyScore + frequencyScore + monetaryScore) / 3);

    let tier: 'vip' | 'regular' | 'new';
    if (clvScore >= 60 && totalSpend >= 500) {
      tier = 'vip';
    } else if (orderCount >= 2 || totalSpend >= 200) {
      tier = 'regular';
    } else {
      tier = 'new';
    }

    analyses.push({
      customerNumber: key,
      companyName: customerOrders[0].companyName || key,
      totalSpend,
      orderCount,
      avgOrderValue,
      firstOrderDate,
      lastOrderDate,
      daysSinceLastOrder,
      tier,
      clvScore,
    });
  });

  analyses.sort((a, b) => b.clvScore - a.clvScore);
  return analyses;
}

const CustomerValueView: React.FC<CustomerValueViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<CustomerAnalysis[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery<CustomerData>(appBridge, CUSTOMER_QUERY);
      const analyzed = analyzeCustomers(result.QuerySalesOrders.nodes);
      setAnalyses(analyzed);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [appBridge]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const vipCustomers = analyses.filter(a => a.tier === 'vip');
  const regularCustomers = analyses.filter(a => a.tier === 'regular');
  const newCustomers = analyses.filter(a => a.tier === 'new');
  const totalRevenue = analyses.reduce((sum, a) => sum + a.totalSpend, 0);
  const avgCLV = analyses.length > 0 ? Math.round(analyses.reduce((sum, a) => sum + a.clvScore, 0) / analyses.length) : 0;

  // Customer tier distribution for donut
  const tierDistribution = [
    { label: 'VIP', value: vipCustomers.length, color: '#eab308' },
    { label: 'Regular', value: regularCustomers.length, color: '#3b82f6' },
    { label: 'New', value: newCustomers.length, color: '#94a3b8' },
  ];

  // Revenue by tier for bar chart
  const revenueByTier = [
    { label: 'VIP', value: Math.round(vipCustomers.reduce((s, c) => s + c.totalSpend, 0)), color: '#eab308' },
    { label: 'Regular', value: Math.round(regularCustomers.reduce((s, c) => s + c.totalSpend, 0)), color: '#3b82f6' },
    { label: 'New', value: Math.round(newCustomers.reduce((s, c) => s + c.totalSpend, 0)), color: '#94a3b8' },
  ];

  // Top customers by spend
  const topCustomers = analyses.slice(0, 5);

  const columns = [
    {
      key: 'tier' as const,
      header: 'Tier',
      align: 'center' as const,
      render: (value: unknown) => {
        const tier = value as string;
        const variant = tier === 'vip' ? 'warning' : tier === 'regular' ? 'outline' : 'secondary';
        const Icon = tier === 'vip' ? Crown : tier === 'regular' ? Star : User;
        return (
          <div className="flex items-center justify-center gap-1">
            <Icon size={14} />
            <Badge variant={variant} label={tier.toUpperCase()} />
          </div>
        );
      },
    },
    {
      key: 'companyName' as const,
      header: 'Customer',
      render: (value: unknown) => {
        const name = value as string;
        return name.length > 25 ? name.substring(0, 25) + '...' : name;
      },
    },
    { key: 'orderCount' as const, header: 'Orders', align: 'center' as const },
    {
      key: 'totalSpend' as const,
      header: 'Total Spend',
      align: 'right' as const,
      render: (value: unknown) => `${(value as number).toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR`,
    },
    {
      key: 'avgOrderValue' as const,
      header: 'Avg Order',
      align: 'right' as const,
      render: (value: unknown) => `${(value as number).toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR`,
    },
    {
      key: 'daysSinceLastOrder' as const,
      header: 'Last Order',
      align: 'center' as const,
      render: (value: unknown) => {
        const days = value as number;
        const color = days < 30 ? '#22c55e' : days < 90 ? '#f59e0b' : '#ef4444';
        return <span style={{ color, fontWeight: 500 }}>{days} days ago</span>;
      },
    },
    {
      key: 'clvScore' as const,
      header: 'CLV Score',
      align: 'center' as const,
      render: (value: unknown) => {
        const score = value as number;
        const color = score >= 60 ? '#22c55e' : score >= 30 ? '#f59e0b' : '#94a3b8';
        return (
          <div
            className="inline-flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: `${color}20`, color }}
          >
            <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{score}</span>
          </div>
        );
      },
    },
  ];

  return (
    <Stack spacing="6" direction="column">
      <div className="flex items-center justify-between">
        <div>
          <Text type="h2" weight="bold">
            Customer Lifetime Value
          </Text>
          <Text type="small" color="muted">
            Know your best customers. RFM analysis that reveals who drives your business and who needs attention.
          </Text>
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline" label={loading ? 'Loading...' : 'Refresh'} />
      </div>

      {/* Value Proposition */}
      <div className="p-4 rounded-lg border-l-4" style={{ background: 'linear-gradient(90deg, rgba(234,179,8,0.1) 0%, transparent 100%)', borderColor: '#eab308' }}>
        <div style={{ color: '#eab308', fontWeight: 600, fontSize: '0.875rem' }}>
          Focus on customers that matter most
        </div>
        <Text type="small" color="muted">
          Not all customers are equal. Our RFM (Recency, Frequency, Monetary) analysis scores each customer based on how recently they bought, how often they buy, and how much they spend. Identify your VIPs for special treatment, spot at-risk customers before they churn, and find new customers worth nurturing.
        </Text>
      </div>

      {error && (
        <Box className="p-4 rounded-lg bg-red-50 border border-red-200">
          <Text type="small" color="danger">
            {error}
          </Text>
        </Box>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="VIP Customers" value={vipCustomers.length} subtitle="high-value" icon={Crown} color="#eab308" />
        <StatCard title="Regular" value={regularCustomers.length} subtitle="returning" icon={Star} color="#3b82f6" />
        <StatCard title="New" value={newCustomers.length} subtitle="first-time" icon={User} color="#94a3b8" />
        <StatCard title="Avg CLV Score" value={avgCLV} subtitle="out of 100" icon={TrendingUp} color="#8b5cf6" />
        <StatCard
          title="Total Revenue"
          value={`${(totalRevenue / 1000).toFixed(1)}K`}
          subtitle="EUR"
          icon={Users}
          color="#22c55e"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDonutChart data={tierDistribution} size={140} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={revenueByTier} height={160} showValues />
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Customers by CLV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {topCustomers.map((customer, i) => (
              <ProgressBar
                key={i}
                label={customer.companyName.length > 20 ? customer.companyName.substring(0, 20) + '...' : customer.companyName}
                value={customer.clvScore}
                max={100}
                color={['#eab308', '#3b82f6', '#8b5cf6', '#ec4899', '#22c55e'][i]}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Customers */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={analyses} emptyMessage="No customers found" />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CustomerValueView;
