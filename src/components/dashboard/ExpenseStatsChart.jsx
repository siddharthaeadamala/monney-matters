import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { ChartSkeleton } from '../common/Skeleton';
import { formatCurrency } from '../../utils/formatters';

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ExpenseStatsChart() {
  const { expenseStatisticsData, isLoading } = useTransactions();

  if (isLoading) {
    return <ChartSkeleton height="h-80" />;
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-card flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base sm:text-lg font-bold text-dark-heading">
          Expense Statistics
        </h2>
      </div>

      <div className="w-full h-56 sm:h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseStatisticsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={85}
              innerRadius={30}
              dataKey="value"
              paddingAngle={4}
            >
              {expenseStatisticsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [formatCurrency(value), name]}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E6EFF5',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-surface-border/60">
        {expenseStatisticsData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-dark-body truncate">{item.name}</span>
            <span className="font-semibold text-dark-heading ml-auto">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
