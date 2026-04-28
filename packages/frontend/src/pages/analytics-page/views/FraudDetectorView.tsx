import { useCallback, useEffect, useState } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import { Card, CardHeader, CardTitle, CardContent, Text, Stack, Box, Button, Badge } from '@jtl-software/platform-ui-react';
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, MapPin, HelpCircle, X, CheckCircle2, ArrowRight } from 'lucide-react';
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

// Query is now built dynamically in fetchData with date filter

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

// Helper to format date for GraphQL
const formatDateForQuery = (date: Date): string => {
  return date.toISOString().split('T')[0] + 'T00:00:00Z';
};

// Helper to format date for display
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const FraudDetectorView: React.FC<FraudDetectorViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<FraudAnalysis[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // Date filter state - default to last 30 days
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return formatDateForInput(date);
  });
  const [endDate, setEndDate] = useState<string>(() => formatDateForInput(new Date()));

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query with date filter
      const startDateTime = formatDateForQuery(new Date(startDate));
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      const endDateTimeStr = endDateTime.toISOString();

      const queryWithDateFilter = `
        query FraudAnalysis {
          QuerySalesOrders(
            first: 200,
            order: [{ salesOrderDate: DESC }],
            where: {
              and: [
                { salesOrderDate: { gte: "${startDateTime}" } },
                { salesOrderDate: { lte: "${endDateTimeStr}" } }
              ]
            }
          ) {
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

      const result = await executeQuery<FraudData>(appBridge, queryWithDateFilter);
      const orders = result.QuerySalesOrders.nodes;
      const analyzed = orders.map(order => analyzeFraud(order, orders));
      analyzed.sort((a, b) => b.riskScore - a.riskScore);
      setAnalyses(analyzed);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [appBridge, startDate, endDate]);

  // Fetch on mount and when dates change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Quick date presets
  const setDatePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
  };

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)' }}
          >
            <ShieldAlert size={24} color="white" />
          </div>
          <div>
            <Text type="h2" weight="bold">
              Fraud Detector
            </Text>
            <Text type="small" color="muted">
              AI-powered risk analysis to protect your business
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Presets */}
          <div className="flex gap-1">
            <button
              onClick={() => setDatePreset(7)}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
            >
              7d
            </button>
            <button
              onClick={() => setDatePreset(30)}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
            >
              30d
            </button>
            <button
              onClick={() => setDatePreset(90)}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
            >
              90d
            </button>
          </div>
          {/* Date Filter */}
          <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-none outline-none text-sm bg-transparent"
              style={{ colorScheme: 'light' }}
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-none outline-none text-sm bg-transparent"
              style={{ colorScheme: 'light' }}
            />
          </div>
          <Button
            onClick={() => setShowHelp(!showHelp)}
            variant="outline"
            label="How It Works"
            icon={<HelpCircle size={16} />}
          />
          <Button onClick={fetchData} disabled={loading} variant="outline" label={loading ? 'Analyzing...' : 'Refresh'} />
        </div>
      </div>

      {/* How It Works Panel */}
      {showHelp && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-blue-500" />
                <CardTitle>How Fraud Detection Works</CardTitle>
              </div>
              <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Workflow Steps */}
              <div className="flex flex-wrap gap-4 items-center justify-center p-4 rounded-lg" style={{ background: '#f8fafc' }}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <Text type="xs" weight="semibold">Fetch Orders</Text>
                  <Text type="xs" color="muted">Load recent orders</Text>
                </div>
                <ArrowRight size={20} className="text-gray-300" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <Text type="xs" weight="semibold">Analyze Risks</Text>
                  <Text type="xs" color="muted">Check fraud signals</Text>
                </div>
                <ArrowRight size={20} className="text-gray-300" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-bold">3</span>
                  </div>
                  <Text type="xs" weight="semibold">Score & Flag</Text>
                  <Text type="xs" color="muted">Calculate risk score</Text>
                </div>
                <ArrowRight size={20} className="text-gray-300" />
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 font-bold">4</span>
                  </div>
                  <Text type="xs" weight="semibold">Review</Text>
                  <Text type="xs" color="muted">Take action</Text>
                </div>
              </div>

              {/* Risk Factors Explained */}
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <Text type="small" weight="bold">
                    Risk Factors We Check:
                  </Text>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 p-3 rounded-lg border" style={{ borderColor: '#fee2e2', background: '#fef2f2' }}>
                    <CheckCircle2 size={16} className="text-red-500 mt-0.5" />
                    <div>
                      <Text type="xs" weight="semibold">Address Mismatch (+35 pts)</Text>
                      <Text type="xs" color="muted">Billing country differs from shipping country - strongest fraud signal</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg border" style={{ borderColor: '#fef3c7', background: '#fffbeb' }}>
                    <CheckCircle2 size={16} className="text-orange-500 mt-0.5" />
                    <div>
                      <Text type="xs" weight="semibold">High Value Orders (+25 pts)</Text>
                      <Text type="xs" color="muted">Orders over 500 EUR are higher risk targets</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg border" style={{ borderColor: '#dbeafe', background: '#eff6ff' }}>
                    <CheckCircle2 size={16} className="text-blue-500 mt-0.5" />
                    <div>
                      <Text type="xs" weight="semibold">First-Time Customer (+15 pts)</Text>
                      <Text type="xs" color="muted">New customers with no order history</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg border" style={{ borderColor: '#e9d5ff', background: '#faf5ff' }}>
                    <CheckCircle2 size={16} className="text-purple-500 mt-0.5" />
                    <div>
                      <Text type="xs" weight="semibold">Unusual Timing (+12 pts)</Text>
                      <Text type="xs" color="muted">Late night (00:00-06:00) or weekend orders</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg border" style={{ borderColor: '#d1fae5', background: '#ecfdf5' }}>
                    <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                    <div>
                      <Text type="xs" weight="semibold">International Shipping (+10 pts)</Text>
                      <Text type="xs" color="muted">Shipping outside Germany</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg border" style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}>
                    <CheckCircle2 size={16} className="text-gray-500 mt-0.5" />
                    <div>
                      <Text type="xs" weight="semibold">Above Average (+15 pts)</Text>
                      <Text type="xs" color="muted">Order value 2x higher than your average</Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Levels */}
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" label="HIGH" />
                  <Text type="xs" color="muted">Score 45+</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning" label="MEDIUM" />
                  <Text type="xs" color="muted">Score 25-44</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" label="LOW" />
                  <Text type="xs" color="muted">Score 0-24</Text>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Value Proposition */}
      <div className="p-4 rounded-lg border-l-4" style={{ background: 'linear-gradient(90deg, rgba(220,38,38,0.1) 0%, transparent 100%)', borderColor: '#dc2626' }}>
        <span style={{ color: '#dc2626' }}>
          <Text type="small" weight="semibold">
            Protect your revenue
          </Text>
        </span>
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
