import { useCallback, useEffect, useState } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import { Card, CardHeader, CardTitle, CardContent, Text, Stack, Box, Button, Badge } from '@jtl-software/platform-ui-react';
import { Truck, Clock, AlertTriangle, Package, MapPin, CheckCircle } from 'lucide-react';
import { gql } from 'graphql-request';
import { StatCard, DataTable } from '../components/shared';
import { SimpleDonutChart, SimpleBarChart } from '../components/SimpleChart';
import { executeQuery } from '../utils/graphqlClient';

interface ShippingViewProps {
  appBridge: AppBridge;
}

interface SalesOrder {
  salesOrderNumber: string;
  salesOrderDate: string;
  totalGrossAmount: number;
  currencyIso: string;
  companyName: string;
  customerNumber: string;
  // Shipping details
  shipmentAddressCity: string | null;
  shipmentAddressCountryIso: string | null;
  shipmentAddressCountryName: string | null;
  shipmentAddressPostalCode: string | null;
  // Status
  deliveryStatus: string;
  deliveryCompleteStatus: string;
  shippingMethodName: string | null;
  shippingPriority: number;
  estimatedDeliveryDate: string | null;
  lastShippingDate: string | null;
  isPending: boolean;
  isCancelled: boolean;
}

interface ShippingData {
  QuerySalesOrders: {
    totalCount: number;
    nodes: SalesOrder[];
  };
}

const SHIPPING_QUERY = gql`
  query ShippingAnalysis {
    QuerySalesOrders(first: 200, order: [{ salesOrderDate: DESC }]) {
      totalCount
      nodes {
        salesOrderNumber
        salesOrderDate
        totalGrossAmount
        currencyIso
        companyName
        customerNumber
        shipmentAddressCity
        shipmentAddressCountryIso
        shipmentAddressCountryName
        shipmentAddressPostalCode
        deliveryStatus
        deliveryCompleteStatus
        shippingMethodName
        shippingPriority
        estimatedDeliveryDate
        lastShippingDate
        isPending
        isCancelled
      }
    }
  }
`;

