"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Trash2, Plus, Search, User, MapPin, Phone, Mail } from "lucide-react";

interface Encargado {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
  telefono: string;
  areaAsignada: string;
  cargo: string;
  fechaAsignacion: string;
  estado: string;
  experiencia: string;
}

const areas = [
  "Producción",
  "Mantenimiento",
  "Calidad",
  "Logística",
  "Seguridad",
  "Administración",
  "Recursos Humanos",
  "Tecnología"
];

const cargos = [
  "Jefe de Área",
  "Supervisor",
  "Encargado",
  "Coordinador",
  "Líder de Equipo"
];

const estados = ["Activo", "Inactivo", "Vacaciones", "Licencia"];

export default function EncargadosPage() {
  const { isAuthenticated } = useAuth();
  const [encargados, setEncargados] = useState<Encargado[]>([
    {
      id: 1,
      nombre: "Juan Carlos",
      apellido: "Pérez",
      rut: "18652129-3",
      email: "juan.perez@empresa.com",
      telefono: "+56 9 1234 5678",
      areaAsignada: "Producción",
      cargo: "Jefe de Área",
      fechaAsignacion: "2023-01-15",
      estado: "Activo",
      experiencia: "8 años"
    },
    {
      id: 2,
      nombre: "María Elena",
      apellido: "González",
      rut: "19616321-2",
      email: "maria.gonzalez@empresa.com",
      telefono: "+56 9 2345 6789",
      areaAsignada: "Mantenimiento",
      cargo: "Supervisor",
      fechaAsignacion: "2023-03-20",
      estado: "Activo",
      experiencia: "5 años"
    },
    {
      id: 3,
      nombre: "Carlos Alberto",
      apellido: "López",
      rut: "10049166-4",
      email: "carlos.lopez@empresa.com",
      telefono: "+56 9 3456 7890",
      areaAsignada: "Calidad",
      cargo: "Encargado",
      fechaAsignacion: "2023-06-10",
      estado: "Activo",
      experiencia: "6 años"
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterCargo, setFilterCargo] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    telefono: "",
    areaAsignada: "",
    cargo: "",
    estado: "Activo",
    experiencia: ""
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
      apellido: "",
      rut: "",
      email: "",
      telefono: "",
      areaAsignada: "",
      cargo: "",
      estado: "Activo",
      experiencia: ""
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (encargado: Encargado) => {
    setFormData({
      nombre: encargado.nombre,
      apellido: encargado.apellido,
      rut: encargado.rut,
      email: encargado.email,
      telefono: encargado.telefono,
      areaAsignada: encargado.areaAsignada,
      cargo: encargado.cargo,
      estado: encargado.estado,
      experiencia: encargado.experiencia
    });
    setEditingId(encargado.id);
    setMostrarFormulario(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este encargado?")) {
      setEncargados(prev => prev.filter(encargado => encargado.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setEncargados(prev => prev.map(encargado => 
        encargado.id === editingId 
          ? { ...encargado, ...formData }
          : encargado
      ));
    } else {
      const newEncargado: Encargado = {
        id: Math.max(...encargados.map(e => e.id)) + 1,
        ...formData,
        fechaAsignacion: new Date().toISOString().split('T')[0]
      };
      setEncargados(prev => [...prev, newEncargado]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const filteredEncargados = encargados.filter(encargado => {
    const matchesSearch = encargado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         encargado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         encargado.rut.includes(searchTerm) ||
                         encargado.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = !filterArea || encargado.areaAsignada === filterArea;
    const matchesCargo = !filterCargo || encargado.cargo === filterCargo;
    const matchesEstado = !filterEstado || encargado.estado === filterEstado;
    
    return matchesSearch && matchesArea && matchesCargo && matchesEstado;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Encargados de Área</h1>
        <p className="text-gray-600">Gestiona los encargados y supervisores de cada área de la empresa</p>
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
                placeholder="Buscar encargados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las áreas</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>

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
            Agregar Encargado
          </button>
        </div>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Encargado" : "Agregar Nuevo Encargado"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Área Asignada</label>
                <select
                  value={formData.areaAsignada}
                  onChange={(e) => setFormData({ ...formData, areaAsignada: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar área</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia</label>
                <input
                  type="text"
                  value={formData.experiencia}
                  onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5 años"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Encargado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experiencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEncargados.map((encargado) => (
                <tr key={encargado.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{encargado.nombre} {encargado.apellido}</div>
                        <div className="text-sm text-gray-500">{encargado.rut}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {encargado.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {encargado.telefono}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {encargado.areaAsignada}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {encargado.cargo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {encargado.experiencia}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      encargado.estado === "Activo" ? "bg-green-100 text-green-800" :
                      encargado.estado === "Inactivo" ? "bg-red-100 text-red-800" :
                      encargado.estado === "Vacaciones" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {encargado.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(encargado)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(encargado.id)}
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