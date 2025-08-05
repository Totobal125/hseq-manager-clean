"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, X, Edit } from "lucide-react";

interface TipoEmpresa {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface Empresa {
  id: number;
  nombre: string;
  razonSocial: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  tipoEmpresaId: number;
  tipoEmpresa?: TipoEmpresa;
  activo: boolean;
  fechaCreacion: string;
  selected: boolean;
}

const useEmpresasManager = () => {
  // Datos simulados de tipos de empresas
  const [tiposEmpresas] = useState<TipoEmpresa[]>([
    { id: 1, nombre: "Empresa Industrial", descripcion: "Empresas del sector industrial", activo: true },
    { id: 2, nombre: "Empresa Comercial", descripcion: "Empresas del sector comercial", activo: true },
    { id: 3, nombre: "Empresa de Servicios", descripcion: "Empresas del sector servicios", activo: true },
  ]);

  const [empresas, setEmpresas] = useState<Empresa[]>([
    {
      id: 1,
      nombre: "TechCorp S.A.",
      razonSocial: "TechCorp Sociedad Anónima",
      ruc: "20123456789",
      direccion: "Av. Principal 123, Lima",
      telefono: "+51 1 234-5678",
      email: "contacto@techcorp.com",
      tipoEmpresaId: 1,
      activo: true,
      fechaCreacion: "2024-01-15",
      selected: false
    },
    {
      id: 2,
      nombre: "Comercial ABC",
      razonSocial: "Comercial ABC E.I.R.L.",
      ruc: "20123456790",
      direccion: "Jr. Comercial 456, Arequipa",
      telefono: "+51 54 987-6543",
      email: "info@comercialabc.com",
      tipoEmpresaId: 2,
      activo: true,
      fechaCreacion: "2024-02-20",
      selected: false
    }
  ]);
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  
  const [formData, setFormData] = useState({
    nombre: "",
    razonSocial: "",
    ruc: "",
    direccion: "",
    telefono: "",
    email: "",
    tipoEmpresaId: 1,
    activo: true
  });

  const getTipoEmpresa = (tipoId: number) => {
    return tiposEmpresas.find(tipo => tipo.id === tipoId);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      razonSocial: "",
      ruc: "",
      direccion: "",
      telefono: "",
      email: "",
      tipoEmpresaId: 1,
      activo: true
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (empresa: Empresa) => {
    setFormData({
      nombre: empresa.nombre,
      razonSocial: empresa.razonSocial,
      ruc: empresa.ruc,
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      email: empresa.email,
      tipoEmpresaId: empresa.tipoEmpresaId,
      activo: empresa.activo
    });
    setEditingId(empresa.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (editingId) {
      setEmpresas(prev => prev.map(empresa =>
        empresa.id === editingId
          ? { ...empresa, ...formData }
          : empresa
      ));
    } else {
      const newEmpresa: Empresa = {
        id: Math.max(...empresas.map(e => e.id)) + 1,
        ...formData,
        fechaCreacion: new Date().toISOString().split('T')[0],
        selected: false
      };
      setEmpresas(prev => [...prev, newEmpresa]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      setEmpresas(prev => prev.filter(empresa => empresa.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setEmpresas(prev => prev.map(empresa =>
      empresa.id === id ? { ...empresa, selected: !empresa.selected } : empresa
    ));
  };

  const deleteSelected = () => {
    const selectedCount = empresas.filter(empresa => empresa.selected).length;
    if (selectedCount > 0 && window.confirm(`¿Eliminar ${selectedCount} empresa(s) seleccionada(s)?`)) {
      setEmpresas(prev => prev.filter(empresa => !empresa.selected));
    }
  };

  return {
    empresas,
    setEmpresas,
    tiposEmpresas,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    filterEstado,
    setFilterEstado,
    formData,
    setFormData,
    getTipoEmpresa,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected
  };
};

const EmpresasManager = () => {
  const {
    empresas,
    setEmpresas,
    tiposEmpresas,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    filterEstado,
    setFilterEstado,
    formData,
    setFormData,
    getTipoEmpresa,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected
  } = useEmpresasManager();

  const filteredEmpresas = useMemo(() => {
    return empresas.filter(empresa => {
      const matchesSearch = empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          empresa.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          empresa.ruc.includes(searchTerm) ||
                          empresa.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = !filterTipo || empresa.tipoEmpresaId === parseInt(filterTipo);
      const matchesEstado = !filterEstado || 
                          (filterEstado === 'activa' && empresa.activo) ||
                          (filterEstado === 'inactiva' && !empresa.activo);
      
      return matchesSearch && matchesTipo && matchesEstado;
    });
  }, [empresas, searchTerm, filterTipo, filterEstado]);

  const selectedCount = useMemo(() => {
    return empresas.filter(empresa => empresa.selected).length;
  }, [empresas]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Empresas</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Nueva Empresa
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between mb-6">
            <div className="flex flex-col gap-4 w-full xl:w-auto">
              {/* Buscador */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar empresas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los tipos</option>
                  {tiposEmpresas.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </select>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
              {selectedCount > 0 && (
                <button
                  onClick={deleteSelected}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Eliminar ({selectedCount})
                </button>
              )}
            </div>
          </div>

          {/* Formulario */}
          {mostrarFormulario && (
            <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Editar Empresa" : "Nueva Empresa"}
                </h2>
                <button
                  onClick={() => {
                    setMostrarFormulario(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                  <input
                    type="text"
                    value={formData.razonSocial}
                    onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
                  <input
                    type="text"
                    value={formData.ruc}
                    onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={11}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Empresa</label>
                  <select
                    value={formData.tipoEmpresaId}
                    onChange={(e) => setFormData({...formData, tipoEmpresaId: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {tiposEmpresas.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.activo ? "activa" : "inactiva"}
                    onChange={(e) => setFormData({...formData, activo: e.target.value === "activa"})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  {editingId ? "Actualizar" : "Crear"}
                </button>
                <button
                  onClick={() => {
                    setMostrarFormulario(false);
                    resetForm();
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedCount === empresas.length && empresas.length > 0}
                      onChange={(e) => {
                        setEmpresas(prev => prev.map(empresa => ({ ...empresa, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RUC
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmpresas.map((empresa) => (
                  <tr key={empresa.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={empresa.selected}
                        onChange={() => toggleSelect(empresa.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {empresa.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{empresa.nombre}</div>
                        <div className="text-sm text-gray-500">{empresa.razonSocial}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {empresa.ruc}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTipoEmpresa(empresa.tipoEmpresaId)?.nombre}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{empresa.telefono}</div>
                      <div className="text-sm text-gray-500">{empresa.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        empresa.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {empresa.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(empresa)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(empresa.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
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
    </div>
  );
};

export default function EmpresasPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Verificar si es superusuario (simulado)
  const isSuperUser = true; // Esto se debería verificar con el backend

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    router.push("/presentation/login");
    return null;
  }

  if (!isSuperUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return <EmpresasManager />;
} 