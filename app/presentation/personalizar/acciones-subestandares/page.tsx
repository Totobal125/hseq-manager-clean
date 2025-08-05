"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Trash2, Plus, Search, X } from "lucide-react";

interface AccionSubestandar {
  id: number;
  nombre: string;
  selected: boolean;
}

const useAccionesSubestandaresManager = () => {
  const [accionesSubestandares, setAccionesSubestandares] = useState<AccionSubestandar[]>([
    {
      id: 1,
      nombre: "Adoptar una posición inadecuada para hacer la tarea",
      selected: false
    },
    {
      id: 2,
      nombre: "Almacenar de manera incorrecta",
      selected: false
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nombre: ""
  });

  const resetForm = () => {
    setFormData({
      nombre: ""
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (accion: AccionSubestandar) => {
    setFormData({
      nombre: accion.nombre
    });
    setEditingId(accion.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (editingId) {
      setAccionesSubestandares(prev => prev.map(accion =>
        accion.id === editingId
          ? { ...accion, nombre: formData.nombre }
          : accion
      ));
    } else {
      const newAccion: AccionSubestandar = {
        id: Math.max(...accionesSubestandares.map(a => a.id)) + 1,
        nombre: formData.nombre,
        selected: false
      };
      setAccionesSubestandares(prev => [...prev, newAccion]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta acción subestandar?")) {
      setAccionesSubestandares(prev => prev.filter(accion => accion.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setAccionesSubestandares(prev => prev.map(accion =>
      accion.id === id ? { ...accion, selected: !accion.selected } : accion
    ));
  };

  const deleteSelected = () => {
    const selectedCount = accionesSubestandares.filter(accion => accion.selected).length;
    if (selectedCount > 0 && window.confirm(`¿Eliminar ${selectedCount} acción(es) subestandar(es) seleccionada(s)?`)) {
      setAccionesSubestandares(prev => prev.filter(accion => !accion.selected));
    }
  };

  return {
    accionesSubestandares,
    setAccionesSubestandares,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
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

const AccionesSubestandaresManager = () => {
  const {
    accionesSubestandares,
    setAccionesSubestandares,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected
  } = useAccionesSubestandaresManager();

  const filteredAccionesSubestandares = useMemo(() => {
    return accionesSubestandares.filter(accion => {
      const matchesSearch = accion.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [accionesSubestandares, searchTerm]);

  const selectedCount = useMemo(() => {
    return accionesSubestandares.filter(accion => accion.selected).length;
  }, [accionesSubestandares]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Acciones Subestandares</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Gestionar las acciones subestandares para el análisis causal de incidentes</p>
            </div>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Nueva Acción Subestandar
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
                    placeholder="Buscar acciones subestandares..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
                  {editingId ? "Editar Acción Subestandar" : "Nueva Acción Subestandar"}
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Acción Subestandar</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Adoptar una posición inadecuada para hacer la tarea"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
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
                      checked={selectedCount === accionesSubestandares.length && accionesSubestandares.length > 0}
                      onChange={(e) => {
                        setAccionesSubestandares(prev => prev.map(accion => ({ ...accion, selected: e.target.checked })));
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
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccionesSubestandares.map((accion) => (
                  <tr key={accion.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={accion.selected}
                        onChange={() => toggleSelect(accion.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {accion.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {accion.nombre}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(accion)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(accion.id)}
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

          {filteredAccionesSubestandares.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Comienza agregando una nueva acción subestandar para el análisis causal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AccionesSubestandaresPage() {
  const { isAuthenticated } = useAuth();

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

  return <AccionesSubestandaresManager />;
} 