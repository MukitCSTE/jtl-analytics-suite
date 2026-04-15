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
import { Receipt, Globe, TrendingUp, AlertTriangle, Download, PieChart } from 'lucide-react';
import { gql } from 'graphql-request';
import { StatCard, DataTable } from '../components/shared';
import { SimpleDonutChart, SimpleBarChart } from '../components/SimpleChart';
import { executeQuery } from '../utils/graphqlClient';

interface TaxAnalyticsViewProps {
  appBridge: AppBridge;
}

interface SalesOrder {
  salesOrderNumber: string;
  salesOrderDate: string;
  totalGrossAmount: number;
  totalNetAmount: number;
  currencyIso: string;
  companyName: string;
  billingAddressCountryIso: string;
  billingAddressCountryName: string;
  shipmentAddressCountryIso: string;
  shipmentAddressCountryName: string;
}

interface TaxData {
  QuerySalesOrders: {
    totalCount: number;
    nodes: SalesOrder[];
  };
}

interface CountryTaxSummary {
  countryIso: string;
  countryName: string;
  orderCount: number;
  grossAmount: number;
  netAmount: number;
  taxAmount: number;
  taxRate: number;
}

// EU VAT rates (simplified - actual rates vary)
const EU_VAT_RATES: Record<string, number> = {
  DE: 19, AT: 20, NL: 21, BE: 21, FR: 20, IT: 22, ES: 21, PT: 23,
  PL: 23, CZ: 21, HU: 27, RO: 19, BG: 20, GR: 24, SE: 25, DK: 25,
  FI: 24, IE: 23, LU: 17, SK: 20, SI: 22, HR: 25, LT: 21, LV: 21,
  EE: 20, CY: 19, MT: 18,
};

const TAX_QUERY = gql`
  query TaxAnalysis {
    QuerySalesOrders(first: 500, order: [{ salesOrderDate: DESC }]) {
      totalCount
      nodes {
        salesOrderNumber
        salesOrderDate
        totalGrossAmount
        totalNetAmount
        currencyIso
        companyName
        billingAddressCountryIso
        billingAddressCountryName
        shipmentAddressCountryIso
        shipmentAddressCountryName
      }
    }
  }
`;

function analyzeTaxByCountry(orders: SalesOrder[]): CountryTaxSummary[] {
  const countryMap = new Map<string, CountryTaxSummary>();

  orders.forEach(order => {
    const countryIso = order.billingAddressCountryIso || 'Unknown';
    const countryName = order.billingAddressCountryName || countryIso;

    if (!countryMap.has(countryIso)) {
      countryMap.set(countryIso, {
        countryIso,
        countryName,
        orderCount: 0,
        grossAmount: 0,
        netAmount: 0,
        taxAmount: 0,
        taxRate: EU_VAT_RATES[countryIso] || 0,
      });
    }

    const summary = countryMap.get(countryIso)!;
    summary.orderCount++;
    summary.grossAmount += order.totalGrossAmount;
    summary.netAmount += order.totalNetAmount || order.totalGrossAmount / (1 + (summary.taxRate / 100));
    summary.taxAmount = summary.grossAmount - summary.netAmount;
  });

  return Array.from(countryMap.values()).sort((a, b) => b.grossAmount - a.grossAmount);
}

