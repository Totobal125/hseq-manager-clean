"use client";
import { BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

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
  ],
  distribucion: [
    { name: "Excelente", value: 25, color: "#10B981" },
    { name: "Bueno", value: 40, color: "#3B82F6" },
    { name: "Regular", value: 20, color: "#F59E0B" },
    { name: "Necesita Mejora", value: 15, color: "#EF4444" },
  ]
};

export default function DesempenoChart() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard de Desempeño</h2>
        <p className="text-gray-600">Análisis y métricas de rendimiento del equipo</p>
      </div>



      {/* Primera fila - Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Radar de Habilidades */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            Radar de Habilidades
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={100} data={chartData.habilidades}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis 
                dataKey="habilidad" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
              />
              <Radar 
                name="Empleado" 
                dataKey="valor" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.6} 
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Evolución del Desempeño */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Evolución del Desempeño
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.desempeno}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                domain={[60, 100]} 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="desempeño" 
                stroke="#2563EB" 
                strokeWidth={3}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segunda fila - Gráficos secundarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asistencias Mensuales */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Asistencias Mensuales
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.asistencias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar 
                dataKey="asistencia" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Calificaciones */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            Distribución de Calificaciones
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.distribucion}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.distribucion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {chartData.distribucion.map((item, index) => (
              <div key={index} className="flex items-center text-sm">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}