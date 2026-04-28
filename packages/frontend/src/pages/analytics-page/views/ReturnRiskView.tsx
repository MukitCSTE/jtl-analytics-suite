import { useCallback, useEffect, useState } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Text,
  Stack,
  Box,
  Button,
  Badge,
} from '@jtl-software/platform-ui-react';
import { RotateCcw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { gql } from 'graphql-request';
import { StatCard, DataTable } from '../components/shared';
import { executeQuery } from '../utils/graphqlClient';

interface ReturnRiskViewProps {
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

interface ReturnData {
  QuerySalesOrders: {
    totalCount: number;
    nodes: SalesOrder[];
  };
}

interface ReturnRiskAnalysis extends SalesOrder {
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
}

const RETURN_QUERY = gql`
  query ReturnRiskAnalysis {
    QuerySalesOrders(first: 100, order: [{ salesOrderDate: DESC }]) {
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

function analyzeReturnRisk(order: SalesOrder, allOrders: SalesOrder[]): ReturnRiskAnalysis {
  const riskFactors: string[] = [];
  let riskScore = 0;

  // High value orders have higher return risk
  if (order.totalGrossAmount > 500) {
    riskFactors.push('High value order (>500 EUR)');
    riskScore += 25;
  } else if (order.totalGrossAmount > 200) {
    riskFactors.push('Medium value (>200 EUR)');
    riskScore += 10;
  }

  // Check if customer has multiple orders (experienced vs new)
  const customerOrders = allOrders.filter(
    o => o.customerNumber === order.customerNumber || o.companyName === order.companyName,
  );
  if (customerOrders.length === 1) {
    riskFactors.push('First-time customer');
    riskScore += 25;
  }

  // Weekend orders have slightly higher return rates
  const orderDate = new Date(order.salesOrderDate);
  const dayOfWeek = orderDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    riskFactors.push('Weekend order');
    riskScore += 15;
  }

  // Late night orders
  const hour = orderDate.getHours();
  if (hour >= 22 || hour < 6) {
    riskFactors.push('Late night order');
    riskScore += 10;
  }

  // Very recent order (impulse buy risk) - use demo data reference date
  const now = new Date('2018-07-24');
  const daysSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceOrder < 3) {
    riskFactors.push('Recent order (<3 days)');
    riskScore += 15;
  }

  // Cap at 100
  riskScore = Math.min(100, riskScore);

  const riskLevel: 'high' | 'medium' | 'low' = riskScore >= 50 ? 'high' : riskScore >= 25 ? 'medium' : 'low';

  return {
    ...order,
    riskScore,
    riskLevel,
    riskFactors,
  };
}

const ReturnRiskView: React.FC<ReturnRiskViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<ReturnRiskAnalysis[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery<ReturnData>(appBridge, RETURN_QUERY);
      const orders = result.QuerySalesOrders.nodes;
      const analyzed = orders.map(order => analyzeReturnRisk(order, orders));
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
  const avgRiskScore = analyses.length > 0 ? analyses.reduce((sum, a) => sum + a.riskScore, 0) / analyses.length : 0;

  const columns = [
    { key: 'salesOrderNumber' as const, header: 'Order #' },
    { key: 'salesOrderDate' as const, header: 'Date' },
    { key: 'companyName' as const, header: 'Customer' },
    {
      key: 'totalGrossAmount' as const,
      header: 'Amount',
      align: 'right' as const,
      render: (value: unknown, row: ReturnRiskAnalysis) =>
        `${(value as number).toLocaleString('de-DE', { minimumFractionDigits: 2 })} ${row.currencyIso}`,
    },
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
      key: 'riskScore' as const,
      header: 'Score',
      align: 'center' as const,
      render: (value: unknown) => {
        const score = value as number;
        const color = score >= 50 ? '#dc2626' : score >= 25 ? '#ea580c' : '#16a34a';
        return <span style={{ fontWeight: 600, color }}>{score}%</span>;
      },
    },
    {
      key: 'riskFactors' as const,
      header: 'Risk Factors',
      render: (value: unknown) => {
        const factors = value as string[];
        if (!factors.length) return '-';
        return (
          <div className="flex flex-wrap gap-1">
            {factors.slice(0, 2).map((factor, i) => (
              <Badge key={i} variant="outline" label={factor} />
            ))}
            {factors.length > 2 && <Badge variant="outline" label={`+${factors.length - 2}`} />}
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
            Return Risk Predictor
          </Text>
          <Text type="small" color="muted">
            Anticipate returns before they happen. Predictive analytics that saves you time and money.
          </Text>
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline" label={loading ? 'Analyzing...' : 'Refresh'} />
      </div>

      {/* Value Proposition */}
      <div className="p-4 rounded-lg border-l-4" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.1) 0%, transparent 100%)', borderColor: '#8b5cf6' }}>
        <div style={{ color: '#8b5cf6', fontWeight: 600, fontSize: '0.875rem' }}>
          Reduce costly returns proactively
        </div>
        <Text type="small" color="muted">
          Every return costs you shipping, restocking, and often a lost customer. Our algorithm analyzes order patterns - first-time buyers, high-value items, weekend orders, and more - to predict which orders are most likely to come back. Reach out to high-risk orders proactively with better support or confirmation.
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
        <StatCard title="High Risk" value={highRisk.length} subtitle="likely returns" icon={XCircle} color="#dc2626" />
        <StatCard title="Medium Risk" value={mediumRisk.length} subtitle="monitor closely" icon={AlertTriangle} color="#ea580c" />
        <StatCard title="Low Risk" value={lowRisk.length} subtitle="likely to keep" icon={CheckCircle} color="#16a34a" />
        <StatCard title="Avg Risk Score" value={`${avgRiskScore.toFixed(0)}%`} subtitle="across all orders" icon={RotateCcw} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders by Return Risk</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={analyses} emptyMessage="No orders to analyze" />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ReturnRiskView;
