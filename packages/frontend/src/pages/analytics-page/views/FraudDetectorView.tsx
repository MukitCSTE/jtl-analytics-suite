import { useCallback, useEffect, useState } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import { Card, CardHeader, CardTitle, CardContent, Text, Stack, Box, Button, Badge } from '@jtl-software/platform-ui-react';
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, MapPin } from 'lucide-react';
import { gql } from 'graphql-request';
import { StatCard, DataTable } from '../components/shared';
import { SimpleDonutChart, ProgressBar } from '../components/SimpleChart';
import { executeQuery } from '../utils/graphqlClient';

interface FraudDetectorViewProps {
  appBridge: AppBridge;
}

interface SalesOrder {
  salesOrderNumber: string;
  salesOrderDate: string;
  totalGrossAmount: number;
  currencyIso: string;
  companyName: string;
  customerNumber: string;
  // Billing Address
  billingAddressCity: string | null;
  billingAddressCountryIso: string | null;
  billingAddressCountryName: string | null;
  // Shipping Address
  shipmentAddressCity: string | null;
  shipmentAddressCountryIso: string | null;
  shipmentAddressCountryName: string | null;
  // Status
  isPending: boolean;
  isCancelled: boolean;
  paymentStatus: string;
}

interface FraudData {
  QuerySalesOrders: {
    totalCount: number;
    nodes: SalesOrder[];
  };
}

interface FraudAnalysis extends SalesOrder {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
}

const FRAUD_QUERY = gql`
  query FraudAnalysis {
    QuerySalesOrders(first: 100, order: [{ salesOrderDate: DESC }]) {
      totalCount
      nodes {
        salesOrderNumber
        salesOrderDate
        totalGrossAmount
        currencyIso
        companyName
        customerNumber
        billingAddressCity
        billingAddressCountryIso
        billingAddressCountryName
        shipmentAddressCity
        shipmentAddressCountryIso
        shipmentAddressCountryName
        isPending
        isCancelled
        paymentStatus
      }
    }
  }
`;

function analyzeFraud(order: SalesOrder, allOrders: SalesOrder[]): FraudAnalysis {
  const flags: string[] = [];
  let riskScore = 0;

  // High order value
  if (order.totalGrossAmount > 500) {
    flags.push('High value (>500 EUR)');
    riskScore += 25;
  } else if (order.totalGrossAmount > 200) {
    flags.push('Medium value (>200 EUR)');
    riskScore += 12;
  }

  // ADDRESS MISMATCH - Real fraud signal!
  if (order.billingAddressCountryIso && order.shipmentAddressCountryIso) {
    if (order.billingAddressCountryIso !== order.shipmentAddressCountryIso) {
      flags.push(`Country mismatch: ${order.billingAddressCountryIso} → ${order.shipmentAddressCountryIso}`);
      riskScore += 35;
    } else if (order.billingAddressCity && order.shipmentAddressCity &&
               order.billingAddressCity !== order.shipmentAddressCity) {
      flags.push(`City mismatch: ${order.billingAddressCity} → ${order.shipmentAddressCity}`);
      riskScore += 20;
    }
  }

  // First-time customer
  const customerOrders = allOrders.filter(
    o => o.customerNumber === order.customerNumber || o.companyName === order.companyName
  );
  if (customerOrders.length === 1) {
    flags.push('First-time customer');
    riskScore += 15;
  }

  // Weekend order
  const orderDate = new Date(order.salesOrderDate);
  const dayOfWeek = orderDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    flags.push('Weekend order');
    riskScore += 8;
  }

  // Late night order
  const hour = orderDate.getHours();
  if (hour >= 0 && hour < 6) {
    flags.push('Late night (00:00-06:00)');
    riskScore += 12;
  }

  // International shipping
  if (order.shipmentAddressCountryIso && order.shipmentAddressCountryIso !== 'DE') {
    flags.push(`International: ${order.shipmentAddressCountryIso}`);
    riskScore += 10;
  }

  // Unusual amount (2x above average)
  const amounts = allOrders.map(o => o.totalGrossAmount);
  const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  if (order.totalGrossAmount > avgAmount * 2) {
    flags.push('2x above average');
    riskScore += 15;
  }

  const riskLevel: 'low' | 'medium' | 'high' = riskScore >= 45 ? 'high' : riskScore >= 25 ? 'medium' : 'low';

  return {
    ...order,
    riskScore: Math.min(100, riskScore),
    riskLevel,
    flags,
  };
}

