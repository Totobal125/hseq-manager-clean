"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Trash2, Plus, Search, Activity, Eye, Clipboard } from "lucide-react";

interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  tipoInspeccion: string;
  checklistAsociado: string;
  frecuencia: string;
  responsable: string;
  estado: string;
  fechaCreacion: string;
}

const tiposInspeccion = [
  "Inspección General de Seguridad",
  "Inspección de Equipos",
  "Inspección de Área",
  "Inspección de EPP",
  "Inspección de Procedimientos",
  "Inspección Ambiental"
];

const checklistDisponibles = [
  "Checklist Inspección General",
  "Checklist Inspección de Equipos",
  "Checklist Inspección de EPP",
  "Checklist Observación de Trabajo",
  "Checklist Inspección Ambiental"
];

const frecuencias = ["Diaria", "Semanal", "Quincenal", "Mensual", "Trimestral", "Semestral", "Anual"];
const estados = ["Activa", "Inactiva", "Pendiente"];

export default function ActividadesPage() {
  const { isAuthenticated } = useAuth();
  const [actividades, setActividades] = useState<Actividad[]>([
    {
      id: 1,
      nombre: "Inspección Diaria de Seguridad",
      descripcion: "Revisión diaria de condiciones de seguridad en planta",
      tipoInspeccion: "Inspección General de Seguridad",
      checklistAsociado: "Checklist Inspección General",
      frecuencia: "Diaria",
      responsable: "Juan Pérez",
      estado: "Activa",
      fechaCreacion: "2024-01-15"
    },
    {
      id: 2,
      nombre: "Revisión de Equipos de Protección",
      descripcion: "Verificación del estado y uso correcto de EPP",
      tipoInspeccion: "Inspección de EPP",
      checklistAsociado: "Checklist Inspección de EPP",
      frecuencia: "Semanal",
      responsable: "María González",
      estado: "Activa",
      fechaCreacion: "2024-02-20"
    },
    {
      id: 3,
      nombre: "Observación de Procedimientos",
      descripcion: "Supervisión de cumplimiento de procedimientos de trabajo seguro",
      tipoInspeccion: "Inspección de Procedimientos",
      checklistAsociado: "Checklist Observación de Trabajo",
      frecuencia: "Quincenal",
      responsable: "Carlos López",
      estado: "Activa",
      fechaCreacion: "2024-03-10"
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterFrecuencia, setFilterFrecuencia] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipoInspeccion: "",
    checklistAsociado: "",
    frecuencia: "",
    responsable: "",
    estado: "Activa"
  });

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

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      tipoInspeccion: "",
      checklistAsociado: "",
      frecuencia: "",
      responsable: "",
      estado: "Activa"
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (actividad: Actividad) => {
    setFormData({
      nombre: actividad.nombre,
      descripcion: actividad.descripcion,
      tipoInspeccion: actividad.tipoInspeccion,
      checklistAsociado: actividad.checklistAsociado,
      frecuencia: actividad.frecuencia,
      responsable: actividad.responsable,
      estado: actividad.estado
    });
    setEditingId(actividad.id);
    setMostrarFormulario(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta actividad?")) {
      setActividades(prev => prev.filter(actividad => actividad.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setActividades(prev => prev.map(actividad => 
        actividad.id === editingId 
          ? { ...actividad, ...formData }
          : actividad
      ));
    } else {
      const newActividad: Actividad = {
        id: Math.max(...actividades.map(a => a.id)) + 1,
        ...formData,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };
      setActividades(prev => [...prev, newActividad]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const filteredActividades = actividades.filter(actividad => {
    const matchesSearch = actividad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actividad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actividad.responsable.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !filterTipo || actividad.tipoInspeccion === filterTipo;
    const matchesFrecuencia = !filterFrecuencia || actividad.frecuencia === filterFrecuencia;
    const matchesEstado = !filterEstado || actividad.estado === filterEstado;
    
    return matchesSearch && matchesTipo && matchesFrecuencia && matchesEstado;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Actividades</h1>
        <p className="text-gray-600">Administra las actividades de inspección y sus checklist asociados</p>
      </div>

      {/* Controles superiores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar actividades..."
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
                {tiposInspeccion.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>

              <select
                value={filterFrecuencia}
                onChange={(e) => setFilterFrecuencia(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las frecuencias</option>
                {frecuencias.map(frecuencia => (
                  <option key={frecuencia} value={frecuencia}>{frecuencia}</option>
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

          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Actividad
          </button>
        </div>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Actividad" : "Agregar Nueva Actividad"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Actividad</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Inspección</label>
                <select
                  value={formData.tipoInspeccion}
                  onChange={(e) => setFormData({ ...formData, tipoInspeccion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposInspeccion.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Checklist Asociado</label>
                <select
                  value={formData.checklistAsociado}
                  onChange={(e) => setFormData({ ...formData, checklistAsociado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar checklist</option>
                  {checklistDisponibles.map(checklist => (
                    <option key={checklist} value={checklist}>{checklist}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                <select
                  value={formData.frecuencia}
                  onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar frecuencia</option>
                  {frecuencias.map(frecuencia => (
                    <option key={frecuencia} value={frecuencia}>{frecuencia}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <input
                  type="text"
                  value={formData.responsable}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe el propósito y alcance de la actividad..."
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {editingId ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  resetForm();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Inspección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checklist</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActividades.map((actividad) => (
                <tr key={actividad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{actividad.nombre}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{actividad.descripcion}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {actividad.tipoInspeccion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clipboard className="w-4 h-4 mr-1 text-gray-400" />
                      {actividad.checklistAsociado}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {actividad.frecuencia}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {actividad.responsable}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      actividad.estado === "Activa" ? "bg-green-100 text-green-800" :
                      actividad.estado === "Inactiva" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {actividad.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(actividad)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(actividad.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 