"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Search, User, FileText, Calendar, Download, AlertCircle } from "lucide-react";

interface Trabajador {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  cargo: string;
  departamento: string;
  fechaIngreso: string;
  documentos: Documento[];
}

interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
  estado: string;
  descripcion: string;
}

const tiposDocumento = [
  "Contrato de Trabajo",
  "Carnet de Identidad",
  "Certificado de Estudios",
  "Certificado de Capacitación",
  "Examen Preocupacional",
  "Examen de Salud Ocupacional",
  "Certificado de Antecedentes",
  "Certificado de AFP",
  "Certificado de Isapre/Fonasa",
  "Certificado de Seguro de Accidentes",
  "Certificado de EPP",
  "Otros"
];

const estados = ["Vigente", "Vencido", "Pendiente", "En Revisión"];

export default function DocumentacionPage() {
  const { isAuthenticated } = useAuth();
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([
    {
      id: 1,
      nombre: "Juan Carlos",
      apellido: "Pérez",
      rut: "18652129-3",
      cargo: "Maestro Soldador",
      departamento: "Producción",
      fechaIngreso: "2020-03-15",
      documentos: [
        {
          id: 1,
          nombre: "Contrato Indefinido",
          tipo: "Contrato de Trabajo",
          fechaCreacion: "2020-03-15",
          estado: "Vigente",
          descripcion: "Contrato de trabajo indefinido firmado"
        },
        {
          id: 2,
          nombre: "Examen Preocupacional",
          tipo: "Examen Preocupacional",
          fechaCreacion: "2020-03-10",
          estado: "Vigente",
          descripcion: "Examen médico preocupacional completo"
        },
        {
          id: 3,
          nombre: "Certificado EPP",
          tipo: "Certificado de EPP",
          fechaCreacion: "2024-01-15",
          estado: "Vigente",
          descripcion: "Certificado de entrega de equipos de protección personal"
        }
      ]
    },
    {
      id: 2,
      nombre: "María Elena",
      apellido: "González",
      rut: "19616321-2",
      cargo: "Encargada de Área Producción",
      departamento: "Producción",
      fechaIngreso: "2019-08-20",
      documentos: [
        {
          id: 4,
          nombre: "Contrato Indefinido",
          tipo: "Contrato de Trabajo",
          fechaCreacion: "2019-08-20",
          estado: "Vigente",
          descripcion: "Contrato de trabajo indefinido firmado"
        },
        {
          id: 5,
          nombre: "Certificado de Capacitación",
          tipo: "Certificado de Capacitación",
          fechaCreacion: "2023-11-10",
          estado: "Vigente",
          descripcion: "Certificado de capacitación en seguridad industrial"
        },
        {
          id: 6,
          nombre: "Examen de Salud Ocupacional",
          tipo: "Examen de Salud Ocupacional",
          fechaCreacion: "2024-02-15",
          estado: "Vigente",
          descripcion: "Examen de salud ocupacional anual"
        }
      ]
    },
    {
      id: 3,
      nombre: "Carlos Alberto",
      apellido: "López",
      rut: "10049166-4",
      cargo: "Jefe de Área Producción",
      departamento: "Producción",
      fechaIngreso: "2018-05-10",
      documentos: [
        {
          id: 7,
          nombre: "Contrato Indefinido",
          tipo: "Contrato de Trabajo",
          fechaCreacion: "2018-05-10",
          estado: "Vigente",
          descripcion: "Contrato de trabajo indefinido firmado"
        },
        {
          id: 8,
          nombre: "Certificado de Estudios",
          tipo: "Certificado de Estudios",
          fechaCreacion: "2018-05-10",
          estado: "Vigente",
          descripcion: "Certificado de título profesional"
        },
        {
          id: 9,
          nombre: "Certificado de Antecedentes",
          tipo: "Certificado de Antecedentes",
          fechaCreacion: "2024-01-20",
          estado: "Vigente",
          descripcion: "Certificado de antecedentes penales vigente"
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const filteredTrabajadores = trabajadores.filter(trabajador => {
    const matchesSearch = trabajador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trabajador.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trabajador.rut.includes(searchTerm) ||
                         trabajador.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterTipo || filterEstado) {
      const documentosFiltrados = trabajador.documentos.filter(doc => {
        const matchesTipo = !filterTipo || doc.tipo === filterTipo;
        const matchesEstado = !filterEstado || doc.estado === filterEstado;
        return matchesTipo && matchesEstado;
      });
      return matchesSearch && documentosFiltrados.length > 0;
    }
    
    return matchesSearch;
  });

  const handleVerDocumentos = (trabajador: Trabajador) => {
    setSelectedTrabajador(trabajador);
  };

  const handleCerrarDocumentos = () => {
    setSelectedTrabajador(null);
  };

  const handleDescargar = (documento: Documento) => {
    alert("Función de descarga no disponible. Requiere implementación de base de datos.");
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Documentación de Trabajadores</h1>
        <p className="text-gray-600">Gestiona y visualiza la documentación de todos los trabajadores</p>
      </div>

      {/* Alerta de implementación */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Función de Descarga No Disponible</h3>
            <p className="text-sm text-yellow-700 mt-1">
              La funcionalidad de descarga de documentos requiere la implementación de la base de datos. 
              Por el momento solo se puede visualizar la información.
            </p>
          </div>
        </div>
      </div>

      {/* Controles superiores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar trabajadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {tiposDocumento.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>

              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Trabajadores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trabajador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ingreso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documentos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrabajadores.map((trabajador) => (
                <tr key={trabajador.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{trabajador.nombre} {trabajador.apellido}</div>
                        <div className="text-sm text-gray-500">{trabajador.rut}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trabajador.cargo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trabajador.departamento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(trabajador.fechaIngreso).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-sm text-gray-900">{trabajador.documentos.length} documentos</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleVerDocumentos(trabajador)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                    >
                      Ver Documentos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Documentos */}
      {selectedTrabajador && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Documentos de {selectedTrabajador.nombre} {selectedTrabajador.apellido}
                </h3>
                <button
                  onClick={handleCerrarDocumentos}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedTrabajador.documentos.map((documento) => (
                  <div key={documento.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <FileText className="w-4 h-4 mr-2 text-blue-500" />
                          <h4 className="text-sm font-medium text-gray-900">{documento.nombre}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Tipo:</span> {documento.tipo}
                          </div>
                          <div>
                            <span className="font-medium">Estado:</span>
                            <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              documento.estado === "Vigente" ? "bg-green-100 text-green-800" :
                              documento.estado === "Vencido" ? "bg-red-100 text-red-800" :
                              documento.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {documento.estado}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Fecha:</span> {new Date(documento.fechaCreacion).toLocaleDateString('es-CL')}
                          </div>
                          <div>
                            <span className="font-medium">Descripción:</span> {documento.descripcion}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleDescargar(documento)}
                          className="flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled
                          title="Descarga no disponible"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCerrarDocumentos}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 