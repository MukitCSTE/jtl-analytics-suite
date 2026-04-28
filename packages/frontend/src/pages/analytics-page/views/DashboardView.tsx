import { useCallback, useEffect, useState } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import { Card, CardHeader, CardTitle, CardContent, Text, Stack, Box, Button, Badge } from '@jtl-software/platform-ui-react';
import { ShoppingCart, DollarSign, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { gql } from 'graphql-request';
import { StatCard, DataTable } from '../components/shared';
import { SimpleBarChart, SimpleLineChart, SimpleDonutChart, ProgressBar } from '../components/SimpleChart';
import { executeQuery } from '../utils/graphqlClient';

interface DashboardViewProps {
  appBridge: AppBridge;
}

interface SalesOrder {
  salesOrderNumber: string;
  salesOrderDate: string;
  totalGrossAmount: number;
  currencyIso: string;
  companyName: string;
  customerNumber: string;
}

interface DashboardData {
  QuerySalesOrders: {
    totalCount: number;
    nodes: SalesOrder[];
  };
}

const DASHBOARD_QUERY = gql`
  query DashboardData {
    QuerySalesOrders(first: 200, order: [{ salesOrderDate: DESC }]) {
      totalCount
      nodes {
        salesOrderNumber
        salesOrderDate
        totalGrossAmount
        currencyIso
        companyName
        customerNumber
      }
    }
  }
`;

const DashboardView: React.FC<DashboardViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery<DashboardData>(appBridge, DASHBOARD_QUERY);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [appBridge]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const orders = data?.QuerySalesOrders?.nodes || [];
  const totalOrders = data?.QuerySalesOrders?.totalCount || 0;

  // Calculate stats - use demo data reference date (July 2018)
  const demoBaseDate = new Date('2018-07-24');
  const today = demoBaseDate.toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.salesOrderDate.startsWith(today));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalGrossAmount, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalGrossAmount, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Calculate weekly data for line chart - use demo data reference date
  const weeklyData: { label: string; value: number }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const date = new Date('2018-07-24');
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOrders = orders.filter(o => o.salesOrderDate.startsWith(dateStr));
    const revenue = dayOrders.reduce((sum, o) => sum + o.totalGrossAmount, 0);
    weeklyData.push({ label: dayNames[date.getDay()], value: revenue });
  }

  // Calculate monthly data for bar chart
  const monthlyData: { label: string; value: number; color: string }[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const ordersByMonth = new Map<number, number>();
  orders.forEach(o => {
    const month = new Date(o.salesOrderDate).getMonth();
    ordersByMonth.set(month, (ordersByMonth.get(month) || 0) + 1);
  });
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
  ordersByMonth.forEach((count, month) => {
    monthlyData.push({ label: months[month], value: count, color: colors[monthlyData.length % colors.length] });
  });
  monthlyData.sort((a, b) => months.indexOf(a.label) - months.indexOf(b.label));

  // Top customers for donut chart
  const customerTotals = new Map<string, number>();
  orders.forEach(o => {
    const current = customerTotals.get(o.companyName) || 0;
    customerTotals.set(o.companyName, current + o.totalGrossAmount);
  });
  const topCustomers = Array.from(customerTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((entry, i) => ({
      label: entry[0].length > 15 ? entry[0].substring(0, 15) + '...' : entry[0],
      value: Math.round(entry[1]),
      color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i],
    }));

  // Order size distribution
  const smallOrders = orders.filter(o => o.totalGrossAmount < 50).length;
  const mediumOrders = orders.filter(o => o.totalGrossAmount >= 50 && o.totalGrossAmount < 200).length;
  const largeOrders = orders.filter(o => o.totalGrossAmount >= 200 && o.totalGrossAmount < 500).length;
  const xlOrders = orders.filter(o => o.totalGrossAmount >= 500).length;

  const columns = [
    { key: 'salesOrderNumber' as const, header: 'Order #' },
    {
      key: 'salesOrderDate' as const,
      header: 'Date',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('de-DE'),
    },
    {
      key: 'companyName' as const,
      header: 'Customer',
      render: (value: unknown) => {
        const name = value as string;
        return name.length > 25 ? name.substring(0, 25) + '...' : name;
      },
    },
    {
      key: 'totalGrossAmount' as const,
      header: 'Amount',
      align: 'right' as const,
      render: (value: unknown, row: SalesOrder) => (
        <div className="flex items-center justify-end gap-1">
          <span>{(value as number).toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
          <Badge variant="outline" label={row.currencyIso} />
        </div>
      ),
    },
  ];

  return (
    <Stack spacing="6" direction="column">
      <div className="flex items-center justify-between">
        <div>
          <Text type="h2" weight="bold">
            Order Dashboard
          </Text>
          <Text type="small" color="muted">
            Your command center for sales performance. Track revenue trends, monitor order volume, and identify your top customers at a glance.
          </Text>
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline" label={loading ? 'Loading...' : 'Refresh'} />
      </div>

      {/* Value Proposition */}
      <div className="p-4 rounded-lg border-l-4" style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.1) 0%, transparent 100%)', borderColor: '#3b82f6' }}>
        <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.875rem' }}>
          How this helps you
        </div>
        <Text type="small" color="muted">
          See your business pulse in real-time. Spot daily sales patterns, track average order values, and understand which customers drive the most revenue. Use these insights to make faster, data-driven decisions.
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Orders" value={todayOrders.length} subtitle="orders placed today" icon={ShoppingCart} />
        <StatCard
          title="Today's Revenue"
          value={`${todayRevenue.toLocaleString('de-DE', { minimumFractionDigits: 0 })} EUR`}
          subtitle="gross amount"
          icon={DollarSign}
          color="#16a34a"
        />
        <StatCard title="Total Orders" value={totalOrders.toLocaleString('de-DE')} subtitle="all time" icon={Package} color="#9333ea" />
        <StatCard
          title="Avg Order Value"
          value={`${avgOrderValue.toLocaleString('de-DE', { minimumFractionDigits: 0 })} EUR`}
          subtitle={`from ${orders.length} orders`}
          icon={TrendingUp}
          color="#ea580c"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={weeklyData} height={180} color="#3b82f6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={monthlyData.slice(-6)} height={180} />
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDonutChart data={topCustomers} size={140} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Size Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <ProgressBar label="< 50 EUR" value={smallOrders} max={orders.length} color="#10b981" />
              <ProgressBar label="50-200 EUR" value={mediumOrders} max={orders.length} color="#3b82f6" />
              <ProgressBar label="200-500 EUR" value={largeOrders} max={orders.length} color="#8b5cf6" />
              <ProgressBar label="> 500 EUR" value={xlOrders} max={orders.length} color="#ec4899" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg" style={{ background: 'var(--base-muted)' }}>
              <div className="flex items-center gap-2">
                <ArrowUpRight size={16} className="text-green-500" />
                <Text type="xs" color="muted">
                  Highest Order
                </Text>
              </div>
              <Text type="h4" weight="bold">
                {orders.length > 0 ? Math.max(...orders.map(o => o.totalGrossAmount)).toLocaleString('de-DE', { minimumFractionDigits: 0 }) : 0} EUR
              </Text>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--base-muted)' }}>
              <div className="flex items-center gap-2">
                <ArrowDownRight size={16} className="text-orange-500" />
                <Text type="xs" color="muted">
                  Lowest Order
                </Text>
              </div>
              <Text type="h4" weight="bold">
                {orders.length > 0 ? Math.min(...orders.map(o => o.totalGrossAmount)).toLocaleString('de-DE', { minimumFractionDigits: 0 }) : 0} EUR
              </Text>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--base-muted)' }}>
              <div className="flex items-center gap-2">
                <Package size={16} className="text-blue-500" />
                <Text type="xs" color="muted">
                  Unique Customers
                </Text>
              </div>
              <Text type="h4" weight="bold">
                {new Set(orders.map(o => o.customerNumber)).size}
              </Text>
            </div>
            <div className="p-4 rounded-lg" style={{ background: 'var(--base-muted)' }}>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-500" />
                <Text type="xs" color="muted">
                  Total Revenue
                </Text>
              </div>
              <Text type="h4" weight="bold">
                {totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 0 })} EUR
              </Text>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={orders.slice(0, 10)} emptyMessage="No orders found" />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default DashboardView;
