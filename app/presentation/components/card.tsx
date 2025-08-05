"use client";
import { useState, useEffect } from 'react';

type CardProps = {
  title: string;
  description?: string;
  image?: string;
  className?: string;
  value?: string | number;
  trend?: number;
  delay?: number;
};

// Componente reutilizable tipo tarjeta
const Card = ({
  title,
  description,
  image,
  className = "",
  value,
  trend,
  delay = 0
}: CardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-700 ease-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-20 opacity-0'
      } hover:scale-105 ${className}`}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        {value && (
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {value}
          </div>
        )}
        {description && (
          <p className="text-gray-600 text-sm">
            {description}
          </p>
        )}
        {trend !== undefined && (
          <div className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};

const CardsSection = () => {
  const cards = [
    {
      id: 1,
      title: "Inspecciones Realizadas",
      description: "Total de inspecciones completadas este mes",
      value: "24",
      trend: 12.5,
      image: "/images/metrics/inspecciones.svg"
    },
    {
      id: 2,
      title: "Incidentes Reportados",
      description: "Incidentes de seguridad registrados",
      value: "3",
      trend: -8.2,
      image: "/images/metrics/incidentes.svg"
    },
    {
      id: 3,
      title: "Capacitaciones Completadas",
      description: "Personal capacitado en seguridad",
      value: "156",
      trend: 15.3,
      image: "/images/metrics/capacitacion.svg"
    },
    {
      id: 4,
      title: "Observaciones Registradas",
      description: "Observaciones de seguridad documentadas",
      value: "42",
      trend: 5.7,
      image: "/images/metrics/observaciones.svg"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold opacity-80 text-gray-900 mb-6">Métricas de Seguridad</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            title={card.title}
            description={card.description}
            image={card.image}
            value={card.value}
            trend={card.trend}
            delay={1500 + (index * 150)} // Comienza después de la bienvenida y se escalona
          />
        ))}
      </div>
    </div>
  );
}
export default CardsSection;