const ShippingView: React.FC<ShippingViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery<ShippingData>(appBridge, SHIPPING_QUERY);
      // Filter out cancelled orders
      setOrders(result.QuerySalesOrders.nodes.filter(o => !o.isCancelled));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [appBridge]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate metrics
  const pendingOrders = orders.filter(o => o.isPending);
  const shippedOrders = orders.filter(o => o.lastShippingDate);
  const notShippedOrders = orders.filter(o => !o.lastShippingDate && !o.isPending);

  // Country distribution
  const countryMap = new Map<string, { count: number; value: number }>();
  orders.forEach(o => {
    const country = o.shipmentAddressCountryIso || 'Unknown';
    const current = countryMap.get(country) || { count: 0, value: 0 };
    countryMap.set(country, { count: current.count + 1, value: current.value + o.totalGrossAmount });
  });
  const countryData = Array.from(countryMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([country, data], i) => ({
      label: country,
      value: data.count,
      color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][i],
    }));

  // Shipping method distribution
  const methodMap = new Map<string, number>();
  orders.forEach(o => {
    const method = o.shippingMethodName || 'Not specified';
    methodMap.set(method, (methodMap.get(method) || 0) + 1);
  });
  const methodData = Array.from(methodMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([method, count], i) => ({
      label: method.length > 15 ? method.substring(0, 15) + '...' : method,
      value: count,
      color: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'][i],
    }));

  // Delivery status distribution
  const statusDistribution = [
    { label: 'Shipped', value: shippedOrders.length, color: '#22c55e' },
    { label: 'Pending', value: pendingOrders.length, color: '#f59e0b' },
    { label: 'Not Shipped', value: notShippedOrders.length, color: '#3b82f6' },
  ];

  const columns = [
    {
      key: 'deliveryStatus',
      header: 'Status',
      align: 'center' as const,
      render: (_: unknown, row: SalesOrder) => {
        if (row.lastShippingDate) {
          return <Badge variant="success" label="SHIPPED" />;
        } else if (row.isPending) {
          return <Badge variant="warning" label="PENDING" />;
        }
        return <Badge variant="outline" label="AWAITING" />;
      },
    },
    {
      key: 'salesOrderNumber',
      header: 'Order #',
    },
    {
      key: 'salesOrderDate',
      header: 'Order Date',
      sortable: true,
    },
    {
      key: 'companyName',
      header: 'Customer',
      render: (value: unknown) => {
        const name = value as string;
        return name && name.length > 20 ? name.substring(0, 20) + '...' : name || '-';
      },
    },
    {
      key: 'shipmentAddressCity',
      header: 'Destination',
      render: (_: unknown, row: SalesOrder) => (
        <div className="flex items-center gap-1">
          <MapPin size={14} className="text-gray-400" />
          <span>{row.shipmentAddressCity || '-'}, {row.shipmentAddressCountryIso || '-'}</span>
        </div>
      ),
    },
    {
      key: 'shippingMethodName',
      header: 'Shipping Method',
      render: (value: unknown) => (value as string) || '-',
    },
    {
      key: 'shippingPriority',
      header: 'Priority',
      align: 'center' as const,
      render: (value: unknown) => {
        const priority = value as number;
        if (priority >= 5) return <Badge variant="destructive" label="HIGH" />;
        if (priority >= 3) return <Badge variant="warning" label="MEDIUM" />;
        return <Badge variant="outline" label="NORMAL" />;
      },
    },
    {
      key: 'totalGrossAmount',
      header: 'Value',
      align: 'right' as const,
      render: (value: unknown, row: SalesOrder) =>
        `${(value as number).toLocaleString('de-DE', { minimumFractionDigits: 2 })} ${row.currencyIso}`,
    },
    {
      key: 'lastShippingDate',
      header: 'Shipped On',
      render: (value: unknown) => {
        if (!value) return <Text type="xs" color="muted">Not yet</Text>;
        return new Date(value as string).toLocaleDateString('de-DE');
      },
    },
  ];

  return (
    <Stack spacing="6" direction="column">
      <div className="flex items-center justify-between">
        <div>
          <Text type="h2" weight="bold">
            Shipping & Fulfillment
          </Text>
          <Text type="small" color="muted">
            Complete visibility into your fulfillment pipeline. Track every shipment from order to delivery.
          </Text>
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline" label={loading ? 'Loading...' : 'Refresh'} />
      </div>

      {/* Value Proposition */}
      <div className="p-4 rounded-lg border-l-4" style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.1) 0%, transparent 100%)', borderColor: '#3b82f6' }}>
        <Text type="small" weight="semibold" style={{ color: '#3b82f6' }}>
          Deliver faster, delight customers
        </Text>
        <Text type="small" color="muted">
          Shipping delays kill customer satisfaction and trigger support tickets. See which orders are pending, which are shipped, and where your customers are located. Identify bottlenecks in your fulfillment process, prioritize high-value shipments, and ensure every order gets out the door on time.
        </Text>
      </div>

      {error && (
        <Box className="p-4 rounded-lg bg-red-50 border border-red-200">
          <Text type="small" color="danger">
            {error}
          </Text>
        </Box>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Orders" value={orders.length} subtitle="in system" icon={Package} />
        <StatCard title="Shipped" value={shippedOrders.length} subtitle="delivered" icon={CheckCircle} color="#22c55e" />
        <StatCard title="Pending" value={pendingOrders.length} subtitle="on hold" icon={Clock} color="#f59e0b" />
        <StatCard title="Awaiting Ship" value={notShippedOrders.length} subtitle="to process" icon={Truck} color="#3b82f6" />
        <StatCard title="Countries" value={countryMap.size} subtitle="destinations" icon={MapPin} color="#8b5cf6" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDonutChart data={statusDistribution} size={130} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={countryData} height={150} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={methodData} height={150} />
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders Alert */}
      {pendingOrders.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-500" />
              <CardTitle>Pending Orders - Requires Attention</CardTitle>
              <Badge variant="warning" label={`${pendingOrders.length} orders`} />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={pendingOrders}
              emptyMessage="No pending orders"
              showDateFilter={false}
              pageSize={5}
            />
          </CardContent>
        </Card>
      )}

      {/* All Orders */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={orders}
            emptyMessage="No orders found"
            dateField="salesOrderDate"
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ShippingView;
