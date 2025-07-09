import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, TooltipProps } from 'recharts';

interface LineChartData {
  month: string;
  income: number;
  expense: number;
}

interface AnimatedLineChartProps {
  data: LineChartData[];
  getCurrencySymbol: () => string;
}

// Custom Tooltip with enhanced styling (No changes needed here)
const CustomTooltip = ({ active, payload, label, getCurrencySymbol }: TooltipProps<number, string> & { getCurrencySymbol: () => string }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.stroke }} />
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{entry.dataKey}:</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {getCurrencySymbol()}{entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

// --- The "Tracker" Cursor with the FIX ---
const CustomCursor = (props: any) => {
    const { points, height } = props;
    if (!points || points.length === 0) {
        return null;
    }
    const { x } = points[0];

    // --- FIX APPLIED HERE ---
    // Use optional chaining (?.) to safely access nested properties.
    // This prevents the "Cannot read properties of undefined" crash.
    const incomePoint = points.find((p: any) => p?.payload?.income !== undefined);
    const expensePoint = points.find((p: any) => p?.payload?.expense !== undefined);

    return (
      <g>
        <line x1={x} y1={0} x2={x} y2={height + 30} stroke="#9ca3af" strokeWidth="1" strokeDasharray="5 5" />
        {incomePoint && (
          <motion.circle 
            cx={incomePoint.x} 
            cy={incomePoint.y} 
            r={6} 
            stroke="#10b981" 
            strokeWidth={2} 
            fill="#fff" 
          />
        )}
        {expensePoint && (
          <motion.circle 
            cx={expensePoint.x} 
            cy={expensePoint.y} 
            r={6} 
            stroke="#f43f5e" 
            strokeWidth={2} 
            fill="#fff" 
          />
        )}
      </g>
    );
};


export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({ data, getCurrencySymbol }) => {
  // Defensive check for initial state if data can be empty
  const [activeData, setActiveData] = useState<LineChartData | null>(data.length > 0 ? data[data.length - 1] : null);
  
  const incomeColor = "#10b981"; // Emerald 500
  const expenseColor = "#f43f5e"; // Rose 500

  // Handle case where data might be empty
  if (data.length === 0) {
    return (
        <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
            <p className="text-gray-500">Not enough data to display chart.</p>
        </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeData ? activeData.month : 'loading'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{activeData ? `Data for ${activeData.month}` : 'Overview'}</p>
            <div className="flex items-baseline gap-6 mt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ color: incomeColor }}>{getCurrencySymbol()}{activeData ? activeData.income.toLocaleString() : '...'}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Income</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold" style={{ color: expenseColor }}>{getCurrencySymbol()}{activeData ? activeData.expense.toLocaleString() : '...'}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Expense</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          onMouseMove={(state) => {
            if (state.isTooltipActive && state.activePayload?.length) {
              setActiveData(state.activePayload[0].payload);
            }
          }}
          onMouseLeave={() => {
            setActiveData(data[data.length - 1] || null);
          }}
        >
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `${getCurrencySymbol()}${(Number(value)/1000)}k`}
          />
          
          <Tooltip 
            content={<CustomTooltip getCurrencySymbol={getCurrencySymbol}/>}
            cursor={<CustomCursor />}
            wrapperStyle={{ outline: 'none' }}
          />
          
          <Area type="monotone" dataKey="income" stroke={incomeColor} strokeWidth={3} fill="url(#incomeGradient)" dot={false} activeDot={false} />
          <Area type="monotone" dataKey="expense" stroke={expenseColor} strokeWidth={3} fill="url(#expenseGradient)" dot={false} activeDot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};