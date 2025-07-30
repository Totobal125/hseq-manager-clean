"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, X, Check } from 'lucide-react';
import ErrorBoundary from "../components/ErrorBoundary";

type Observacion = {
  id: number;
  inspector: string;
  actividad: string;
  nombre: string;
  rut: string;
  cargo: string;
  area: string;
  centroTrabajo: string;
  fecha: string;
  fechaLimite: string;
  nota: number;
  estado: string;
  selected: boolean;
};

const checklistPorActividad: { [key: string]: string[] } = {
  'Contacto de seguridad OPS': ['prueba 1', 'prueba 2', 'prueba 3'],
  'Observación - Asistencia': ['prueba 4', 'prueba 5', 'prueba 6']
};

const trabajadores: { [key: string]: { rut: string; cargo: string } } = {
  'Juan Molina': { rut: '18652129-3', cargo: 'Maestro soldador' },
  'Maria Soledad': { rut: '19616321-2', cargo: 'Encargado área Producción' },
  'Hernan Fernandez': { rut: '10049166-4', cargo: 'Jefe área Producción' }
};

const useObservacionManager = () => {
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [formData, setFormData] = useState({
    inspector: 'Juan Molina',
    actividad: '',
    nombre: '',
    rut: '',
    cargo: '',
    area: '',
    centroTrabajo: '',
    fecha: '',
    fechaLimite: '',
    estado: 'n/a'
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [resultadosChecklist, setResultadosChecklist] = useState<{[key: string]: string}>({});
  const [nuevoItemChecklist, setNuevoItemChecklist] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [actividades, setActividades] = useState(['Contacto de seguridad OPS', 'Observación - Asistencia']);
  const [trabajadorList, setTrabajadorList] = useState(Object.keys(trabajadores));
  const [areas, setAreas] = useState(['Bodega', 'Zona Norte']);
  const [centros, setCentros] = useState(['Planta A', 'Planta B']);

  useEffect(() => {
    if (formData.actividad && checklistPorActividad[formData.actividad]) {
      setChecklistItems(checklistPorActividad[formData.actividad]);
    } else {
      setChecklistItems([]);
    }
  }, [formData.actividad]);

  useEffect(() => {
    const trabajador = trabajadores[formData.nombre];
    if (trabajador) {
      setFormData(prev => ({ ...prev, rut: trabajador.rut, cargo: trabajador.cargo }));
    }
  }, [formData.nombre]);

  const calcularNota = () => {
    const total = checklistItems.length;
    const cumple = checklistItems.filter(item => resultadosChecklist[item] === 'cumple').length;
    const porcentaje = total ? Math.round((cumple / total) * 100) : 0;
    return porcentaje;
  };

  const determinarEstado = (fechaLimite: string) => {
    if (!fechaLimite) return 'n/a';
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    const diff = (limite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return 'Rojo';
    if (diff <= 7) return 'Amarillo';
    return 'Verde';
  };

  const resetForm = () => {
    setFormData({
      inspector: 'Juan Molina',
      actividad: '',
      nombre: '',
      rut: '',
      cargo: '',
      area: '',
      centroTrabajo: '',
      fecha: '',
      fechaLimite: '',
      estado: 'n/a'
    });
    setChecklistItems([]);
    setResultadosChecklist({});
    setNuevoItemChecklist('');
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (observacion: Observacion) => {
    setFormData({
      inspector: observacion.inspector,
      actividad: observacion.actividad,
      nombre: observacion.nombre,
      rut: observacion.rut,
      cargo: observacion.cargo,
      area: observacion.area,
      centroTrabajo: observacion.centroTrabajo,
      fecha: observacion.fecha,
      fechaLimite: observacion.fechaLimite,
      estado: observacion.estado
    });
    setEditingId(observacion.id);
    setMostrarFormulario(true);
    
    // Cargar checklist items si existe la actividad
    if (observacion.actividad && checklistPorActividad[observacion.actividad]) {
      setChecklistItems(checklistPorActividad[observacion.actividad]);
    }
  };

  const handleUpdate = () => {
    const nota = calcularNota();
    const estado = determinarEstado(formData.fechaLimite);
    const nuevaObservacion = { ...formData, nota, estado, id: editingId || Date.now(), selected: false };

    if (editingId) {
      setObservaciones(prev => prev.map(item => item.id === editingId ? { ...nuevaObservacion, selected: item.selected } : item));
    } else {
      setObservaciones(prev => [...prev, nuevaObservacion]);
    }

    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta observación?')) {
      setObservaciones(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setObservaciones(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const deleteSelected = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar las observaciones seleccionadas?')) {
      setObservaciones(prev => prev.filter(item => !item.selected));
    }
  };

  const agregarItemChecklist = () => {
    if (nuevoItemChecklist.trim()) {
      setChecklistItems((prev) => [...prev, nuevoItemChecklist.trim()]);
      setNuevoItemChecklist('');
    }
  };

  return {
    observaciones,
    setObservaciones,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    checklistItems,
    resultadosChecklist,
    setResultadosChecklist,
    nuevoItemChecklist,
    setNuevoItemChecklist,
    actividades,
    trabajadorList,
    areas,
    centros,
    editingId,
    searchTerm,
    setSearchTerm,
    calcularNota,
    determinarEstado,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    agregarItemChecklist
  };
};

const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'Verde': return 'text-green-600 bg-green-100';
    case 'Amarillo': return 'text-yellow-600 bg-yellow-100';
    case 'Rojo': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const ObservacionManager = () => {
  const {
    observaciones,
    setObservaciones,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    checklistItems,
    resultadosChecklist,
    setResultadosChecklist,
    nuevoItemChecklist,
    setNuevoItemChecklist,
    actividades,
    trabajadorList,
    areas,
    centros,
    editingId,
    searchTerm,
    setSearchTerm,
    calcularNota,
    determinarEstado,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    agregarItemChecklist
  } = useObservacionManager();

  const filteredObservaciones = useMemo(() => {
    return observaciones.filter(observacion =>
      observacion.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      observacion.actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      observacion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [observaciones, searchTerm]);

  const selectedCount = useMemo(() => {
    return observaciones.filter(item => item.selected).length;
  }, [observaciones]);

  const renderChecklist = () => (
    <div className="space-y-2">
      {checklistItems.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between border p-2 rounded">
          <span>{idx + 1}. {item}</span>
          <div className="space-x-2">
            {['cumple', 'no cumple', 'no aplica'].map(op => (
              <button
                key={op}
                className={`px-2 py-1 border rounded text-sm ${resultadosChecklist[item] === op ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                onClick={() => setResultadosChecklist(prev => ({ ...prev, [item]: op }))}
              >{op}</button>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Nuevo item del checklist"
          value={nuevoItemChecklist}
          onChange={(e) => setNuevoItemChecklist(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button onClick={agregarItemChecklist} className="bg-green-600 text-white px-3 py-1 rounded">Agregar</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Observaciones</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Observación
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar observaciones..."
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
                  {editingId ? "Editar Observación" : "Nueva Observación"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inspector</label>
                  <input
                    type="text"
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actividad</label>
                  <select
                    value={formData.actividad}
                    onChange={(e) => setFormData({ ...formData, actividad: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar actividad</option>
                    {actividades.map(actividad => (
                      <option key={actividad} value={actividad}>{actividad}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trabajador</label>
                  <select
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar trabajador</option>
                    {trabajadorList.map(trabajador => (
                      <option key={trabajador} value={trabajador}>{trabajador}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                  <input
                    type="text"
                    value={formData.rut}
                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar área</option>
                    {areas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabajo</label>
                  <select
                    value={formData.centroTrabajo}
                    onChange={(e) => setFormData({ ...formData, centroTrabajo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar centro</option>
                    {centros.map(centro => (
                      <option key={centro} value={centro}>{centro}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={formData.fechaLimite}
                    onChange={(e) => setFormData({ ...formData, fechaLimite: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {checklistItems.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Checklist</h3>
                  {renderChecklist()}
                </div>
              )}

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
                        setObservaciones(prev => prev.map(item => ({ ...item, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trabajador</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredObservaciones.map((observacion) => (
                  <tr key={observacion.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={observacion.selected}
                        onChange={() => toggleSelect(observacion.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{observacion.inspector}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{observacion.actividad}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{observacion.nombre}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{observacion.rut}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{observacion.cargo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{observacion.area}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{observacion.centroTrabajo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{observacion.fecha}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{observacion.nota}%</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(observacion.estado)}`}>
                        {observacion.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(observacion)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(observacion.id)}
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
};

export default function ObservacionPage() {
  return (
    <ErrorBoundary>
      <ObservacionManager />
    </ErrorBoundary>
  );
}
