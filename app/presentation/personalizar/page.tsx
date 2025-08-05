"use client";
import React from 'react';
import { Settings, Users, Shield, AlertTriangle, FileText, Target, Database, Cog } from 'lucide-react';
import ErrorBoundary from "../components/ErrorBoundary";

const configuraciones = [
  {
    id: 'causas-basicas',
    titulo: 'Causas Básicas',
    descripcion: 'Gestionar las causas básicas para el análisis causal de incidentes',
    icono: Database,
    color: 'bg-blue-500',
    ruta: '/presentation/personalizar/causas-basicas',
    categoria: 'Análisis Causal'
  },
  {
    id: 'acciones-subestandares',
    titulo: 'Acciones Subestandares',
    descripcion: 'Configurar las acciones subestandares para el análisis de incidentes',
    icono: AlertTriangle,
    color: 'bg-red-500',
    ruta: '/presentation/personalizar/acciones-subestandares',
    categoria: 'Análisis Causal'
  },
  {
    id: 'condiciones-subestandares',
    titulo: 'Condiciones Subestandares',
    descripcion: 'Gestionar las condiciones subestandares para el análisis causal',
    icono: Shield,
    color: 'bg-green-500',
    ruta: '/presentation/personalizar/condiciones-subestandares',
    categoria: 'Análisis Causal'
  },
  {
    id: 'falta-control',
    titulo: 'Falta de Control',
    descripcion: 'Configurar los tipos de falta de control para incidentes',
    icono: Target,
    color: 'bg-purple-500',
    ruta: '/presentation/personalizar/falta-control',
    categoria: 'Análisis Causal'
  },
  {
    id: 'tipos-incidente',
    titulo: 'Tipos de Incidente',
    descripcion: 'Gestionar los tipos de incidentes disponibles',
    icono: FileText,
    color: 'bg-orange-500',
    ruta: '/presentation/personalizar/tipos-incidente',
    categoria: 'Gestión'
  },
  {
    id: 'areas-centros',
    titulo: 'Áreas y Centros',
    descripcion: 'Configurar áreas y centros de trabajo',
    icono: Cog,
    color: 'bg-indigo-500',
    ruta: '/presentation/personalizar/areas-centros',
    categoria: 'Gestión'
  },
  {
    id: 'trabajadores',
    titulo: 'Trabajadores',
    descripcion: 'Gestionar la base de datos de trabajadores',
    icono: Users,
    color: 'bg-teal-500',
    ruta: '/presentation/personalizar/trabajadores',
    categoria: 'Gestión'
  }
];

const PersonalizarPage = () => {
  const categorias = [...new Set(configuraciones.map(config => config.categoria))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Personalizar Sistema</h1>
              <p className="text-gray-600">Configura y personaliza todos los aspectos del sistema HSEQ</p>
            </div>
          </div>
        </div>

        {/* Configuraciones por categoría */}
        <div className="space-y-8">
          {categorias.map(categoria => (
            <div key={categoria}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                {categoria}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {configuraciones
                  .filter(config => config.categoria === categoria)
                  .map(config => (
                    <div
                      key={config.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => window.location.href = config.ruta}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${config.color} text-white`}>
                          <config.icono className="w-6 h-6" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {config.titulo}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {config.descripcion}
                      </p>
                      
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                        Configurar
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Información sobre Personalización</h3>
              <p className="text-blue-700 text-sm mb-3">
                Estas configuraciones te permiten adaptar el sistema a las necesidades específicas de tu organización. 
                Los cambios realizados aquí se reflejarán en todos los módulos correspondientes.
              </p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• <strong>Análisis Causal:</strong> Configura los elementos para el análisis de incidentes</li>
                <li>• <strong>Gestión:</strong> Personaliza los datos maestros del sistema</li>
                <li>• Todos los cambios se guardan automáticamente</li>
                <li>• Las configuraciones son globales para toda la aplicación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PersonalizarPageWrapper() {
  return (
    <ErrorBoundary>
      <PersonalizarPage />
    </ErrorBoundary>
  );
} 