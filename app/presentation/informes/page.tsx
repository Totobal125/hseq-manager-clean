"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { FileText, Download, Users, GraduationCap, Calendar, Search, Filter, User, MapPin } from "lucide-react";

interface Trabajador {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  cargo: string;
  centroTrabajo: string;
  area: string;
}

interface Capacitacion {
  id: number;
  titulo: string;
  tipo: string;
  capacitador: string;
  fecha: string;
  hora: string;
  tiempo: string;
  trabajadores: number[];
}

interface InformeCapacitacion {
  trabajador: Trabajador;
  capacitaciones: Capacitacion[];
}

const centrosTrabajo = [
  "Todos",
  "Planta A",
  "Planta B",
  "Centro de Distribución Norte",
  "Oficinas Centrales"
];

const areas = [
  "Todos",
  "Bodega",
  "Zona Norte",
  "Producción",
  "Mantenimiento",
  "Calidad",
  "Administración"
];

const trabajadores = [
  { id: 1, nombre: "Juan", apellido: "Molina", rut: "18652129-3", cargo: "Maestro Soldador", centroTrabajo: "Planta A", area: "Producción" },
  { id: 2, nombre: "Maria", apellido: "Soledad", rut: "19616321-2", cargo: "Encargada de Área", centroTrabajo: "Planta B", area: "Calidad" },
  { id: 3, nombre: "Hernan", apellido: "Fernandez", rut: "10049166-4", cargo: "Jefe de Área", centroTrabajo: "Planta A", area: "Mantenimiento" }
];

const tiposCapacitacion = [
  "Charla Asistente Social",
  "Curso",
  "Charlas de 5 min",
  "Alertas",
  "Inducción"
];

const capacitaciones = [
  {
    id: 1,
    titulo: "Seguridad en Alturas",
    tipo: "Curso",
    capacitador: "Juan Valdéz",
    fecha: "2024-03-15",
    hora: "09:00",
    tiempo: "4 horas",
    trabajadores: [1, 3]
  },
  {
    id: 2,
    titulo: "Inducción General de Seguridad",
    tipo: "Inducción",
    capacitador: "María Fernandez",
    fecha: "2024-03-10",
    hora: "14:00",
    tiempo: "2 horas",
    trabajadores: [2]
  },
  {
    id: 3,
    titulo: "Uso de EPP",
    tipo: "Charlas de 5 min",
    capacitador: "Juan Valdéz",
    fecha: "2024-02-28",
    hora: "08:30",
    tiempo: "30 minutos",
    trabajadores: [1, 2, 3]
  },
  {
    id: 4,
    titulo: "Procedimientos de Emergencia",
    tipo: "Alertas",
    capacitador: "María Fernandez",
    fecha: "2024-02-20",
    hora: "10:00",
    tiempo: "1 hora",
    trabajadores: [1, 2]
  }
];

