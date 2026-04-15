import { useCallback, useEffect, useState } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import { Card, CardHeader, CardTitle, CardContent, Text, Stack, Box, Button, Badge } from '@jtl-software/platform-ui-react';
import { ShoppingBag, Package, TrendingUp, Sparkles } from 'lucide-react';
import { gql } from 'graphql-request';
import { StatCard, DataTable } from '../components/shared';
import { executeQuery } from '../utils/graphqlClient';

interface ProductBundlerViewProps {
  appBridge: AppBridge;
}

interface Item {
  sku: string;
  name: string;
  stockTotal: number;
  stockAvailable: number;
  stockInOrders: number;
}

interface ItemData {
  QueryItems: {
    totalCount: number;
    nodes: Item[];
  };
}

interface ProductAnalysis extends Item {
  demandLevel: 'high' | 'medium' | 'low';
  turnoverRate: number;
  recommendation: string;
}

const ITEMS_QUERY = gql`
  query ProductAnalysis {
    QueryItems(first: 100, order: [{ stockInOrders: DESC }]) {
      totalCount
      nodes {
        sku
        name
        stockTotal
        stockAvailable
        stockInOrders
      }
    }
  }
`;

function analyzeProducts(items: Item[]): ProductAnalysis[] {
  return items.map(item => {
    // Calculate turnover rate (orders / total stock)
    const turnoverRate = item.stockTotal > 0 ? (item.stockInOrders / item.stockTotal) * 100 : 0;

    // Determine demand level
    let demandLevel: 'high' | 'medium' | 'low';
    let recommendation: string;

    if (item.stockInOrders >= 10 || turnoverRate >= 50) {
      demandLevel = 'high';
      recommendation = 'High demand - consider bundling with complementary products';
    } else if (item.stockInOrders >= 3 || turnoverRate >= 20) {
      demandLevel = 'medium';
      recommendation = 'Moderate demand - good bundle candidate';
    } else {
      demandLevel = 'low';
      recommendation = 'Low demand - may need promotion or bundling discount';
    }

    return {
      ...item,
      demandLevel,
      turnoverRate: Math.round(turnoverRate),
      recommendation,
    };
  });
}

const ProductBundlerView: React.FC<ProductBundlerViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductAnalysis[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery<ItemData>(appBridge, ITEMS_QUERY);
      const analyzed = analyzeProducts(result.QueryItems.nodes);
      setProducts(analyzed);
      setTotalCount(result.QueryItems.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [appBridge]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const highDemand = products.filter(p => p.demandLevel === 'high');
  const mediumDemand = products.filter(p => p.demandLevel === 'medium');
  const totalInOrders = products.reduce((sum, p) => sum + p.stockInOrders, 0);

  const columns = [
    { key: 'sku' as const, header: 'SKU' },
    {
      key: 'name' as const,
      header: 'Product Name',
      render: (value: unknown) => {
        const name = value as string;
        return name.length > 40 ? `${name.substring(0, 40)}...` : name;
      },
    },
    {
      key: 'stockInOrders' as const,
      header: 'In Orders',
      align: 'center' as const,
      render: (value: unknown) => <Badge variant={Number(value) >= 5 ? 'success' : 'outline'} label={`${value}`} />,
    },
    {
      key: 'stockAvailable' as const,
      header: 'Available',
      align: 'center' as const,
    },
    {
      key: 'turnoverRate' as const,
      header: 'Turnover',
      align: 'center' as const,
      render: (value: unknown) => {
        const rate = value as number;
        const color = rate >= 50 ? '#16a34a' : rate >= 20 ? '#ea580c' : '#6b7280';
        return <span style={{ fontWeight: 600, color }}>{rate}%</span>;
      },
    },
    {
      key: 'demandLevel' as const,
      header: 'Demand',
      align: 'center' as const,
      render: (value: unknown) => {
        const level = value as string;
        const variant = level === 'high' ? 'success' : level === 'medium' ? 'warning' : 'outline';
        return <Badge variant={variant} label={level.toUpperCase()} />;
      },
    },
  ];

  return (
    <Stack spacing="6" direction="column">
      <div className="flex items-center justify-between">
        <div>
          <Text type="h2" weight="bold">
            Product Analysis
          </Text>
          <Text type="small" color="muted">
            Understand product performance. Find your bestsellers, slow movers, and bundling opportunities.
          </Text>
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline" label={loading ? 'Analyzing...' : 'Refresh'} />
      </div>

      {/* Value Proposition */}
      <div className="p-4 rounded-lg border-l-4" style={{ background: 'linear-gradient(90deg, rgba(236,72,153,0.1) 0%, transparent 100%)', borderColor: '#ec4899' }}>
        <Text type="small" weight="semibold" style={{ color: '#ec4899' }}>
          Maximize every product's potential
        </Text>
        <Text type="small" color="muted">
          Not every product performs equally. See which items fly off the shelves and which need a marketing boost. Identify high-demand products perfect for bundle deals. Spot slow movers before they become dead stock. Use turnover rates to optimize your purchasing decisions and boost profit margins.
        </Text>
      </div>

      {error && (
        <Box className="p-4 rounded-lg bg-red-50 border border-red-200">
          <Text type="small" color="danger">
            {error}
          </Text>
        </Box>
      )}

      <div className="flex flex-wrap gap-4">
        <StatCard title="High Demand" value={highDemand.length} subtitle="bundle candidates" icon={Sparkles} color="#16a34a" />
        <StatCard title="Medium Demand" value={mediumDemand.length} subtitle="products" icon={TrendingUp} color="#ea580c" />
        <StatCard title="Total In Orders" value={totalInOrders} subtitle="units pending" icon={ShoppingBag} />
        <StatCard title="Products" value={totalCount} subtitle="in catalog" icon={Package} />
      </div>

      {highDemand.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>High Demand Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Text type="small" color="muted">
              These products have high order volume - consider creating bundles with complementary items.
            </Text>
            <Box className="mt-4">
              <DataTable columns={columns} data={highDemand} emptyMessage="No high demand products" />
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Products by Demand</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={products} emptyMessage="No products found" />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ProductBundlerView;
