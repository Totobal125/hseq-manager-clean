"use client";
import ChartSection from './presentation/components/chart';
import CardsSection from './presentation/components/card'
import StatsSection from './presentation/components/stat'
import TypewriterText from './presentation/components/TypewriterText';
import AnimatedLine from './presentation/components/AnimatedLine';

export default function Home() {
  // Nombre de la empresa - se puede configurar desde variables de entorno
  const nombreEmpresa = process.env.NEXT_PUBLIC_EMPRESA_NOMBRE || "HSEQ Manager";
  
  // Función para renderizar el nombre con los colores del logo
  const renderColoredName = (name: string) => {
    if (name === "HSEQ Manager") {
      return (
        <span className="text-4xl font-bold">
          <span className="text-red-500">H</span>
          <span className="text-yellow-400">S</span>
          <span className="text-green-500">E</span>
          <span className="text-blue-500">Q</span>
          <span className="text-teal-800"> Manager</span>
        </span>
      );
    }
    return <span className="text-4xl font-bold text-sky-600">{name}</span>;
  };
  
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Sección de Bienvenida */}
          <div className="mb-8 relative">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <TypewriterText 
                text={`¡Bienvenido a `}
                speed={80}
                className="text-4xl font-bold opacity-80 text-gray-900"
              />
              <span className="inline-block">
                {renderColoredName(nombreEmpresa)}
              </span>
              <TypewriterText 
                text={`!`}
                speed={80}
                delay={2400}
                className="text-4xl font-bold text-gray-900 opacity-80"
              />
            </h1>
            <p className="text-2xl text-gray-600 mb-2 animate-fade-in">
              Sistema de Gestión Integral de Prevención y Seguridad
            </p>
            <p className="text-gray-500">
              Gestiona de manera eficiente todos los aspectos de seguridad y prevención de tu organización
            </p>
          </div>
          

          
          <CardsSection />
          <ChartSection />
          <StatsSection />
        </div>
      </div>
    </div>
  )
}
