"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Trash2, Plus, Search, X } from "lucide-react";

interface CausaBasica {
  id: number;
  titulo: string;
  items: string[];
  selected: boolean;
}

const useCausasBasicasManager = () => {
  const [causasBasicas, setCausasBasicas] = useState<CausaBasica[]>([
    {
      id: 1,
      titulo: "Capacidad Física/Fisiológica Inadecuada",
      items: [
        "Altura, peso, talla, fuerza, alcance, etc., inadecuados",
        "Capacidad de movimiento corporal limitada",
        "Capacidad limitada para mantenerse en determinadas posiciones corporales"
      ],
      selected: false
    },
    {
      id: 2,
      titulo: "Capacidad Mental/Sicológica Inadecuada",
      items: [
        "Temores y fobias",
        "Problemas emocionales"
      ],
      selected: false
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    titulo: "",
    items: [""]
  });

  const resetForm = () => {
    setFormData({
      titulo: "",
      items: [""]
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (causa: CausaBasica) => {
    setFormData({
      titulo: causa.titulo,
      items: [...causa.items, ""]
    });
    setEditingId(causa.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    const itemsFiltrados = formData.items.filter(item => item.trim() !== "");
    
    if (editingId) {
      setCausasBasicas(prev => prev.map(causa =>
        causa.id === editingId
          ? { ...causa, titulo: formData.titulo, items: itemsFiltrados }
          : causa
      ));
    } else {
      const newCausa: CausaBasica = {
        id: Math.max(...causasBasicas.map(c => c.id)) + 1,
        titulo: formData.titulo,
        items: itemsFiltrados,
        selected: false
      };
      setCausasBasicas(prev => [...prev, newCausa]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta causa básica?")) {
      setCausasBasicas(prev => prev.filter(causa => causa.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setCausasBasicas(prev => prev.map(causa =>
      causa.id === id ? { ...causa, selected: !causa.selected } : causa
    ));
  };

  const deleteSelected = () => {
    const selectedCount = causasBasicas.filter(causa => causa.selected).length;
    if (selectedCount > 0 && window.confirm(`¿Eliminar ${selectedCount} causa(s) básica(s) seleccionada(s)?`)) {
      setCausasBasicas(prev => prev.filter(causa => !causa.selected));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, ""]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? value : item)
    }));
  };

  return {
    causasBasicas,
    setCausasBasicas,
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
    deleteSelected,
    addItem,
    removeItem,
    updateItem
  };
};

const CausasBasicasManager = () => {
  const {
    causasBasicas,
    setCausasBasicas,
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
    deleteSelected,
    addItem,
    removeItem,
    updateItem
  } = useCausasBasicasManager();

  const filteredCausasBasicas = useMemo(() => {
    return causasBasicas.filter(causa => {
      const matchesSearch = causa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          causa.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [causasBasicas, searchTerm]);

  const selectedCount = useMemo(() => {
    return causasBasicas.filter(causa => causa.selected).length;
  }, [causasBasicas]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Causas Básicas</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Gestionar las causas básicas para el análisis causal de incidentes</p>
            </div>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Nueva Causa Básica
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
                    placeholder="Buscar causas básicas..."
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
                  {editingId ? "Editar Causa Básica" : "Nueva Causa Básica"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Causa Básica</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Capacidad Física/Fisiológica Inadecuada"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateItem(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Item ${index + 1}`}
                        />
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addItem}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Agregar Item
                    </button>
                  </div>
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
                      checked={selectedCount === causasBasicas.length && causasBasicas.length > 0}
                      onChange={(e) => {
                        setCausasBasicas(prev => prev.map(causa => ({ ...causa, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCausasBasicas.map((causa) => (
                  <tr key={causa.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={causa.selected}
                        onChange={() => toggleSelect(causa.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {causa.titulo}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside space-y-1">
                        {causa.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(causa)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(causa.id)}
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

          {filteredCausasBasicas.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Comienza agregando una nueva causa básica para el análisis causal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CausasBasicasPage() {
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

  return <CausasBasicasManager />;
} 