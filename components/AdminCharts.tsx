"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ComparisonData = {
  name: string;
  score: number;
};

type GapDistributionData = {
  name: string;
  value: number;
};

type CorrelationData = {
  participant: string;
  aiUsage: number;
  scoreTest2: number;
};

export default function AdminCharts({
  comparisonData,
  gapDistributionData,
  correlationData,
}: {
  comparisonData: ComparisonData[];
  gapDistributionData: GapDistributionData[];
  correlationData: CorrelationData[];
}) {
  const trendData = getTrendLine(correlationData);

  return (
    <div className="space-y-8">
      <ChartCard
        title="Comparaison globale Test 1 / Test 2"
        description="Compare la moyenne du test sans IA et celle du test avec assistance IA."
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: "#334155" }} />
            <YAxis domain={[0, 100]} tick={{ fill: "#334155" }} />
            <Tooltip />
            <Bar dataKey="score" radius={[12, 12, 0, 0]}>
              <Cell fill="#2563eb" />
              <Cell fill="#16a34a" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid lg:grid-cols-2 gap-8">
        <ChartCard
          title="Répartition des évolutions"
          description="Montre combien de participants progressent, stagnent ou régressent avec l’IA."
        >
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={gapDistributionData}
                dataKey="value"
                nameKey="name"
                outerRadius={105}
                label
              >
                <Cell fill="#16a34a" />
                <Cell fill="#64748b" />
                <Cell fill="#dc2626" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Évolution moyenne"
          description="Visualise simplement le passage du score moyen sans IA au score moyen avec IA."
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#334155" }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#334155" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#7c3aed"
                strokeWidth={4}
                dot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard
        title="Corrélation usage IA / score Test 2"
        description="Chaque point représente un participant. La ligne violette indique la tendance générale."
      >
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="aiUsage"
              name="Aides IA"
              domain={[0, 10]}
              tick={{ fill: "#334155" }}
            />
            <YAxis
              type="number"
              dataKey="scoreTest2"
              name="Score Test 2"
              domain={[0, 100]}
              tick={{ fill: "#334155" }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter
              name="Participants"
              data={correlationData}
              fill="#2563eb"
            />
            {trendData.length > 0 && (
              <Line
                type="linear"
                dataKey="scoreTest2"
                data={trendData}
                stroke="#7c3aed"
                strokeWidth={3}
                dot={false}
                name="Tendance"
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
      <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
      <p className="text-slate-500 mt-1 mb-6">{description}</p>
      {children}
    </div>
  );
}

function getTrendLine(data: CorrelationData[]) {
  if (data.length < 2) return [];

  const n = data.length;
  const sumX = data.reduce((sum, d) => sum + d.aiUsage, 0);
  const sumY = data.reduce((sum, d) => sum + d.scoreTest2, 0);
  const sumXY = data.reduce((sum, d) => sum + d.aiUsage * d.scoreTest2, 0);
  const sumX2 = data.reduce((sum, d) => sum + d.aiUsage * d.aiUsage, 0);

  const denominator = n * sumX2 - sumX * sumX;

  if (denominator === 0) return [];

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return [
    {
      aiUsage: 0,
      scoreTest2: Math.max(0, Math.min(100, Math.round(intercept))),
    },
    {
      aiUsage: 10,
      scoreTest2: Math.max(0, Math.min(100, Math.round(slope * 10 + intercept))),
    },
  ];
}