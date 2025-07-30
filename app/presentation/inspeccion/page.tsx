"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, X, Check } from 'lucide-react';

type Inspeccion = {
  id: number;
  inspector: string;
  actividad: string;
  codigo: string;
  fecha: string;
  encargado: string;
  area: string;
  centroTrabajo: string;
  tipo: string;
  nota: string;
  estado: string;
  fechaLimite: string;
  selected: boolean;
};

const tiposChecklist: { [key: string]: string[] } = {
  'Inspección - Bus': ['prueba 1', 'prueba 2', 'prueba 3'],
  'Inspección - Faena': ['prueba 4', 'prueba 5', 'prueba 6'],
  'Inspección - Eslinga': ['prueba 7', 'prueba 8', 'prueba 9']
};

const tipoInspeccionPorActividad: { [key: string]: string } = {
  'Inspección - Bus': 'Vehículos/Maquinarias',
  'Inspección - Faena': 'Instalaciones',
  'Inspección - Eslinga': 'Equipos/Herramientas'
};

const useInspeccionManager = () => {
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [formData, setFormData] = useState({
    inspector: 'Juan Molina',
    actividad: '',
    codigo: '',
    fecha: '',
    encargado: '',
    area: '',
    centroTrabajo: '',
    tipo: '',
    estado: 'Rojo',
    fechaLimite: ''
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [resultadosChecklist, setResultadosChecklist] = useState<{[key: string]: string}>({});
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [nuevoItemChecklist, setNuevoItemChecklist] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [actividades, setActividades] = useState(['Inspección - Bus', 'Inspección - Faena', 'Inspección - Eslinga']);
  const [encargados, setEncargados] = useState(['Juan Molina', 'Maria Soledad', 'Hernan Fernandez']);
  const [areas, setAreas] = useState(['Bodega', 'Zona Norte']);
  const [centros, setCentros] = useState(['Planta A', 'Planta B']);

  const [nuevoCampo, setNuevoCampo] = useState({ actividad: '', encargado: '', area: '', centroTrabajo: '' });
  const [modoNuevo, setModoNuevo] = useState({ actividad: false, encargado: false, area: false, centroTrabajo: false });

  useEffect(() => {
    if (formData.actividad && actividades.includes(formData.actividad)) {
      setChecklistItems(tiposChecklist[formData.actividad] || []);
      setFormData(prev => ({ ...prev, tipo: tipoInspeccionPorActividad[formData.actividad] || '' }));
    } else if (formData.actividad && !actividades.includes(formData.actividad)) {
      setChecklistItems([]);
      setFormData(prev => ({ ...prev, tipo: prev.tipo || '' }));
    }
  }, [formData.actividad]);

  const calcularNota = () => {
    const valores = Object.values(resultadosChecklist);
    const total = valores.length;
    const cumple = valores.filter((v) => v === 'cumple').length;
    const porcentaje = total ? Math.round((cumple / total) * 100) : 0;
    const notaDecimal = (porcentaje * 7) / 100;
    return `${porcentaje}% - ${notaDecimal.toFixed(1).replace('.', ',')}`;
  };

  const resetForm = () => {
    setFormData({
      inspector: 'Juan Molina',
      actividad: '',
      codigo: '',
      fecha: '',
      encargado: '',
      area: '',
      centroTrabajo: '',
      tipo: '',
      estado: 'Rojo',
      fechaLimite: ''
    });
    setResultadosChecklist({});
    setChecklistItems([]);
    setNuevoItemChecklist('');
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (inspeccion: Inspeccion) => {
    setFormData({
      inspector: inspeccion.inspector,
      actividad: inspeccion.actividad,
      codigo: inspeccion.codigo,
      fecha: inspeccion.fecha,
      encargado: inspeccion.encargado,
      area: inspeccion.area,
      centroTrabajo: inspeccion.centroTrabajo,
      tipo: inspeccion.tipo,
      estado: inspeccion.estado,
      fechaLimite: inspeccion.fechaLimite
    });
    setEditingId(inspeccion.id);
    setMostrarFormulario(true);
    
    // Cargar checklist items si existe la actividad
    if (inspeccion.actividad && tiposChecklist[inspeccion.actividad]) {
      setChecklistItems(tiposChecklist[inspeccion.actividad]);
    }
  };

  const handleUpdate = () => {
    if (!formData.actividad || !formData.codigo || !formData.fecha || !formData.encargado || !formData.area || !formData.centroTrabajo) return;
    
    const nota = calcularNota();
    const nuevaInspeccion: Inspeccion = { ...formData, nota, id: editingId || Date.now(), selected: false };

    if (editingId) {
      setInspecciones(prev => prev.map(item => item.id === editingId ? nuevaInspeccion : item));
    } else {
      setInspecciones(prev => [...prev, nuevaInspeccion]);
    }

    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta inspección?')) {
      setInspecciones(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setInspecciones(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const deleteSelected = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar las inspecciones seleccionadas?')) {
      setInspecciones(prev => prev.filter(item => !item.selected));
    }
  };

  const agregarItemChecklist = () => {
    if (nuevoItemChecklist.trim()) {
      setChecklistItems((prev) => [...prev, nuevoItemChecklist.trim()]);
      setNuevoItemChecklist('');
    }
  };

  const agregarNuevoCampo = (campo: string, lista: string[], setLista: (list: string[]) => void) => {
    if (nuevoCampo[campo as keyof typeof nuevoCampo].trim()) {
      setLista([...lista, nuevoCampo[campo as keyof typeof nuevoCampo].trim()]);
      setModoNuevo(prev => ({ ...prev, [campo]: false }));
      setFormData(prev => ({ ...prev, [campo]: nuevoCampo[campo as keyof typeof nuevoCampo].trim() }));
      setNuevoCampo(prev => ({ ...prev, [campo]: '' }));
    }
  };

  return {
    inspecciones,
    setInspecciones,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    resultadosChecklist,
    setResultadosChecklist,
    checklistItems,
    nuevoItemChecklist,
    setNuevoItemChecklist,
    actividades,
    setActividades,
    encargados,
    setEncargados,
    areas,
    setAreas,
    centros,
    setCentros,
    nuevoCampo,
    setNuevoCampo,
    modoNuevo,
    setModoNuevo,
    editingId,
    searchTerm,
    setSearchTerm,
    calcularNota,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    agregarItemChecklist,
    agregarNuevoCampo
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

const InspeccionManager = () => {
  const {
    inspecciones,
    setInspecciones,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    resultadosChecklist,
    setResultadosChecklist,
    checklistItems,
    nuevoItemChecklist,
    setNuevoItemChecklist,
    actividades,
    setActividades,
    encargados,
    setEncargados,
    areas,
    setAreas,
    centros,
    setCentros,
    nuevoCampo,
    setNuevoCampo,
    modoNuevo,
    setModoNuevo,
    editingId,
    searchTerm,
    setSearchTerm,
    calcularNota,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    agregarItemChecklist,
    agregarNuevoCampo
  } = useInspeccionManager();

  const filteredInspecciones = useMemo(() => {
    return inspecciones.filter(inspeccion =>
      inspeccion.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspeccion.actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspeccion.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inspecciones, searchTerm]);

  const selectedCount = useMemo(() => {
    return inspecciones.filter(item => item.selected).length;
  }, [inspecciones]);

  const renderSelectConAgregar = (label: string, campo: string, opciones: string[], setOpciones: (list: string[]) => void) => (
    <div className="flex items-center gap-2">
      {modoNuevo[campo as keyof typeof modoNuevo] ? (
        <>
          <input
            type="text"
            placeholder={`Nuevo ${label}`}
            value={nuevoCampo[campo as keyof typeof nuevoCampo]}
            onChange={(e) => setNuevoCampo(prev => ({ ...prev, [campo]: e.target.value }))}
            className="border p-2 rounded w-full"
          />
          <button onClick={() => agregarNuevoCampo(campo, opciones, setOpciones)} className="bg-green-600 text-white px-3 py-1 rounded">Agregar</button>
        </>
      ) : (
        <>
          <select
            value={formData[campo as keyof typeof formData] || ''}
            onChange={(e) => setFormData({ ...formData, [campo]: e.target.value })}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Seleccionar {label}</option>
            {opciones.map(opcion => (
              <option key={opcion} value={opcion}>{opcion}</option>
            ))}
          </select>
          <button onClick={() => setModoNuevo(prev => ({ ...prev, [campo]: true }))} className="bg-blue-600 text-white px-3 py-1 rounded">+</button>
        </>
      )}
    </div>
  );

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
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Inspecciones</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Inspección
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar inspecciones..."
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
                  {editingId ? "Editar Inspección" : "Nueva Inspección"}
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
                  {renderSelectConAgregar('Actividad', 'actividad', actividades, setActividades)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Encargado</label>
                  {renderSelectConAgregar('Encargado', 'encargado', encargados, setEncargados)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                  {renderSelectConAgregar('Área', 'area', areas, setAreas)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabajo</label>
                  {renderSelectConAgregar('Centro', 'centroTrabajo', centros, setCentros)}
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
                        setInspecciones(prev => prev.map(item => ({ ...item, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Encargado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInspecciones.map((inspeccion) => (
                  <tr key={inspeccion.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={inspeccion.selected}
                        onChange={() => toggleSelect(inspeccion.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{inspeccion.inspector}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{inspeccion.actividad}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{inspeccion.codigo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{inspeccion.fecha}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{inspeccion.encargado}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{inspeccion.area}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{inspeccion.centroTrabajo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{inspeccion.nota}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(inspeccion.estado)}`}>
                        {inspeccion.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(inspeccion)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(inspeccion.id)}
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

export default InspeccionManager;
