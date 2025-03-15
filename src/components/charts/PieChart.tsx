
import { PieChart as RechartsPieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/utils/loanCalculations';
import { customColors } from './LineChart';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
}

const RADIAN = Math.PI / 180;

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium text-gray-900">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }} className="text-sm">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// Custom rendered label inside the pie
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.08 ? (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

// Custom legend that shows both percentage and value
const CustomLegend = ({ payload }: any) => {
  // Calculate total for percentages
  const total = payload.reduce((sum: number, entry: any) => sum + entry.payload.value, 0);
  
  return (
    <ul className="flex justify-center gap-6 mt-2">
      {payload.map((entry: any, index: number) => {
        const percent = ((entry.payload.value / total) * 100).toFixed(1);
        return (
          <li key={`legend-item-${index}`} className="flex items-center">
            <span 
              className="inline-block w-3 h-3 mr-2 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="text-sm">
              {entry.value} ({percent}%)
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export const PieChart = ({ data }: PieChartProps) => {
  const defaultColors = [customColors.blue[0], customColors.orange[0], customColors.green[0], customColors.purple[0]];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || defaultColors[index % defaultColors.length]} 
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