export default function InformesPage() {
  const { isAuthenticated } = useAuth();
  const [tipoInforme, setTipoInforme] = useState<"trabajadores" | "capacitaciones" | null>(null);
  const [mostrarInforme, setMostrarInforme] = useState(false);
  
  // Filtros para informe de trabajadores
  const [filtroCentro, setFiltroCentro] = useState("Todos");
  const [filtroArea, setFiltroArea] = useState("Todos");
  const [trabajadoresSeleccionados, setTrabajadoresSeleccionados] = useState<number[]>([]);
  const [capacitacionesSeleccionadas, setCapacitacionesSeleccionadas] = useState<string[]>([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

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

  const handleTrabajadorChange = (trabajadorId: number, checked: boolean) => {
    if (checked) {
      setTrabajadoresSeleccionados(prev => [...prev, trabajadorId]);
    } else {
      setTrabajadoresSeleccionados(prev => prev.filter(id => id !== trabajadorId));
    }
  };

  const handleCapacitacionChange = (tipo: string, checked: boolean) => {
    if (checked) {
      setCapacitacionesSeleccionadas(prev => [...prev, tipo]);
    } else {
      setCapacitacionesSeleccionadas(prev => prev.filter(t => t !== tipo));
    }
  };

  const handleVerInforme = () => {
    setMostrarInforme(true);
  };

  const handleDescargarPDF = () => {
    alert("Función de descarga PDF no disponible. Requiere implementación de generación de PDF.");
  };

  const trabajadoresFiltrados = trabajadores.filter(trabajador => {
    const matchesCentro = filtroCentro === "Todos" || trabajador.centroTrabajo === filtroCentro;
    const matchesArea = filtroArea === "Todos" || trabajador.area === filtroArea;
    return matchesCentro && matchesArea;
  });

  const generarInforme = (): InformeCapacitacion[] => {
    const informes: InformeCapacitacion[] = [];
    
    trabajadoresSeleccionados.forEach(trabajadorId => {
      const trabajador = trabajadores.find(t => t.id === trabajadorId);
      if (trabajador) {
        const capacitacionesTrabajador = capacitaciones.filter(cap => {
          const participa = cap.trabajadores.includes(trabajadorId);
          const tipoSeleccionado = capacitacionesSeleccionadas.length === 0 || capacitacionesSeleccionadas.includes(cap.tipo);
          const fechaValida = (!fechaDesde || cap.fecha >= fechaDesde) && (!fechaHasta || cap.fecha <= fechaHasta);
          
          return participa && tipoSeleccionado && fechaValida;
        });

        if (capacitacionesTrabajador.length > 0) {
          informes.push({
            trabajador,
            capacitaciones: capacitacionesTrabajador
          });
        }
      }
    });

    return informes;
  };

  const informesGenerados = mostrarInforme ? generarInforme() : [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Informes de Capacitación</h1>
        <p className="text-gray-600">Genera informes detallados de capacitaciones por trabajador</p>
      </div>

      {!tipoInforme && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Selecciona el tipo de informe</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setTipoInforme("trabajadores")}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-colors"
            >
              <Users className="w-6 h-6" />
              <span className="text-lg font-medium">Informe por Trabajadores</span>
            </button>
            
            <button
              onClick={() => setTipoInforme("capacitaciones")}
              className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-colors"
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-lg font-medium">Informe por Capacitaciones</span>
            </button>
          </div>
        </div>
      )}

      {tipoInforme === "trabajadores" && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Filtros del Informe</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabajo</label>
                <select
                  value={filtroCentro}
                  onChange={(e) => setFiltroCentro(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {centrosTrabajo.map(centro => (
                    <option key={centro} value={centro}>{centro}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <select
                  value={filtroArea}
                  onChange={(e) => setFiltroArea(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Selección de Trabajadores */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Seleccionar Trabajadores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {trabajadoresFiltrados.map(trabajador => (
                  <label key={trabajador.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={trabajadoresSeleccionados.includes(trabajador.id)}
                      onChange={(e) => handleTrabajadorChange(trabajador.id, e.target.checked)}
                      className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{trabajador.nombre} {trabajador.apellido}</div>
                      <div className="text-sm text-gray-500">{trabajador.cargo}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Selección de Capacitaciones */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Seleccionar Capacitaciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tiposCapacitacion.map(tipo => (
                  <label key={tipo} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={capacitacionesSeleccionadas.includes(tipo)}
                      onChange={(e) => handleCapacitacionChange(tipo, e.target.checked)}
                      className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerInforme}
                disabled={trabajadoresSeleccionados.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Ver Informe
              </button>
              
              <button
                onClick={() => {
                  setTipoInforme(null);
                  setMostrarInforme(false);
                  setTrabajadoresSeleccionados([]);
                  setCapacitacionesSeleccionadas([]);
                  setFiltroCentro("Todos");
                  setFiltroArea("Todos");
                  setFechaDesde("");
                  setFechaHasta("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
              >
                Volver
              </button>
            </div>
          </div>

          {/* Informe Generado */}
          {mostrarInforme && informesGenerados.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Informe de Capacitaciones</h2>
                <button
                  onClick={handleDescargarPDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </button>
              </div>

              <div className="space-y-8">
                {informesGenerados.map((informe) => (
                  <div key={informe.trabajador.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {informe.trabajador.nombre} {informe.trabajador.apellido}
                        </h3>
                        <p className="text-gray-600">RUT: {informe.trabajador.rut}</p>
                        <p className="text-gray-600">Cargo: {informe.trabajador.cargo}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {informe.trabajador.centroTrabajo} - {informe.trabajador.area}
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título de Capacitación</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacitador</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firma</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {informe.capacitaciones.map((capacitacion) => (
                            <tr key={capacitacion.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {capacitacion.titulo}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {capacitacion.capacitador}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                  {new Date(capacitacion.fecha).toLocaleDateString('es-CL')} {capacitacion.hora}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {capacitacion.tiempo}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="w-20 h-8 border-2 border-dashed border-gray-300 rounded"></div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mostrarInforme && informesGenerados.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                <p className="text-gray-600">No hay capacitaciones que coincidan con los filtros seleccionados.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {tipoInforme === "capacitaciones" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Informe por Capacitaciones</h3>
            <p className="text-gray-600 mb-4">Esta funcionalidad estará disponible próximamente.</p>
            <button
              onClick={() => setTipoInforme(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 