const TaxAnalyticsView: React.FC<TaxAnalyticsViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [taxSummary, setTaxSummary] = useState<CountryTaxSummary[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery<TaxData>(appBridge, TAX_QUERY);
      setOrders(result.QuerySalesOrders.nodes);
      setTaxSummary(analyzeTaxByCountry(result.QuerySalesOrders.nodes));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [appBridge]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate totals
  const totalGross = taxSummary.reduce((sum, c) => sum + c.grossAmount, 0);
  const totalNet = taxSummary.reduce((sum, c) => sum + c.netAmount, 0);
  const totalTax = taxSummary.reduce((sum, c) => sum + c.taxAmount, 0);
  const euCountries = taxSummary.filter(c => EU_VAT_RATES[c.countryIso]);
  const nonEuCountries = taxSummary.filter(c => !EU_VAT_RATES[c.countryIso]);

  // Chart data
  const countryChartData = taxSummary.slice(0, 6).map((c, i) => ({
    label: c.countryIso,
    value: Math.round(c.grossAmount),
    color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'][i],
  }));

  const taxDistribution = [
    { label: 'Net Amount', value: Math.round(totalNet), color: '#3b82f6' },
    { label: 'Tax Amount', value: Math.round(totalTax), color: '#ef4444' },
  ];

  // Export function
  const exportTaxReport = () => {
    const csv = [
      'Country,Country Code,Orders,Gross Amount,Net Amount,Tax Amount,Tax Rate',
      ...taxSummary.map(c =>
        `"${c.countryName}",${c.countryIso},${c.orderCount},${c.grossAmount.toFixed(2)},${c.netAmount.toFixed(2)},${c.taxAmount.toFixed(2)},${c.taxRate}%`
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: 'countryName' as const,
      header: 'Country',
      render: (value: unknown, row: CountryTaxSummary) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{getFlag(row.countryIso)}</span>
          <span>{value as string}</span>
          {EU_VAT_RATES[row.countryIso] && (
            <Badge variant="outline" label="EU" />
          )}
        </div>
      ),
    },
    { key: 'orderCount' as const, header: 'Orders', align: 'center' as const },
    {
      key: 'grossAmount' as const,
      header: 'Gross',
      align: 'right' as const,
      render: (value: unknown) => `${(value as number).toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR`,
    },
    {
      key: 'netAmount' as const,
      header: 'Net',
      align: 'right' as const,
      render: (value: unknown) => `${(value as number).toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR`,
    },
    {
      key: 'taxAmount' as const,
      header: 'Tax',
      align: 'right' as const,
      render: (value: unknown) => (
        <span style={{ color: '#ef4444', fontWeight: 600 }}>
          {(value as number).toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR
        </span>
      ),
    },
    {
      key: 'taxRate' as const,
      header: 'VAT Rate',
      align: 'center' as const,
      render: (value: unknown) => (
        <Badge
          variant={value ? 'warning' : 'outline'}
          label={value ? `${value}%` : 'N/A'}
        />
      ),
    },
  ];

  return (
    <Stack spacing="6" direction="column">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
          >
            <Receipt size={24} color="white" />
          </div>
          <div>
            <Text type="h2" weight="bold">
              Tax Analytics
            </Text>
            <Text type="small" color="muted">
              VAT/Tax breakdown by country for compliance and reporting
            </Text>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportTaxReport}
            variant="outline"
            label="Export CSV"
            icon={<Download size={16} />}
          />
          <Button
            onClick={fetchData}
            disabled={loading}
            variant="outline"
            label={loading ? 'Loading...' : 'Refresh'}
          />
        </div>
      </div>

      {/* Value Proposition */}
      <div
        className="p-4 rounded-lg border-l-4"
        style={{
          background: 'linear-gradient(90deg, rgba(99,102,241,0.1) 0%, transparent 100%)',
          borderColor: '#6366f1',
        }}
      >
        <Text type="small" weight="semibold" style={{ color: '#6366f1' }}>
          Stay compliant, avoid penalties
        </Text>
        <Text type="small" color="muted">
          Track your tax obligations by country. See VAT collected per region, identify EU vs non-EU sales,
          and export data for your accountant. Essential for OSS (One-Stop-Shop) VAT reporting.
        </Text>
      </div>

      {error && (
        <Box className="p-4 rounded-lg bg-red-50 border border-red-200">
          <Text type="small" color="danger">{error}</Text>
        </Box>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Gross"
          value={`${(totalGross / 1000).toFixed(1)}K`}
          subtitle="EUR"
          icon={TrendingUp}
          color="#3b82f6"
        />
        <StatCard
          title="Total Tax"
          value={`${(totalTax / 1000).toFixed(1)}K`}
          subtitle="EUR collected"
          icon={Receipt}
          color="#ef4444"
        />
        <StatCard
          title="EU Countries"
          value={euCountries.length}
          subtitle="with VAT"
          icon={Globe}
          color="#8b5cf6"
        />
        <StatCard
          title="Non-EU"
          value={nonEuCountries.length}
          subtitle="countries"
          icon={Globe}
          color="#f59e0b"
        />
        <StatCard
          title="Orders"
          value={orders.length}
          subtitle="total"
          icon={PieChart}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={countryChartData} height={180} showValues />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax vs Net Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDonutChart data={taxDistribution} size={150} />
          </CardContent>
        </Card>
      </div>

      {/* EU VAT Alert */}
      {euCountries.length > 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-500" />
              <CardTitle>EU VAT Compliance Note</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Text type="small" color="muted">
              You have sales in <strong>{euCountries.length} EU countries</strong>.
              If your B2C sales exceed €10,000 to other EU countries, you may need to register for
              <strong> OSS (One-Stop-Shop)</strong> VAT reporting or register in each country.
            </Text>
            <div className="mt-3 flex gap-2 flex-wrap">
              {euCountries.map(c => (
                <Badge
                  key={c.countryIso}
                  variant="outline"
                  label={`${getFlag(c.countryIso)} ${c.countryIso}: ${c.grossAmount.toLocaleString('de-DE', { minimumFractionDigits: 0 })} EUR`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Summary by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={taxSummary}
            emptyMessage="No tax data available"
            showExport={false}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

// Helper function to get flag emoji
function getFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default TaxAnalyticsView;
