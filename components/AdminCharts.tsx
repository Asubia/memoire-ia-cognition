"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";

type ChartsProps = {
  comparisonData: { name: string; moyenne: number }[];
  userProgressData: { participant: string; test1: number; test2: number }[];
  correlationData: { participant: string; aiUsage: number; scoreTest2: number }[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-lg">
        {label && <p className="text-black font-semibold mb-1">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-black text-sm">
            {entry.name} : <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminCharts({
  comparisonData,
  userProgressData,
  correlationData,
}: ChartsProps) {
  return (
    <div className="grid lg:grid-cols-1 gap-6 mb-8">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-xl">
        <h2 className="text-xl font-extrabold text-slate-900 mb-4">
          Comparaison globale Test 1 / Test 2
        </h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="moyenne">
                {comparisonData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "Test 1" ? "#2563eb" : "#16a34a"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-xl">
        <h2 className="text-xl font-extrabold text-slate-900 mb-4">
          Évolution individuelle des scores
        </h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="participant" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="test1" stroke="#2563eb" strokeWidth={3} />
              <Line type="monotone" dataKey="test2" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-xl">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">
          Corrélation entre usage de l’IA et score au Test 2
        </h2>

        <p className="text-slate-600 text-sm mb-4">
          Chaque point représente un participant. L’axe horizontal indique le
          nombre d’aides IA utilisées, l’axe vertical indique le score au Test 2.
        </p>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="aiUsage" name="Aides IA" domain={[0, 3]} />
              <YAxis type="number" dataKey="scoreTest2" name="Score Test 2" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={correlationData} fill="#7c3aed" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}