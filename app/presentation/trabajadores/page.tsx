"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Trash2, Plus, Search, User, Calendar, MapPin } from "lucide-react";

interface Trabajador {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  cargo: string;
  departamento: string;
  centroTrabajo: string;
  estado: string;
  fechaCreacion: string;
}

const cargos = [
  "Maestro Soldador",
  "Encargado de Área", 
  "Jefe de Mantenimiento",
  "Operador de Máquina",
  "Técnico de Calidad",
  "Auxiliar de Producción"
];

const departamentos = ["Producción", "Mantenimiento", "Calidad", "Logística", "Administración"];
const centrosTrabajo = ["Planta A", "Planta B", "Oficinas Centrales", "Almacén"];
const estados = ["Activo", "Inactivo", "Vacaciones", "Licencia"];

export default function TrabajadoresPage() {
  const { isAuthenticated } = useAuth();
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([
    {
      id: 1,
      rut: "18652129-3",
      nombre: "Juan",
      apellido: "Molina",
      email: "juan.molina@empresa.com",
      telefono: "+56 9 1234 5678",
      fechaNacimiento: "1990-05-15",
      fechaIngreso: "2020-03-01",
      cargo: "Maestro Soldador",
      departamento: "Producción",
      centroTrabajo: "Planta A",
      estado: "Activo",
      fechaCreacion: "2024-01-15"
    },
    {
      id: 2,
      rut: "19616321-2",
      nombre: "María",
      apellido: "Soledad",
      email: "maria.soledad@empresa.com",
      telefono: "+56 9 2345 6789",
      fechaNacimiento: "1985-08-22",
      fechaIngreso: "2019-07-15",
      cargo: "Encargado de Área",
      departamento: "Producción",
      centroTrabajo: "Planta A",
      estado: "Activo",
      fechaCreacion: "2024-02-20"
    },
    {
      id: 3,
      rut: "10049166-4",
      nombre: "Hernán",
      apellido: "Fernández",
      email: "hernan.fernandez@empresa.com",
      telefono: "+56 9 3456 7890",
      fechaNacimiento: "1988-12-10",
      fechaIngreso: "2021-01-10",
      cargo: "Jefe de Mantenimiento",
      departamento: "Mantenimiento",
      centroTrabajo: "Planta B",
      estado: "Activo",
      fechaCreacion: "2024-03-10"
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCargo, setFilterCargo] = useState("");
  const [filterDepartamento, setFilterDepartamento] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    fechaIngreso: "",
    cargo: "",
    departamento: "",
    centroTrabajo: "",
    estado: "Activo"
  });

  // Verificar si es prevencionista (simulado)
  const isPrevencionista = true; // En producción esto vendría del contexto de auth

  if (!isAuthenticated || !isPrevencionista) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      rut: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      fechaNacimiento: "",
      fechaIngreso: "",
      cargo: "",
      departamento: "",
      centroTrabajo: "",
      estado: "Activo"
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (trabajador: Trabajador) => {
    setFormData({
      rut: trabajador.rut,
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      email: trabajador.email,
      telefono: trabajador.telefono,
      fechaNacimiento: trabajador.fechaNacimiento,
      fechaIngreso: trabajador.fechaIngreso,
      cargo: trabajador.cargo,
      departamento: trabajador.departamento,
      centroTrabajo: trabajador.centroTrabajo,
      estado: trabajador.estado
    });
    setEditingId(trabajador.id);
    setMostrarFormulario(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este trabajador?")) {
      setTrabajadores(prev => prev.filter(trabajador => trabajador.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setTrabajadores(prev => prev.map(trabajador => 
        trabajador.id === editingId 
          ? { ...trabajador, ...formData }
          : trabajador
      ));
    } else {
      const newTrabajador: Trabajador = {
        id: Math.max(...trabajadores.map(t => t.id)) + 1,
        ...formData,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };
      setTrabajadores(prev => [...prev, newTrabajador]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const filteredTrabajadores = trabajadores.filter(trabajador => {
    const fullName = `${trabajador.nombre} ${trabajador.apellido}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         trabajador.rut.includes(searchTerm) ||
                         trabajador.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCargo = !filterCargo || trabajador.cargo === filterCargo;
    const matchesDepartamento = !filterDepartamento || trabajador.departamento === filterDepartamento;
    const matchesEstado = !filterEstado || trabajador.estado === filterEstado;
    
    return matchesSearch && matchesCargo && matchesDepartamento && matchesEstado;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Trabajadores</h1>
        <p className="text-gray-600">Administra los trabajadores y sus datos personales</p>
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
                placeholder="Buscar por nombre, RUT o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={filterCargo}
                onChange={(e) => setFilterCargo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los cargos</option>
                {cargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>

              <select
                value={filterDepartamento}
                onChange={(e) => setFilterDepartamento(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los departamentos</option>
                {departamentos.map(depto => (
                  <option key={depto} value={depto}>{depto}</option>
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
            Agregar Trabajador
          </button>
        </div>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Trabajador" : "Agregar Nuevo Trabajador"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                <input
                  type="text"
                  value={formData.rut}
                  onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12345678-9"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                <input
                  type="date"
                  value={formData.fechaIngreso}
                  onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <select
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar cargo</option>
                  {cargos.map(cargo => (
                    <option key={cargo} value={cargo}>{cargo}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                <select
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  {departamentos.map(depto => (
                    <option key={depto} value={depto}>{depto}</option>
                  ))}
                </select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trabajador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
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
                        <div className="text-sm font-medium text-gray-900">
                          {trabajador.nombre} {trabajador.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          Ingreso: {trabajador.fechaIngreso}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{trabajador.rut}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{trabajador.email}</div>
                    <div className="text-sm text-gray-500">{trabajador.telefono}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {trabajador.cargo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {trabajador.departamento}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {trabajador.centroTrabajo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      trabajador.estado === "Activo" ? "bg-green-100 text-green-800" :
                      trabajador.estado === "Inactivo" ? "bg-red-100 text-red-800" :
                      trabajador.estado === "Vacaciones" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {trabajador.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(trabajador)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(trabajador.id)}
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