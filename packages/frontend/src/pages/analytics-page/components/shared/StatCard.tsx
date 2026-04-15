import { Card, CardContent, Text, Stack, Box } from '@jtl-software/platform-ui-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.FC<{ size?: number; color?: string; className?: string }>;
  trend?: { value: number; label: string };
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, trend, color = '#1a56db' }) => {
  return (
    <Card className="flex-1 min-w-[200px]">
      <CardContent className="pt-4">
        <Stack spacing="2" direction="column">
          <div className="flex items-center justify-between">
            <Text type="small" color="muted">
              {title}
            </Text>
            {Icon && <Icon size={20} color={color} className="shrink-0" />}
          </div>
          <Text type="h3" weight="bold">
            {value}
          </Text>
          {(subtitle || trend) && (
            <Box className="flex items-center gap-2">
              {trend && (
                <Text type="xs" color={trend.value >= 0 ? 'success' : 'danger'} weight="semibold">
                  {trend.value >= 0 ? '+' : ''}
                  {trend.value}%
                </Text>
              )}
              {subtitle && (
                <Text type="xs" color="muted">
                  {subtitle}
                </Text>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatCard;
