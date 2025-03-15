
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area 
} from 'recharts';
import { formatCurrency } from '@/utils/loanCalculations';

interface DataPoint {
  [key: string]: any;
}

export const customColors = {
  blue: ['#3b82f6', '#2563eb', '#1d4ed8'],
  green: ['#10b981', '#059669', '#047857'],
  orange: ['#f97316', '#ea580c', '#c2410c'],
  purple: ['#8b5cf6', '#7c3aed', '#6d28d9'],
  red: ['#ef4444', '#dc2626', '#b91c1c'],
};

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface LineChartProps {
  data: DataPoint[];
  xKey: string;
  yKey: string;
  label?: string;
  color?: string;
}

export const LineChart = ({ 
  data,
  xKey,
  yKey,
  label,
  color = customColors.blue[0] 
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xKey} 
          tick={{ fontSize: 12 }} 
          tickMargin={10}
          stroke="#94a3b8"
        />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value)}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          stroke="#94a3b8"
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey={yKey}
          name={label || yKey}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 1 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

interface BarChartProps {
  data: DataPoint[];
  keys: string[];
  indexBy: string;
  colors?: string[];
}

export const BarChart = ({ 
  data,
  keys,
  indexBy,
  colors = [customColors.blue[0], customColors.orange[0]]
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={indexBy} 
          tick={{ fontSize: 12 }} 
          tickMargin={10}
          stroke="#94a3b8"
        />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value)}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          stroke="#94a3b8"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {keys.map((key, index) => (
          <Bar 
            key={key}
            dataKey={key}
            name={key.charAt(0).toUpperCase() + key.slice(1)}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

interface AreaChartProps {
  data: DataPoint[];
  xKey: string;
  yKey: string;
  label?: string;
  color?: string;
}

export const AreaChart = ({ 
  data,
  xKey,
  yKey,
  label,
  color = customColors.blue[0] 
}: AreaChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xKey} 
          tick={{ fontSize: 12 }} 
          tickMargin={10}
          stroke="#94a3b8"
        />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value)}
          tick={{ fontSize: 12 }}
          tickMargin={10}
          stroke="#94a3b8"
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey={yKey}
          name={label || yKey}
          stroke={color}
          fill={color}
          fillOpacity={0.2}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};
