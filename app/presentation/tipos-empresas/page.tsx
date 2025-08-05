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
  selected: boolean;
}

const useTiposEmpresasManager = () => {
  const [tiposEmpresas, setTiposEmpresas] = useState<TipoEmpresa[]>([
    { id: 1, nombre: "Empresa Industrial", descripcion: "Empresas del sector industrial", activo: true, selected: false },
    { id: 2, nombre: "Empresa Comercial", descripcion: "Empresas del sector comercial", activo: true, selected: false },
    { id: 3, nombre: "Empresa de Servicios", descripcion: "Empresas del sector servicios", activo: true, selected: false },
  ]);
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    activo: true
  });

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      activo: true
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (tipo: TipoEmpresa) => {
    setFormData({
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      activo: tipo.activo
    });
    setEditingId(tipo.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (editingId) {
      setTiposEmpresas(prev => prev.map(tipo =>
        tipo.id === editingId
          ? { ...tipo, ...formData }
          : tipo
      ));
    } else {
      const newTipo: TipoEmpresa = {
        id: Math.max(...tiposEmpresas.map(t => t.id)) + 1,
        ...formData,
        selected: false
      };
      setTiposEmpresas(prev => [...prev, newTipo]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de empresa?')) {
      setTiposEmpresas(prev => prev.filter(tipo => tipo.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setTiposEmpresas(prev => prev.map(tipo =>
      tipo.id === id ? { ...tipo, selected: !tipo.selected } : tipo
    ));
  };

  const deleteSelected = () => {
    const selectedCount = tiposEmpresas.filter(tipo => tipo.selected).length;
    if (selectedCount > 0 && window.confirm(`¿Eliminar ${selectedCount} tipo(s) seleccionado(s)?`)) {
      setTiposEmpresas(prev => prev.filter(tipo => !tipo.selected));
    }
  };

  return {
    tiposEmpresas,
    setTiposEmpresas,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    formData,
    setFormData,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected
  };
};

const TiposEmpresasManager = () => {
  const {
    tiposEmpresas,
    setTiposEmpresas,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    formData,
    setFormData,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected
  } = useTiposEmpresasManager();

  const filteredTiposEmpresas = useMemo(() => {
    return tiposEmpresas.filter(tipo => {
      const matchesSearch = tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstado = !filterEstado || 
                          (filterEstado === 'activo' && tipo.activo) ||
                          (filterEstado === 'inactivo' && !tipo.activo);
      return matchesSearch && matchesEstado;
    });
  }, [tiposEmpresas, searchTerm, filterEstado]);

  const selectedCount = useMemo(() => {
    return tiposEmpresas.filter(tipo => tipo.selected).length;
  }, [tiposEmpresas]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Tipos de Empresas</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Nuevo Tipo
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
                    placeholder="Buscar tipos de empresas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
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
                  {editingId ? "Editar Tipo de Empresa" : "Nuevo Tipo de Empresa"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.activo ? "activo" : "inactivo"}
                    onChange={(e) => setFormData({...formData, activo: e.target.value === "activo"})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
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
                      checked={selectedCount === tiposEmpresas.length && tiposEmpresas.length > 0}
                      onChange={(e) => {
                        setTiposEmpresas(prev => prev.map(tipo => ({ ...tipo, selected: e.target.checked })));
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
                    Descripción
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
                {filteredTiposEmpresas.map((tipo) => (
                  <tr key={tipo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={tipo.selected}
                        onChange={() => toggleSelect(tipo.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tipo.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tipo.nombre}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {tipo.descripcion}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tipo.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tipo.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(tipo)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(tipo.id)}
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

export default function TiposEmpresasPage() {
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

  return <TiposEmpresasManager />;
} 