const FraudDetectorView: React.FC<FraudDetectorViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<FraudAnalysis[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery<FraudData>(appBridge, FRAUD_QUERY);
      const orders = result.QuerySalesOrders.nodes;
      const analyzed = orders.map(order => analyzeFraud(order, orders));
      analyzed.sort((a, b) => b.riskScore - a.riskScore);
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

  const highRisk = analyses.filter(a => a.riskLevel === 'high');
  const mediumRisk = analyses.filter(a => a.riskLevel === 'medium');
  const lowRisk = analyses.filter(a => a.riskLevel === 'low');
  const addressMismatches = analyses.filter(a =>
    a.flags.some(f => f.includes('mismatch'))
  );

  // Risk distribution for donut
  const riskDistribution = [
    { label: 'High Risk', value: highRisk.length, color: '#dc2626' },
    { label: 'Medium Risk', value: mediumRisk.length, color: '#f59e0b' },
    { label: 'Low Risk', value: lowRisk.length, color: '#22c55e' },
  ];

  // Flag frequency
  const flagCounts = new Map<string, number>();
  analyses.forEach(a => {
    a.flags.forEach(flag => {
      // Simplify flag names for counting
      const simpleName = flag.includes('mismatch') ? 'Address Mismatch' :
                        flag.includes('International') ? 'International Shipping' : flag;
      flagCounts.set(simpleName, (flagCounts.get(simpleName) || 0) + 1);
    });
  });
  const topFlags = Array.from(flagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const columns = [
    {
      key: 'riskLevel' as const,
      header: 'Risk',
      align: 'center' as const,
      render: (value: unknown) => {
        const level = value as string;
        const variant = level === 'high' ? 'destructive' : level === 'medium' ? 'warning' : 'success';
        return <Badge variant={variant} label={level.toUpperCase()} />;
      },
    },
    {
      key: 'salesOrderNumber' as const,
      header: 'Order #',
    },
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
        return name && name.length > 18 ? name.substring(0, 18) + '...' : name || '-';
      },
    },
    {
      key: 'billingAddressCountryIso' as const,
      header: 'Bill → Ship',
      render: (_: unknown, row: FraudAnalysis) => {
        const billing = row.billingAddressCountryIso || '?';
        const shipping = row.shipmentAddressCountryIso || '?';
        const mismatch = billing !== shipping;
        return (
          <span style={{ color: mismatch ? '#dc2626' : 'inherit', fontWeight: mismatch ? 600 : 400 }}>
            {billing} → {shipping}
          </span>
        );
      },
    },
    {
      key: 'totalGrossAmount' as const,
      header: 'Amount',
      align: 'right' as const,
      render: (value: unknown, row: FraudAnalysis) =>
        `${(value as number).toLocaleString('de-DE', { minimumFractionDigits: 2 })} ${row.currencyIso}`,
    },
    {
      key: 'riskScore' as const,
      header: 'Score',
      align: 'center' as const,
      render: (value: unknown) => {
        const score = value as number;
        const color = score >= 45 ? '#dc2626' : score >= 25 ? '#f59e0b' : '#22c55e';
        return <span style={{ fontWeight: 600, color }}>{score}%</span>;
      },
    },
    {
      key: 'flags' as const,
      header: 'Risk Factors',
      render: (value: unknown) => {
        const flags = value as string[];
        if (!flags.length) return <Text type="xs" color="muted">None</Text>;
        return (
          <div className="flex flex-wrap gap-1">
            {flags.slice(0, 2).map((flag, i) => (
              <Badge key={i} variant={flag.includes('mismatch') ? 'destructive' : 'outline'} label={flag.length > 20 ? flag.substring(0, 20) + '...' : flag} />
            ))}
            {flags.length > 2 && <Badge variant="outline" label={`+${flags.length - 2}`} />}
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
            Fraud Detector
          </Text>
          <Text type="small" color="muted">
            AI-powered risk analysis that protects your business from fraudulent orders before they cost you money.
          </Text>
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline" label={loading ? 'Analyzing...' : 'Refresh'} />
      </div>

      {/* Value Proposition */}
      <div className="p-4 rounded-lg border-l-4" style={{ background: 'linear-gradient(90deg, rgba(220,38,38,0.1) 0%, transparent 100%)', borderColor: '#dc2626' }}>
        <Text type="small" weight="semibold" style={{ color: '#dc2626' }}>
          Protect your revenue
        </Text>
        <Text type="small" color="muted">
          Every fraudulent order costs you product, shipping, and chargeback fees. Our system analyzes billing vs. shipping address mismatches, unusual order values, first-time customer patterns, and suspicious timing. Catch fraud before it ships - review flagged orders in seconds.
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
        <StatCard title="High Risk" value={highRisk.length} subtitle="orders flagged" icon={ShieldAlert} color="#dc2626" />
        <StatCard title="Medium Risk" value={mediumRisk.length} subtitle="review needed" icon={Shield} color="#f59e0b" />
        <StatCard title="Low Risk" value={lowRisk.length} subtitle="orders clear" icon={ShieldCheck} color="#22c55e" />
        <StatCard title="Address Mismatch" value={addressMismatches.length} subtitle="billing ≠ shipping" icon={MapPin} color="#8b5cf6" />
        <StatCard title="Total Analyzed" value={analyses.length} subtitle="orders" icon={AlertTriangle} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDonutChart data={riskDistribution} size={140} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {topFlags.map(([flag, count], i) => (
                <ProgressBar
                  key={i}
                  label={flag.length > 18 ? flag.substring(0, 18) + '...' : flag}
                  value={count}
                  max={analyses.length}
                  color={['#dc2626', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'][i]}
                />
              ))}
              {topFlags.length === 0 && (
                <Text type="small" color="muted">No risk factors detected</Text>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Orders */}
      {highRisk.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert size={20} className="text-red-500" />
              <CardTitle>High Risk Orders - Immediate Review Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={highRisk} emptyMessage="No high risk orders" />
          </CardContent>
        </Card>
      )}

      {/* All Orders */}
      <Card>
        <CardHeader>
          <CardTitle>All Analyzed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={analyses} emptyMessage="No orders to analyze" />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default FraudDetectorView;
