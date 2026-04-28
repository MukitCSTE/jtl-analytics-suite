import { useCallback, useEffect, useState } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import { Card, CardHeader, CardTitle, CardContent, Text, Stack, Box, Button, Badge } from '@jtl-software/platform-ui-react';
import { Package, AlertCircle, CheckCircle, XCircle, TrendingDown, ShoppingCart } from 'lucide-react';
import { gql } from 'graphql-request';
import { StatCard, DataTable } from '../components/shared';
import { SimpleDonutChart, ProgressBar } from '../components/SimpleChart';
import { executeQuery } from '../utils/graphqlClient';

interface ReorderAlertsViewProps {
  appBridge: AppBridge;
}

interface Item {
  id: string;
  sku: string;
  name: string | null;
  stockTotal: number;
  stockAvailable: number;
  stockInOrders: number;
  stockIncoming: number;
  minimumStock: number;
  hasMinimumStock: boolean;
  salesPriceGross: number;
  isActive: boolean;
  lastPurchaseDate: string | null;
  defaultSupplier: string | null;
}

interface StockData {
  QueryItems: {
    totalCount: number;
    nodes: Item[];
  };
}

interface StockAnalysis extends Item {
  status: 'critical' | 'low' | 'ok' | 'overstock';
  stockCoverage: number;
  reorderQuantity: number;
  stockValue: number;
}

const STOCK_QUERY = gql`
  query StockAnalysis {
    QueryItems(first: 200, order: [{ stockAvailable: ASC }]) {
      totalCount
      nodes {
        id
        sku
        name
        stockTotal
        stockAvailable
        stockInOrders
        stockIncoming
        minimumStock
        hasMinimumStock
        salesPriceGross
        isActive
        lastPurchaseDate
        defaultSupplier
      }
    }
  }
`;

function analyzeStock(item: Item): StockAnalysis {
  // Calculate daily velocity based on orders
  const dailyVelocity = item.stockInOrders > 0 ? item.stockInOrders / 14 : 0.5;
  const stockCoverage = item.stockAvailable > 0 ? Math.floor(item.stockAvailable / dailyVelocity) : 0;
  const stockValue = item.stockAvailable * item.salesPriceGross;

  let status: 'critical' | 'low' | 'ok' | 'overstock';
  let reorderQuantity = 0;

  // Use minimumStock if defined, otherwise use velocity-based calculation
  const effectiveMinStock = item.hasMinimumStock ? item.minimumStock : dailyVelocity * 14;

  if (item.stockAvailable <= 0) {
    status = 'critical';
    reorderQuantity = Math.max(effectiveMinStock * 2, item.stockInOrders);
  } else if (item.stockAvailable < effectiveMinStock) {
    status = 'critical';
    reorderQuantity = effectiveMinStock - item.stockAvailable + item.stockInOrders;
  } else if (stockCoverage < 14) {
    status = 'low';
    reorderQuantity = Math.ceil(dailyVelocity * 30 - item.stockAvailable);
  } else if (stockCoverage > 90) {
    status = 'overstock';
    reorderQuantity = 0;
  } else {
    status = 'ok';
    reorderQuantity = 0;
  }

  return {
    ...item,
    status,
    stockCoverage,
    reorderQuantity: Math.max(0, Math.ceil(reorderQuantity)),
    stockValue,
  };
}

