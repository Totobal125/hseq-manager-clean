"use client";
import { BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Datos para los gráficos
const chartData = {
  habilidades: [
    { habilidad: "Liderazgo", valor: 80 },
    { habilidad: "Comunicación", valor: 90 },
    { habilidad: "Productividad", valor: 70 },
    { habilidad: "Resolución", valor: 85 },
    { habilidad: "Adaptabilidad", valor: 75 },
  ],
  desempeno: [
    { mes: "Ene", desempeño: 70 },
    { mes: "Feb", desempeño: 75 },
    { mes: "Mar", desempeño: 80 },
    { mes: "Abr", desempeño: 85 },
    { mes: "May", desempeño: 78 },
    { mes: "Jun", desempeño: 90 },
  ],
  asistencias: [
    { mes: "Ene", asistencia: 18 },
    { mes: "Feb", asistencia: 20 },
    { mes: "Mar", asistencia: 22 },
    { mes: "Abr", asistencia: 19 },
    { mes: "May", asistencia: 21 },
    { mes: "Jun", asistencia: 23 },
  ]
};

export default function DesempenoChart() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mb-6">
      {/* Radar de Habilidades */}
      <div className="bg-white rounded-xl shadow p-4 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Radar de Habilidades</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius={100} data={chartData.habilidades}>
            <PolarGrid />
            <PolarAngleAxis dataKey="habilidad" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar 
              name="Empleado" 
              dataKey="valor" 
              stroke="#EF4444" 
              fill="#EF4444" 
              fillOpacity={0.6} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Evolución del Desempeño */}
      <div className="bg-white rounded-xl shadow p-4 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Evolución del Desempeño</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData.desempeno}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis domain={[60, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="desempeño" 
              stroke="#2563EB" 
              strokeWidth={3} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Asistencias Mensuales */}
      <div className="bg-white rounded-xl shadow p-4 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Asistencias Mensuales</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData.asistencias}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="asistencia" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}