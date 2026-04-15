import { useCallback, useEffect, useState } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import { Card, CardHeader, CardTitle, CardContent, Text, Stack, Box, Button } from '@jtl-software/platform-ui-react';
import { Calendar, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { gql } from 'graphql-request';
import { StatCard } from '../components/shared';
import { executeQuery } from '../utils/graphqlClient';

interface SalesHeatmapViewProps {
  appBridge: AppBridge;
}

interface SalesOrder {
  salesOrderDate: string;
  totalGrossAmount: number;
}

interface HeatmapData {
  QuerySalesOrders: {
    totalCount: number;
    nodes: SalesOrder[];
  };
}

interface DayHourData {
  day: number;
  hour: number;
  count: number;
  total: number;
}

const HEATMAP_QUERY = gql`
  query SalesTimeline {
    QuerySalesOrders(first: 500, order: [{ salesOrderDate: DESC }]) {
      totalCount
      nodes {
        salesOrderDate
        totalGrossAmount
      }
    }
  }
`;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function processHeatmapData(orders: SalesOrder[]): DayHourData[] {
  const data: DayHourData[] = [];

  // Initialize grid
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({ day, hour, count: 0, total: 0 });
    }
  }

  // Populate with order data
  orders.forEach(order => {
    const date = new Date(order.salesOrderDate);
    const day = date.getDay();
    const hour = date.getHours();
    const index = day * 24 + hour;
    data[index].count++;
    data[index].total += order.totalGrossAmount;
  });

  return data;
}

function getHeatColor(value: number, max: number): string {
  if (max === 0) return 'rgba(59, 130, 246, 0.05)';
  const intensity = value / max;
  // Blue scale
  if (intensity === 0) return 'rgba(59, 130, 246, 0.05)';
  if (intensity < 0.25) return 'rgba(59, 130, 246, 0.2)';
  if (intensity < 0.5) return 'rgba(59, 130, 246, 0.4)';
  if (intensity < 0.75) return 'rgba(59, 130, 246, 0.6)';
  return 'rgba(59, 130, 246, 0.9)';
}

const SalesHeatmapView: React.FC<SalesHeatmapViewProps> = ({ appBridge }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heatmapData, setHeatmapData] = useState<DayHourData[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery<HeatmapData>(appBridge, HEATMAP_QUERY);
      setOrders(result.QuerySalesOrders.nodes);
      setHeatmapData(processHeatmapData(result.QuerySalesOrders.nodes));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [appBridge]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const maxCount = Math.max(...heatmapData.map(d => d.count));
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalGrossAmount, 0);

  // Find peak hours
  const hourlyTotals = HOURS.map(hour => ({
    hour,
    count: heatmapData.filter(d => d.hour === hour).reduce((sum, d) => sum + d.count, 0),
  }));
  const peakHour = hourlyTotals.reduce((max, h) => (h.count > max.count ? h : max), { hour: 0, count: 0 });

  // Find peak day
  const dailyTotals = DAYS.map((_, day) => ({
    day,
    count: heatmapData.filter(d => d.day === day).reduce((sum, d) => sum + d.count, 0),
  }));
  const peakDay = dailyTotals.reduce((max, d) => (d.count > max.count ? d : max), { day: 0, count: 0 });

  return (
    <Stack spacing="6" direction="column">
      <div className="flex items-center justify-between">
        <div>
          <Text type="h2" weight="bold">
            Sales Heatmap
          </Text>
          <Text type="small" color="muted">
            Discover when your customers buy. Visual patterns that reveal your best selling hours and days.
          </Text>
        </div>
        <Button onClick={fetchData} disabled={loading} variant="outline" label={loading ? 'Loading...' : 'Refresh'} />
      </div>

      {/* Value Proposition */}
      <div className="p-4 rounded-lg border-l-4" style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.1) 0%, transparent 100%)', borderColor: '#10b981' }}>
        <Text type="small" weight="semibold" style={{ color: '#10b981' }}>
          Time your marketing for maximum impact
        </Text>
        <Text type="small" color="muted">
          Timing is everything in e-commerce. See exactly which days and hours generate the most orders. Schedule email campaigns, social posts, and flash sales when your customers are most active. Staff your support team during peak hours. Turn timing insights into revenue growth.
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
        <StatCard title="Total Orders" value={orders.length} subtitle="in dataset" icon={Calendar} />
        <StatCard title="Peak Day" value={DAYS[peakDay.day]} subtitle={`${peakDay.count} orders`} icon={TrendingUp} color="#16a34a" />
        <StatCard title="Peak Hour" value={`${peakHour.hour}:00`} subtitle={`${peakHour.count} orders`} icon={Clock} color="#9333ea" />
        <StatCard
          title="Total Revenue"
          value={`${totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 0 })} EUR`}
          subtitle="analyzed"
          icon={DollarSign}
          color="#ea580c"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders by Day & Hour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div style={{ minWidth: '800px' }}>
              {/* Header row with hours */}
              <div className="flex">
                <div style={{ width: '60px' }} />
                {HOURS.filter(h => h % 2 === 0).map(hour => (
                  <div key={hour} className="flex-1 text-center py-1" style={{ minWidth: '30px' }}>
                    <Text type="xs" color="muted">
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </div>
                ))}
              </div>

              {/* Heatmap rows */}
              {DAYS.map((dayName, day) => (
                <div key={day} className="flex items-center">
                  <div style={{ width: '60px' }} className="py-1">
                    <Text type="small" weight="semibold">
                      {dayName}
                    </Text>
                  </div>
                  <div className="flex flex-1">
                    {HOURS.map(hour => {
                      const cell = heatmapData.find(d => d.day === day && d.hour === hour);
                      const count = cell?.count || 0;
                      return (
                        <div
                          key={hour}
                          className="flex-1 aspect-square rounded-sm m-0.5 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                          style={{
                            background: getHeatColor(count, maxCount),
                            minWidth: '24px',
                            minHeight: '24px',
                          }}
                          title={`${dayName} ${hour}:00 - ${count} orders`}
                        >
                          {count > 0 && (
                            <span style={{ fontSize: '0.65rem', color: count > maxCount * 0.5 ? 'white' : 'var(--base-muted-foreground)' }}>
                              {count}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="flex items-center justify-end gap-2 mt-4">
                <Text type="xs" color="muted">
                  Less
                </Text>
                {[0.05, 0.2, 0.4, 0.6, 0.9].map((intensity, i) => (
                  <div key={i} className="w-4 h-4 rounded-sm" style={{ background: `rgba(59, 130, 246, ${intensity})` }} />
                ))}
                <Text type="xs" color="muted">
                  More
                </Text>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {dailyTotals.map((data, i) => (
              <div key={i} className="flex-1 min-w-[100px] p-4 rounded-lg text-center" style={{ background: 'var(--base-muted)' }}>
                <Text type="small" weight="semibold">
                  {DAYS[data.day]}
                </Text>
                <Text type="h4" weight="bold">
                  {data.count}
                </Text>
                <Text type="xs" color="muted">
                  orders
                </Text>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default SalesHeatmapView;