const ReorderAlertsView: React.FC<ReorderAlertsViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<StockAnalysis[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery<StockData>(appBridge, STOCK_QUERY);
      const activeItems = result.QueryItems.nodes.filter(i => i.isActive);
      const analyzed = activeItems.map(analyzeStock);
      analyzed.sort((a, b) => {
        const statusOrder = { critical: 0, low: 1, ok: 2, overstock: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
      setAnalyses(analyzed);
      setTotalItems(result.QueryItems.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [appBridge]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const critical = analyses.filter(a => a.status === 'critical');
  const low = analyses.filter(a => a.status === 'low');
  const ok = analyses.filter(a => a.status === 'ok');
  const overstock = analyses.filter(a => a.status === 'overstock');

  const totalStockValue = analyses.reduce((sum, a) => sum + a.stockValue, 0);
  const totalReorderValue = critical.concat(low).reduce((sum, a) => sum + (a.reorderQuantity * a.salesPriceGross), 0);

  // Status distribution
  const statusDistribution = [
    { label: 'Critical', value: critical.length, color: '#dc2626' },
    { label: 'Low', value: low.length, color: '#f59e0b' },
    { label: 'OK', value: ok.length, color: '#22c55e' },
    { label: 'Overstock', value: overstock.length, color: '#3b82f6' },
  ];

  const columns = [
    {
      key: 'status' as const,
      header: 'Status',
      align: 'center' as const,
      render: (value: unknown) => {
        const status = value as string;
        const variants: Record<string, 'destructive' | 'warning' | 'success' | 'outline'> = {
          critical: 'destructive',
          low: 'warning',
          ok: 'success',
          overstock: 'outline',
        };
        return <Badge variant={variants[status]} label={status.toUpperCase()} />;
      },
    },
    { key: 'sku' as const, header: 'SKU' },
    {
      key: 'name' as const,
      header: 'Product',
      render: (value: unknown) => {
        const name = (value as string) || '-';
        return name.length > 35 ? `${name.substring(0, 35)}...` : name;
      },
    },
    {
      key: 'stockAvailable' as const,
      header: 'Available',
      align: 'center' as const,
      render: (value: unknown, row: StockAnalysis) => {
        const available = value as number;
        const color = row.status === 'critical' ? '#dc2626' : row.status === 'low' ? '#f59e0b' : '#22c55e';
        return <span style={{ fontWeight: 600, color }}>{available}</span>;
      },
    },
    {
      key: 'stockInOrders' as const,
      header: 'In Orders',
      align: 'center' as const,
    },
    {
      key: 'stockIncoming' as const,
      header: 'Incoming',
      align: 'center' as const,
      render: (value: unknown) => {
        const incoming = value as number;
        if (incoming > 0) {
          return <Badge variant="success" label={`+${incoming}`} />;
        }
        return '-';
      },
    },
    {
      key: 'minimumStock' as const,
      header: 'Min Stock',
      align: 'center' as const,
      render: (value: unknown, row: StockAnalysis) => {
        if (!row.hasMinimumStock) return <Text type="xs" color="muted">Not set</Text>;
        return value as number;
      },
    },
    {
      key: 'stockCoverage' as const,
      header: 'Days Coverage',
      align: 'center' as const,
      render: (value: unknown) => {
        const days = value as number;
        const color = days < 7 ? '#dc2626' : days < 14 ? '#f59e0b' : '#22c55e';
        return <span style={{ color, fontWeight: 500 }}>~{days} days</span>;
      },
    },
    {
      key: 'reorderQuantity' as const,
      header: 'Reorder Qty',
      align: 'center' as const,
      render: (value: unknown) => {
        const qty = value as number;
        if (qty === 0) return '-';
        return <Badge variant="outline" label={`Order ${qty}`} />;
      },
    },
    {
      key: 'defaultSupplier' as const,
      header: 'Supplier',
      render: (value: unknown) => {
        const supplier = value as string;
        if (!supplier) return <Text type="xs" color="muted">Not set</Text>;
        return supplier.length > 15 ? supplier.substring(0, 15) + '...' : supplier;
      },
    },
  ];

  return (
    <Stack spacing="6" direction="column">
      <div className="flex items-center justify-between">
        <div>
          <Text type="h2" weight="bold">
            Stock Alerts
          </Text>
          <Text type="small" color="muted">
            Never run out of stock again. Smart inventory monitoring that tells you exactly what to order and when.
          </Text>
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline" label={loading ? 'Loading...' : 'Refresh'} />
      </div>

      {/* Value Proposition */}
      <div className="p-4 rounded-lg border-l-4" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.1) 0%, transparent 100%)', borderColor: '#f97316' }}>
        <Text type="small" weight="semibold" style={{ color: '#f97316' }}>
          Stop losing sales to stockouts
        </Text>
        <Text type="small" color="muted">
          Out-of-stock products mean lost revenue and frustrated customers who may never return. We analyze your sales velocity, current stock levels, and incoming orders to calculate exactly how many days of coverage you have. Get alerts before you run out, with precise reorder quantities for each supplier.
        </Text>
      </div>

      {error && (
        <Box className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <Text type="small" weight="semibold" style={{ color: '#ca8a04' }}>
            No inventory data available
          </Text>
          <Text type="small" color="muted" className="mt-1">
            This tenant doesn't have product/inventory data yet. Add items to your catalog to see reorder alerts. Error: {error}
          </Text>
        </Box>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Critical" value={critical.length} subtitle="out of stock" icon={XCircle} color="#dc2626" />
        <StatCard title="Low Stock" value={low.length} subtitle="reorder soon" icon={AlertCircle} color="#f59e0b" />
        <StatCard title="Healthy" value={ok.length} subtitle="stock OK" icon={CheckCircle} color="#22c55e" />
        <StatCard title="Overstock" value={overstock.length} subtitle="excess inventory" icon={TrendingDown} color="#3b82f6" />
        <StatCard
          title="Stock Value"
          value={`${(totalStockValue / 1000).toFixed(1)}K`}
          subtitle="EUR total"
          icon={Package}
          color="#8b5cf6"
        />
        <StatCard
          title="Reorder Value"
          value={`${(totalReorderValue / 1000).toFixed(1)}K`}
          subtitle="EUR needed"
          icon={ShoppingCart}
          color="#ec4899"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Stock Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDonutChart data={statusDistribution} size={140} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Reorder Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {critical.concat(low).slice(0, 5).map((item, i) => (
                <ProgressBar
                  key={item.id}
                  label={item.name?.substring(0, 20) || item.sku}
                  value={item.stockAvailable}
                  max={item.minimumStock > 0 ? item.minimumStock * 2 : 20}
                  color={item.status === 'critical' ? '#dc2626' : '#f59e0b'}
                />
              ))}
              {critical.length + low.length === 0 && (
                <Text type="small" color="muted">All stock levels are healthy</Text>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Items Alert */}
      {critical.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle size={20} className="text-red-500" />
              <CardTitle>Critical - Immediate Reorder Required</CardTitle>
              <Badge variant="destructive" label={`${critical.length} items`} />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={critical}
              emptyMessage="No critical items"
              showDateFilter={false}
              pageSize={10}
            />
          </CardContent>
        </Card>
      )}

      {/* All Items */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({totalItems} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={analyses}
            emptyMessage="No products found"
            showDateFilter={false}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ReorderAlertsView;
