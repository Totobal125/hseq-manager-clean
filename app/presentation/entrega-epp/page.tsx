"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, X, Check, Camera } from 'lucide-react';

type EntregaEPP = {
  id: number;
  rutTrabajador: string;
  nombreTrabajador: string;
  cargo: string;
  responsable: string;
  eppEntregado: string;
  talla: string;
  fechaHora: string;
  centroTrabajo: string;
  area: string;
  observaciones: string;
  estado: string;
  imagenEvidencia: string;
  fotoFirmaTrabajador?: string;
  fotoFirmaResponsable?: string;
  selected: boolean;
};

const trabajadores: { [key: string]: { nombre: string; cargo: string; centroTrabajo: string; area: string } } = {
  '18652129-3': { nombre: 'Juan Molina', cargo: 'Operador', centroTrabajo: 'Planta Principal', area: 'Producción' },
  '19616321-2': { nombre: 'Maria Soledad', cargo: 'Supervisor', centroTrabajo: 'Almacén', area: 'Logística' },
  '10049166-4': { nombre: 'Hernan Fernandez', cargo: 'Técnico', centroTrabajo: 'Taller', area: 'Mantenimiento' }
};

const useEntregaEPPManager = () => {
  const [entregas, setEntregas] = useState<EntregaEPP[]>([
    {
      id: 1,
      rutTrabajador: '18652129-3',
      nombreTrabajador: 'Juan Molina',
      cargo: 'Operador',
      responsable: 'Juan Molina',
      eppEntregado: 'Casco de Seguridad',
      talla: 'M',
      fechaHora: '2024-01-15T10:30',
      centroTrabajo: 'Planta Principal',
      area: 'Producción',
      observaciones: 'Entrega realizada correctamente',
      estado: 'Entregado',
      imagenEvidencia: 'evidencia1.jpg',
      selected: false
    }
  ]);
  const [formData, setFormData] = useState({
    rutTrabajador: '',
    nombreTrabajador: '',
    cargo: '',
    responsable: 'Juan Molina',
    eppEntregado: '',
    talla: '',
    fechaHora: new Date().toISOString().slice(0, 16),
    centroTrabajo: '',
    area: '',
    observaciones: '',
    estado: '',
    imagenEvidencia: '',
    fotoFirmaTrabajador: '',
    fotoFirmaResponsable: ''
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [trabajadorList, setTrabajadorList] = useState(Object.keys(trabajadores));
  const [epps, setEpps] = useState(['Casco de Seguridad', 'Guantes de Trabajo', 'Botas de Seguridad', 'Gafas de Protección', 'Chaleco Reflectante']);
  const [tallas, setTallas] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [responsables, setResponsables] = useState(['Juan Molina', 'Maria Soledad', 'Hernan Fernandez']);
  const [areas, setAreas] = useState(['Producción', 'Logística', 'Mantenimiento']);
  const [centros, setCentros] = useState(['Planta Principal', 'Almacén', 'Taller']);

  const [nuevoCampo, setNuevoCampo] = useState({ trabajador: '', epp: '', talla: '', responsable: '', area: '', centroTrabajo: '' });
  const [modoNuevo, setModoNuevo] = useState({ trabajador: false, epp: false, talla: false, responsable: false, area: false, centroTrabajo: false });

  useEffect(() => {
    if (formData.rutTrabajador && trabajadores[formData.rutTrabajador]) {
      const trabajador = trabajadores[formData.rutTrabajador];
        setFormData(prev => ({
          ...prev,
          nombreTrabajador: trabajador.nombre,
          cargo: trabajador.cargo,
          centroTrabajo: trabajador.centroTrabajo,
          area: trabajador.area
        }));
    }
  }, [formData.rutTrabajador]);

  const resetForm = () => {
    setFormData({
      rutTrabajador: '',
      nombreTrabajador: '',
      cargo: '',
      responsable: 'Juan Molina',
      eppEntregado: '',
      talla: '',
      fechaHora: new Date().toISOString().slice(0, 16),
      centroTrabajo: '',
      area: '',
      observaciones: '',
      estado: '',
      imagenEvidencia: '',
      fotoFirmaTrabajador: '',
      fotoFirmaResponsable: ''
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (entrega: EntregaEPP) => {
    setFormData({
      rutTrabajador: entrega.rutTrabajador,
      nombreTrabajador: entrega.nombreTrabajador,
      cargo: entrega.cargo,
      responsable: entrega.responsable,
      eppEntregado: entrega.eppEntregado,
      talla: entrega.talla,
      fechaHora: entrega.fechaHora,
      centroTrabajo: entrega.centroTrabajo,
      area: entrega.area,
      observaciones: entrega.observaciones || '',
      estado: entrega.estado || '',
      imagenEvidencia: entrega.imagenEvidencia || '',
      fotoFirmaTrabajador: entrega.fotoFirmaTrabajador || '',
      fotoFirmaResponsable: entrega.fotoFirmaResponsable || ''
    });
    setEditingId(entrega.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (!formData.rutTrabajador || !formData.eppEntregado || !formData.talla || !formData.fechaHora) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
    
    const nuevaEntrega: EntregaEPP = { 
      ...formData, 
      id: editingId || Date.now(), 
      selected: false,
      cargo: formData.cargo || trabajadores[formData.rutTrabajador]?.cargo || '',
      centroTrabajo: formData.centroTrabajo || trabajadores[formData.rutTrabajador]?.centroTrabajo || '',
      area: formData.area || trabajadores[formData.rutTrabajador]?.area || ''
    };

    if (editingId) {
      setEntregas(prev => prev.map(item => item.id === editingId ? nuevaEntrega : item));
      alert('Entrega actualizada exitosamente');
    } else {
      setEntregas(prev => [...prev, nuevaEntrega]);
      alert('Entrega guardada exitosamente');
    }

    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrega?')) {
      setEntregas(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setEntregas(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const deleteSelected = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar las entregas seleccionadas?')) {
      setEntregas(prev => prev.filter(item => !item.selected));
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
    entregas,
    setEntregas,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    trabajadorList,
    setTrabajadorList,
    epps,
    setEpps,
    tallas,
    setTallas,
    responsables,
    setResponsables,
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
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    agregarNuevoCampo
  };
};

const EntregaEPPManager = () => {
  const {
    entregas,
    setEntregas,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    trabajadorList,
    setTrabajadorList,
    epps,
    setEpps,
    tallas,
    setTallas,
    responsables,
    setResponsables,
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
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    agregarNuevoCampo
  } = useEntregaEPPManager();

  const filteredEntregas = useMemo(() => {
    return entregas.filter(entrega =>
      entrega.nombreTrabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.rutTrabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.eppEntregado.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entregas, searchTerm]);

  const selectedCount = useMemo(() => {
    return entregas.filter(item => item.selected).length;
  }, [entregas]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Entrega EPP</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Nueva Entrega
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
                    placeholder="Buscar entregas..."
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
                  {editingId ? "Editar Entrega" : "Nueva Entrega"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">RUT Trabajador</label>
                  {renderSelectConAgregar('RUT', 'rutTrabajador', trabajadorList, setTrabajadorList)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Trabajador</label>
                  <input
                    type="text"
                    value={formData.nombreTrabajador}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                  {renderSelectConAgregar('Responsable', 'responsable', responsables, setResponsables)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">EPP Entregado</label>
                  {renderSelectConAgregar('EPP', 'eppEntregado', epps, setEpps)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
                  {renderSelectConAgregar('Talla', 'talla', tallas, setTallas)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha/Hora</label>
                  <input
                    type="datetime-local"
                    value={formData.fechaHora}
                    onChange={(e) => setFormData({ ...formData, fechaHora: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabajo</label>
                  {renderSelectConAgregar('Centro', 'centroTrabajo', centros, setCentros)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                  {renderSelectConAgregar('Área', 'area', areas, setAreas)}
                </div>
              </div>

              {/* Información adicional */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Información Adicional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                    <textarea
                      value={formData.observaciones}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Devuelto">Devuelto</option>
                    </select>
                  </div>
                </div>
                
                {/* Imagen de evidencia */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de Evidencia</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({...formData, imagenEvidencia: file.name});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.imagenEvidencia && (
                    <p className="text-sm text-green-600 mt-1">✓ {formData.imagenEvidencia}</p>
                  )}
                </div>

                {/* Firmas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Firma del Trabajador</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({...formData, fotoFirmaTrabajador: file.name});
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.fotoFirmaTrabajador && (
                      <p className="text-sm text-green-600 mt-1">✓ {formData.fotoFirmaTrabajador}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Firma del Responsable</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({...formData, fotoFirmaResponsable: file.name});
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.fotoFirmaResponsable && (
                      <p className="text-sm text-green-600 mt-1">✓ {formData.fotoFirmaResponsable}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={!formData.rutTrabajador || !formData.eppEntregado || !formData.talla || !formData.fechaHora}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2"
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
                        setEntregas(prev => prev.map(item => ({ ...item, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trabajador</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EPP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talla</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntregas.map((entrega) => (
                  <tr key={entrega.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={entrega.selected}
                        onChange={() => toggleSelect(entrega.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entrega.rutTrabajador}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entrega.nombreTrabajador}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entrega.cargo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entrega.responsable}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {entrega.eppEntregado}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entrega.talla}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entrega.fechaHora}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entrega.centroTrabajo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entrega.area}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(entrega)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entrega.id)}
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

export default EntregaEPPManager; 