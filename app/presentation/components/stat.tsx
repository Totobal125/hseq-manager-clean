"use client";
const StatsSection = () => {
  const stats = [
    { label: 'Total Ventas', value: '12.5k', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Usuarios Nuevos', value: '3.2k', color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Satisfacción', value: '89%', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { label: 'Tasa de Retorno', value: '76%', color: 'text-purple-600', bgColor: 'bg-purple-50' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 opacity-80">Resumen Ejecutivo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`text-center p-4 rounded-lg ${stat.bgColor}`}>
            <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default StatsSection;