"use client";
import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, X, Check } from 'lucide-react';

interface EPP {
  id: number;
  nombre: string;
  actividadEconomica: string;
  selected: boolean;
}

export default function EPPPage() {
  const [epps, setEpps] = useState<EPP[]>([
    { id: 1, nombre: "Casco de Seguridad", actividadEconomica: "Forestal", selected: false },
    { id: 2, nombre: "Guantes de Trabajo", actividadEconomica: "Manufactura", selected: false },
    { id: 3, nombre: "Botas de Seguridad", actividadEconomica: "Ganadería", selected: false },
    { id: 4, nombre: "Gafas de Protección", actividadEconomica: "Manufactura", selected: false },
    { id: 5, nombre: "Chaleco Reflectante", actividadEconomica: "Forestal", selected: false },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    actividadEconomica: ''
  });
  const [showCustomActivity, setShowCustomActivity] = useState(false);
  const [customActivity, setCustomActivity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const actividadesEconomicas = ['Forestal', 'Ganadería', 'Manufactura'];
  const [actividades, setActividades] = useState(actividadesEconomicas);

  const filteredEpps = useMemo(() => {
    return epps.filter(epp =>
      epp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      epp.actividadEconomica.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [epps, searchTerm]);

  const selectedCount = useMemo(() => {
    return epps.filter(item => item.selected).length;
  }, [epps]);

  const resetForm = () => {
    setFormData({
      nombre: '',
      actividadEconomica: ''
    });
    setShowCustomActivity(false);
    setCustomActivity('');
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (epp: EPP) => {
    setFormData({ nombre: epp.nombre, actividadEconomica: epp.actividadEconomica });
    setEditingId(epp.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (!formData.nombre || !formData.actividadEconomica) return;
    
    const actividadFinal = showCustomActivity ? customActivity : formData.actividadEconomica;
    
    if (editingId) {
      setEpps(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, nombre: formData.nombre, actividadEconomica: actividadFinal }
          : item
      ));
    } else {
      const newEPP: EPP = {
        id: Date.now(),
        nombre: formData.nombre,
        actividadEconomica: actividadFinal,
        selected: false
      };
      setEpps(prev => [...prev, newEPP]);
    }

    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este EPP?')) {
      setEpps(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setEpps(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const deleteSelected = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar los EPPs seleccionados?')) {
      setEpps(prev => prev.filter(item => !item.selected));
    }
  };

  const agregarNuevaActividad = () => {
    if (customActivity.trim()) {
      setActividades(prev => [...prev, customActivity.trim()]);
      setFormData(prev => ({ ...prev, actividadEconomica: customActivity.trim() }));
      setShowCustomActivity(false);
      setCustomActivity('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de EPPs</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo EPP
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar EPPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

          {/* Formulario */}
          {mostrarFormulario && (
            <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Editar EPP" : "Nuevo EPP"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actividad Económica</label>
                  {!showCustomActivity ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={formData.actividadEconomica}
                        onChange={(e) => setFormData({...formData, actividadEconomica: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar actividad</option>
                        {actividades.map((actividad) => (
                          <option key={actividad} value={actividad}>{actividad}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCustomActivity(true)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customActivity}
                        onChange={(e) => setCustomActivity(e.target.value)}
                        placeholder="Nueva actividad económica"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={agregarNuevaActividad}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Agregar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomActivity(false);
                          setCustomActivity('');
                        }}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        ←
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de EPP</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Ingrese nombre del EPP"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {editingId ? "Actualizar" : "Guardar"}
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
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setEpps(prev => prev.map(item => ({ ...item, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Elemento de Protección Personal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad Económica</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEpps.map((epp) => (
                  <tr key={epp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={epp.selected}
                        onChange={() => toggleSelect(epp.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{epp.nombre}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {epp.actividadEconomica}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(epp)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(epp.id)}
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
    </div>
  );
} 