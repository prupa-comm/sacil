import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  LineChart as LineChartIcon,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah } from '../utils/storage';

interface MonthlyCashflowChartProps {
  transactions: Transaction[];
}

const MONTH_NAMES: Record<string, string> = {
  '01': 'Januari',
  '02': 'Februari',
  '03': 'Maret',
  '04': 'April',
  '05': 'Mei',
  '06': 'Juni',
  '07': 'Juli',
  '08': 'Agustus',
  '09': 'September',
  '10': 'Oktober',
  '11': 'November',
  '12': 'Desember'
};

const SHORT_MONTH_NAMES: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'Mei',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Agt',
  '09': 'Sep',
  '10': 'Okt',
  '11': 'Nov',
  '12': 'Des'
};

interface MonthlyDataPoint {
  monthKey: string;
  monthLabel: string;
  shortLabel: string;
  pemasukan: number;
  pengeluaran: number;
  netCashflow: number;
  cumulativeBalance: number;
  txCount: number;
}

export const MonthlyCashflowChart: React.FC<MonthlyCashflowChartProps> = ({ transactions }) => {
  const [chartType, setChartType] = useState<'composed' | 'cumulative'>('composed');

  // Process and group monthly data
  const monthlyData = useMemo(() => {
    // Collect all month keys YYYY-MM
    const monthMap = new Map<string, { pemasukan: number; pengeluaran: number; txCount: number }>();

    // Baseline default months for current academic semester (e.g. Juli, Agustus, September 2026)
    const baseMonths = ['2026-07', '2026-08', '2026-09'];
    baseMonths.forEach((m) => {
      monthMap.set(m, { pemasukan: 0, pengeluaran: 0, txCount: 0 });
    });

    transactions.forEach((tx) => {
      if (!tx.date) return;
      const key = tx.date.substring(0, 7); // 'YYYY-MM'
      const existing = monthMap.get(key) || { pemasukan: 0, pengeluaran: 0, txCount: 0 };
      if (tx.type === 'pemasukan') {
        existing.pemasukan += tx.amount;
      } else {
        existing.pengeluaran += tx.amount;
      }
      existing.txCount += 1;
      monthMap.set(key, existing);
    });

    // Sort chronologically
    const sortedKeys = Array.from(monthMap.keys()).sort();

    let runningAccumulation = 0;
    const result: MonthlyDataPoint[] = sortedKeys.map((key) => {
      const parts = key.split('-');
      const year = parts[0];
      const monthNum = parts[1] || '01';
      const mName = MONTH_NAMES[monthNum] || monthNum;
      const shortM = SHORT_MONTH_NAMES[monthNum] || monthNum;
      const shortYear = year.slice(-2);

      const item = monthMap.get(key)!;
      const net = item.pemasukan - item.pengeluaran;
      runningAccumulation += net;

      return {
        monthKey: key,
        monthLabel: `${mName} ${year}`,
        shortLabel: `${shortM} '${shortYear}`,
        pemasukan: item.pemasukan,
        pengeluaran: item.pengeluaran,
        netCashflow: net,
        cumulativeBalance: runningAccumulation,
        txCount: item.txCount
      };
    });

    return result;
  }, [transactions]);

  // Overall calculations for health badges
  const totalIncome = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.pemasukan, 0);
  }, [monthlyData]);

  const totalExpense = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.pengeluaran, 0);
  }, [monthlyData]);

  const netOverall = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netOverall / totalIncome) * 100) : 0;

  // Financial health status evaluation
  const healthStatus = useMemo(() => {
    if (netOverall > 0 && savingsRate >= 30) {
      return {
        label: 'Sangat Sehat (Surplus Kuat)',
        color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800',
        icon: ShieldCheck,
        description: 'Pemasukan kas konsisten melampaui kebutuhan operasional ekskul.'
      };
    } else if (netOverall >= 0) {
      return {
        label: 'Cukup Seimbang',
        color: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800',
        icon: Activity,
        description: 'Arus kas berada pada ambang stabil dengan cadangan operasional aman.'
      };
    } else {
      return {
        label: 'Perlu Perhatian (Defisit Kas)',
        color: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800',
        icon: TrendingDown,
        description: 'Pengeluaran melebihi penerimaan kas pada periode ini.'
      };
    }
  }, [netOverall, savingsRate]);

  // Peak activity month
  const peakMonth = useMemo(() => {
    if (monthlyData.length === 0) return null;
    return [...monthlyData].sort((a, b) => b.pemasukan - a.pemasukan)[0];
  }, [monthlyData]);

  // Format tick numbers for Y-Axis (e.g. 50rb, 100rb)
  const formatYAxisTick = (val: number) => {
    if (val === 0) return '0';
    if (Math.abs(val) >= 1000000) {
      return `${(val / 1000000).toFixed(1)}jt`;
    }
    if (Math.abs(val) >= 1000) {
      return `${Math.round(val / 1000)}rb`;
    }
    return val.toString();
  };

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload as MonthlyDataPoint;
    if (!data) return null;

    return (
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs space-y-2 min-w-[200px] z-50">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center justify-between">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-500" />
            <span>{data.monthLabel}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{data.txCount} Transaksi</span>
        </div>

        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              <span>Pemasukan:</span>
            </span>
            <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatRupiah(data.pemasukan)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
              <span>Pengeluaran:</span>
            </span>
            <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
              {formatRupiah(data.pengeluaran)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-1 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              <span>Arus Bersih (Net):</span>
            </span>
            <span
              className={`font-mono font-bold ${
                data.netCashflow >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {data.netCashflow >= 0 ? '+' : ''}
              {formatRupiah(data.netCashflow)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1 bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Akumulasi Saldo:</span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">
              {formatRupiah(data.cumulativeBalance)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      id="container-monthly-cashflow-chart"
      className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Tren Arus Kas Bulanan
            </h3>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${healthStatus.color}`}
            >
              <healthStatus.icon className="w-3 h-3" />
              <span>{healthStatus.label}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Komparasi grafis penerimaan kas (debet) vs belanja (kredit) untuk evaluasi stabilitas ekskul.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-center">
          <button
            id="btn-chart-composed"
            onClick={() => setChartType('composed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              chartType === 'composed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Pemasukan vs Belanja</span>
          </button>
          <button
            id="btn-chart-cumulative"
            onClick={() => setChartType('cumulative')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              chartType === 'cumulative'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Pertumbuhan Saldo</span>
          </button>
        </div>
      </div>

      {/* Snapshot Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <span className="font-semibold">Total Pemasukan</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-1">
            {formatRupiah(totalIncome)}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
            Akumulasi iuran & setoran
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40">
          <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300">
            <span className="font-semibold">Total Pengeluaran</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-base font-extrabold text-rose-700 dark:text-rose-400 font-mono mt-1">
            {formatRupiah(totalExpense)}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
            Biaya operasional & setor UK7
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/70 dark:border-orange-900/40">
          <div className="flex items-center justify-between text-xs text-orange-800 dark:text-orange-300">
            <span className="font-semibold">Saldo Bersih (Net)</span>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-base font-extrabold text-orange-700 dark:text-orange-400 font-mono mt-1">
            {formatRupiah(netOverall)}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
            Surplus tersimpan ({savingsRate}%)
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Bulan Paling Aktif</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 truncate">
            {peakMonth ? peakMonth.monthLabel : '-'}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
            Penerimaan: {peakMonth ? formatRupiah(peakMonth.pemasukan) : 'Rp 0'}
          </span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'composed' ? (
            <ComposedChart
              data={monthlyData}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
                opacity={0.2}
              />
              <XAxis
                dataKey="shortLabel"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxisTick}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                formatter={(value) => {
                  if (value === 'pemasukan') return <span className="text-slate-700 dark:text-slate-300 font-medium">Pemasukan (Debet)</span>;
                  if (value === 'pengeluaran') return <span className="text-slate-700 dark:text-slate-300 font-medium">Pengeluaran (Kredit)</span>;
                  if (value === 'netCashflow') return <span className="text-slate-700 dark:text-slate-300 font-medium">Arus Bersih (Net)</span>;
                  return value;
                }}
              />
              <Bar
                name="pemasukan"
                dataKey="pemasukan"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
              <Bar
                name="pengeluaran"
                dataKey="pengeluaran"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
              <Line
                name="netCashflow"
                type="monotone"
                dataKey="netCashflow"
                stroke="#ea580c"
                strokeWidth={3}
                dot={{ fill: '#ea580c', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6, stroke: '#ea580c' }}
              />
            </ComposedChart>
          ) : (
            <AreaChart
              data={monthlyData}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
                opacity={0.2}
              />
              <XAxis
                dataKey="shortLabel"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxisTick}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                formatter={() => (
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Akumulasi Saldo Kas Organisasi (Rp)
                  </span>
                )}
              />
              <Area
                type="monotone"
                dataKey="cumulativeBalance"
                stroke="#ea580c"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSaldo)"
                dot={{ fill: '#ea580c', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Insight for Treasurer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{healthStatus.description}</span>
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          Data disinkronkan otomatis dari Buku Kas Umum
        </span>
      </div>
    </div>
  );
};
