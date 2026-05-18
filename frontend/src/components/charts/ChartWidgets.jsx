import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts'

const COLORS = ['#22d3ee', '#a78bfa', '#22c55e', '#f59e0b', '#ef4444', '#818cf8']

const tooltipStyle = {
  contentStyle: {
    background: '#13131f',
    border: '1px solid #1f1f32',
    borderRadius: '10px',
    fontSize: '12px',
    color: '#eeeef5',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  labelStyle: { color: '#8888a8', marginBottom: '4px' },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
}

const axisStyle = {
  tick: { fill: '#55556a', fontSize: 11 },
  axisLine: false,
  tickLine: false,
}

export function BarChartWidget({ data, xKey, bars = [], height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f32" vertical={false} />
        <XAxis dataKey={xKey} {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip {...tooltipStyle} />
        {bars.map((b, i) => (
          <Bar key={b.key} dataKey={b.key} name={b.label ?? b.key}
            fill={b.color ?? COLORS[i]} radius={[4, 4, 0, 0]} maxBarSize={40} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function LineChartWidget({ data, xKey, lines = [], height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f32" vertical={false} />
        <XAxis dataKey={xKey} {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip {...tooltipStyle} />
        {lines.map((l, i) => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.label ?? l.key}
            stroke={l.color ?? COLORS[i]} strokeWidth={2} dot={{ r: 3, fill: l.color ?? COLORS[i] }}
            activeDot={{ r: 5 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function AreaChartWidget({ data, xKey, areas = [], height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          {areas.map((a, i) => (
            <linearGradient key={a.key} id={`grad-${a.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={a.color ?? COLORS[i]} stopOpacity={0.15} />
              <stop offset="95%" stopColor={a.color ?? COLORS[i]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f1f32" vertical={false} />
        <XAxis dataKey={xKey} {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip {...tooltipStyle} />
        {areas.map((a, i) => (
          <Area key={a.key} type="monotone" dataKey={a.key} name={a.label ?? a.key}
            stroke={a.color ?? COLORS[i]} strokeWidth={2}
            fill={`url(#grad-${a.key})`} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function PieChartWidget({ data, nameKey = 'name', valueKey = 'value', height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey={valueKey} nameKey={nameKey}
          cx="50%" cy="50%" innerRadius="55%" outerRadius="80%"
          paddingAngle={3} stroke="none">
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend
          iconType="circle" iconSize={8}
          formatter={(v) => <span style={{ color: '#8888a8', fontSize: 12 }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
