import { Text } from '@jtl-software/platform-ui-react';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  height?: number;
  showValues?: boolean;
}

export const SimpleBarChart: React.FC<BarChartProps> = ({ data, title, height = 200, showValues = true }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div>
      {title && (
        <Text type="small" weight="semibold" style={{ marginBottom: '12px' }}>
          {title}
        </Text>
      )}
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 30);
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              {showValues && (
                <Text type="xs" color="muted" style={{ marginBottom: '4px' }}>
                  {item.value.toLocaleString('de-DE')}
                </Text>
              )}
              <div
                className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                style={{
                  height: Math.max(barHeight, 4),
                  background: item.color || 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                  minHeight: '4px',
                }}
              />
              <Text type="xs" color="muted" style={{ marginTop: '8px', textAlign: 'center' }}>
                {item.label}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface LineChartProps {
  data: { label: string; value: number }[];
  title?: string;
  height?: number;
  color?: string;
}

export const SimpleLineChart: React.FC<LineChartProps> = ({ data, title, height = 150, color = '#3b82f6' }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 100;
    return `${x},${y}`;
  });

  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const areaD = pathD ? `${pathD} L 100,100 L 0,100 Z` : '';

  return (
    <div>
      {title && (
        <Text type="small" weight="semibold" style={{ marginBottom: '12px' }}>
          {title}
        </Text>
      )}
      <div style={{ height, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#gradient-${title})`} />
          <path d={pathD} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((d.value - minValue) / range) * 100;
            return <circle key={i} cx={x} cy={y} r="3" fill={color} className="hover:r-4 transition-all" />;
          })}
        </svg>
      </div>
      <div className="flex justify-between mt-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((d, i) => (
          <Text key={i} type="xs" color="muted">
            {d.label}
          </Text>
        ))}
      </div>
    </div>
  );
};

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  size?: number;
}

export const SimpleDonutChart: React.FC<DonutChartProps> = ({ data, title, size = 160 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  const segments = data.map(d => {
    const percentage = total > 0 ? (d.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + angle) * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...d,
      percentage,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="flex items-center gap-4">
      <div style={{ width: size, height: size, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {segments.map((seg, i) => (
            <path
              key={i}
              d={seg.path}
              fill={seg.color}
              className="transition-opacity hover:opacity-80"
              style={{ cursor: 'pointer' }}
            />
          ))}
          <circle cx="50" cy="50" r="25" fill="var(--base-background)" />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <Text type="h4" weight="bold">
            {total.toLocaleString('de-DE')}
          </Text>
          <Text type="xs" color="muted">
            Total
          </Text>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {title && (
          <Text type="small" weight="semibold">
            {title}
          </Text>
        )}
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: seg.color }} />
            <Text type="xs" color="muted">
              {seg.label}: {seg.value} ({seg.percentage.toFixed(0)}%)
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label, color = '#3b82f6' }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <Text type="xs" color="muted" style={{ minWidth: '80px' }}>
        {label}
      </Text>
      <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--base-muted)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
      <Text type="xs" weight="semibold" style={{ minWidth: '50px', textAlign: 'right' }}>
        {value.toLocaleString('de-DE')}
      </Text>
    </div>
  );
};
