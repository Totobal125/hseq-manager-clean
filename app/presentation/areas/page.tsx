"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Trash2, Plus, Search, MapPin, Users, Building } from "lucide-react";

interface Area {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  centroTrabajo: string;
  encargado: string;
  empleadosAsignados: number;
  capacidad: number;
  tipo: string;
  estado: string;
  fechaCreacion: string;
}

const centrosTrabajo = [
  "Planta Principal",
  "Centro de Distribución Norte",
  "Oficinas Centrales",
  "Taller de Mantenimiento",
  "Laboratorio Central"
];

const tiposArea = [
  "Producción",
  "Almacén",
  "Oficina",
  "Taller",
  "Laboratorio",
  "Sala de Reuniones",
  "Área de Descanso",
  "Estacionamiento"
];

const estados = ["Activa", "Inactiva", "En Mantenimiento", "En Construcción"];

export default function AreasPage() {
  const { isAuthenticated } = useAuth();
  const [areas, setAreas] = useState<Area[]>([
    {
      id: 1,
      nombre: "Área de Producción A",
      codigo: "AR001",
      descripcion: "Zona principal de producción de línea A",
      centroTrabajo: "Planta Principal",
      encargado: "Juan Carlos Pérez",
      empleadosAsignados: 45,
      capacidad: 50,
      tipo: "Producción",
      estado: "Activa",
      fechaCreacion: "2023-01-15"
    },
    {
      id: 2,
      nombre: "Almacén de Materiales",
      codigo: "AR002",
      descripcion: "Almacén principal de materias primas",
      centroTrabajo: "Planta Principal",
      encargado: "María Elena González",
      empleadosAsignados: 12,
      capacidad: 20,
      tipo: "Almacén",
      estado: "Activa",
      fechaCreacion: "2023-02-20"
    },
    {
      id: 3,
      nombre: "Oficinas Administrativas",
      codigo: "AR003",
      descripcion: "Área de oficinas para personal administrativo",
      centroTrabajo: "Oficinas Centrales",
      encargado: "Carlos Alberto López",
      empleadosAsignados: 25,
      capacidad: 30,
      tipo: "Oficina",
      estado: "Activa",
      fechaCreacion: "2023-03-10"
    },
    {
      id: 4,
      nombre: "Taller de Mantenimiento",
      codigo: "AR004",
      descripcion: "Taller para mantenimiento de equipos",
      centroTrabajo: "Taller de Mantenimiento",
      encargado: "Roberto Silva",
      empleadosAsignados: 8,
      capacidad: 15,
      tipo: "Taller",
      estado: "Activa",
      fechaCreacion: "2023-04-05"
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCentro, setFilterCentro] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    descripcion: "",
    centroTrabajo: "",
    encargado: "",
    empleadosAsignados: 0,
    capacidad: 0,
    tipo: "",
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
      codigo: "",
      descripcion: "",
      centroTrabajo: "",
      encargado: "",
      empleadosAsignados: 0,
      capacidad: 0,
      tipo: "",
      estado: "Activa"
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (area: Area) => {
    setFormData({
      nombre: area.nombre,
      codigo: area.codigo,
      descripcion: area.descripcion,
      centroTrabajo: area.centroTrabajo,
      encargado: area.encargado,
      empleadosAsignados: area.empleadosAsignados,
      capacidad: area.capacidad,
      tipo: area.tipo,
      estado: area.estado
    });
    setEditingId(area.id);
    setMostrarFormulario(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta área?")) {
      setAreas(prev => prev.filter(area => area.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setAreas(prev => prev.map(area => 
        area.id === editingId 
          ? { ...area, ...formData }
          : area
      ));
    } else {
      const newArea: Area = {
        id: Math.max(...areas.map(a => a.id)) + 1,
        ...formData,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };
      setAreas(prev => [...prev, newArea]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const filteredAreas = areas.filter(area => {
    const matchesSearch = area.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.encargado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCentro = !filterCentro || area.centroTrabajo === filterCentro;
    const matchesTipo = !filterTipo || area.tipo === filterTipo;
    const matchesEstado = !filterEstado || area.estado === filterEstado;
    
    return matchesSearch && matchesCentro && matchesTipo && matchesEstado;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Áreas</h1>
        <p className="text-gray-600">Administra las diferentes áreas dentro de los centros de trabajo</p>
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
                placeholder="Buscar áreas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={filterCentro}
                onChange={(e) => setFilterCentro(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los centros</option>
                {centrosTrabajo.map(centro => (
                  <option key={centro} value={centro}>{centro}</option>
                ))}
              </select>

              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {tiposArea.map(tipo => (
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

          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Área
          </button>
        </div>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Área" : "Agregar Nueva Área"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Área</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="AR001"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabajo</label>
                <select
                  value={formData.centroTrabajo}
                  onChange={(e) => setFormData({ ...formData, centroTrabajo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar centro</option>
                  {centrosTrabajo.map(centro => (
                    <option key={centro} value={centro}>{centro}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Área</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposArea.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Encargado</label>
                <input
                  type="text"
                  value={formData.encargado}
                  onChange={(e) => setFormData({ ...formData, encargado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
                <input
                  type="number"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empleados Asignados</label>
                <input
                  type="number"
                  value={formData.empleadosAsignados}
                  onChange={(e) => setFormData({ ...formData, empleadosAsignados: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
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
                placeholder="Describe el propósito y características del área..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro de Trabajo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Encargado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAreas.map((area) => (
                <tr key={area.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{area.nombre}</div>
                        <div className="text-sm text-gray-500">{area.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Building className="w-4 h-4 mr-1 text-gray-400" />
                      {area.centroTrabajo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-sm text-gray-900">{area.empleadosAsignados}/{area.capacidad}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {area.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {area.encargado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      area.estado === "Activa" ? "bg-green-100 text-green-800" :
                      area.estado === "Inactiva" ? "bg-red-100 text-red-800" :
                      area.estado === "En Mantenimiento" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {area.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(area)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(area.id)}
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