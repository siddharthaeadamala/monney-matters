import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { ChartSkeleton } from '../common/Skeleton';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl border border-surface-border shadow-lg text-xs space-y-1">
        <p className="font-bold text-dark-heading mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className="flex items-center justify-between gap-4 font-medium"
            style={{ color: entry.color }}
          >
            <span>{entry.name}:</span>
            <span className="font-bold">{formatCurrency(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function WeeklyActivityChart() {
  const { weeklyActivityData, isLoading } = useTransactions();

  if (isLoading) {
    return <ChartSkeleton height="h-80" />;
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-surface-border shadow-card flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-dark-heading">
          Weekly Activity
        </h2>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyActivityData}
            barGap={8}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#718EBF', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#718EBF', fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
            />
            <Bar
              name="Debit (Withdraw)"
              dataKey="withdraw"
              fill="#1814F3"
              radius={[10, 10, 0, 0]}
              maxBarSize={15}
            />
            <Bar
              name="Credit (Deposit)"
              dataKey="deposit"
              fill="#16DBAA"
              radius={[10, 10, 0, 0]}
              maxBarSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
