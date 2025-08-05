"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, X, Check, GraduationCap, Calendar, Users, MapPin, CheckCircle, Clock } from 'lucide-react';

type Capacitacion = {
  id: number;
  tipoCapacitacion: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  fechaCapacitacion: string;
  capacitadores: Array<{nombre: string, firma: string}>;
  tipoCapacitador: string;
  participantes: Array<{nombre: string, firma: string}>;
  centroTrabajo: string;
  area: string;
  estado: string;
  vigenciaIndefinida: boolean;
  vigenciaMeses: number;
  piePagina: string;
  fechaCreacion: string;
  imagenEvidencia: string;
  selected: boolean;
};

const piePaginaDefault = "Doy testimonio que se me ha capacitado y he comprendido todos los temas aquí señalados, siendo de mi responsabilidad cumplir con todos los aspectos tratados en la actividad aquí descrita.";

const useCapacitacionManager = () => {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [formData, setFormData] = useState({
    tipoCapacitacion: "",
    titulo: "",
    descripcion: "",
    contenido: "",
    fechaCapacitacion: "",
    capacitadores: [] as Array<{nombre: string, firma: string}>,
    tipoCapacitador: "Interno",
    participantes: [] as Array<{nombre: string, firma: string}>,
    centroTrabajo: "",
    area: "",
    estado: "Programado",
    vigenciaIndefinida: false,
    vigenciaMeses: 12,
    piePagina: piePaginaDefault,
    imagenEvidencia: ""
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterCentro, setFilterCentro] = useState("");

  const [tiposCapacitacion, setTiposCapacitacion] = useState(['Charla Asistente Social', 'Curso', 'Charlas de 5 min', 'Alertas', 'Inducción']);
  const [centrosTrabajo, setCentrosTrabajo] = useState(['Planta A', 'Planta B']);
  const [areas, setAreas] = useState(['Bodega', 'Zona Norte']);
  const [capacitadoresInternos, setCapacitadoresInternos] = useState(['Juan Valdéz', 'María Fernandez']);
  const [participantes, setParticipantes] = useState(['Juan Molina', 'Maria Soledad', 'Hernan Fernandez']);

  const [nuevoCampo, setNuevoCampo] = useState({ 
    tipoCapacitacion: '', 
    centroTrabajo: '', 
    area: '', 
    capacitador: '', 
    participante: '' 
  });
  const [modoNuevo, setModoNuevo] = useState({ 
    tipoCapacitacion: false, 
    centroTrabajo: false, 
    area: false, 
    capacitador: false, 
    participante: false 
  });

  const resetForm = () => {
    setFormData({
      tipoCapacitacion: "",
      titulo: "",
      descripcion: "",
      contenido: "",
      fechaCapacitacion: "",
      capacitadores: [],
      tipoCapacitador: "Interno",
      participantes: [],
      centroTrabajo: "",
      area: "",
      estado: "Programado",
      vigenciaIndefinida: false,
      vigenciaMeses: 12,
      piePagina: piePaginaDefault,
      imagenEvidencia: ""
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (capacitacion: Capacitacion) => {
    setFormData({
      tipoCapacitacion: capacitacion.tipoCapacitacion,
      titulo: capacitacion.titulo,
      descripcion: capacitacion.descripcion,
      contenido: capacitacion.contenido,
      fechaCapacitacion: capacitacion.fechaCapacitacion,
      capacitadores: capacitacion.capacitadores,
      tipoCapacitador: capacitacion.tipoCapacitador,
      participantes: capacitacion.participantes,
      centroTrabajo: capacitacion.centroTrabajo,
      area: capacitacion.area,
      estado: capacitacion.estado,
      vigenciaIndefinida: capacitacion.vigenciaIndefinida,
      vigenciaMeses: capacitacion.vigenciaMeses,
      piePagina: capacitacion.piePagina,
      imagenEvidencia: capacitacion.imagenEvidencia
    });
    setEditingId(capacitacion.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (!formData.tipoCapacitacion || !formData.titulo || !formData.centroTrabajo || !formData.area || !formData.fechaCapacitacion) return;
    
    const nuevaCapacitacion: Capacitacion = { 
      ...formData, 
      id: editingId || Date.now(), 
      selected: false,
      fechaCreacion: editingId ? '' : new Date().toISOString().split('T')[0]
    };

    if (editingId) {
      setCapacitaciones(prev => prev.map(item => item.id === editingId ? nuevaCapacitacion : item));
    } else {
      setCapacitaciones(prev => [...prev, nuevaCapacitacion]);
    }

    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta capacitación?')) {
      setCapacitaciones(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setCapacitaciones(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const deleteSelected = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar las capacitaciones seleccionadas?')) {
      setCapacitaciones(prev => prev.filter(item => !item.selected));
    }
  };

  const handleChangeEstado = (id: number) => {
    setCapacitaciones(prev => prev.map(capacitacion => 
      capacitacion.id === id 
        ? { ...capacitacion, estado: capacitacion.estado === "Programado" ? "Realizado" : "Programado" }
        : capacitacion
    ));
  };

  const handleCapacitadorChange = (capacitador: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        capacitadores: [...prev.capacitadores, { nombre: capacitador, firma: '' }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        capacitadores: prev.capacitadores.filter(c => c.nombre !== capacitador)
      }));
    }
  };

  const handleParticipanteChange = (participante: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        participantes: [...prev.participantes, { nombre: participante, firma: '' }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        participantes: prev.participantes.filter(p => p.nombre !== participante)
      }));
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
    capacitaciones,
    setCapacitaciones,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    tiposCapacitacion,
    setTiposCapacitacion,
    centrosTrabajo,
    setCentrosTrabajo,
    areas,
    setAreas,
    capacitadoresInternos,
    setCapacitadoresInternos,
    participantes,
    setParticipantes,
    nuevoCampo,
    setNuevoCampo,
    modoNuevo,
    setModoNuevo,
    editingId,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    filterEstado,
    setFilterEstado,
    filterCentro,
    setFilterCentro,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    handleChangeEstado,
    handleCapacitadorChange,
    handleParticipanteChange,
    agregarNuevoCampo
  };
};

const CapacitacionManager = () => {
  const {
    capacitaciones,
    setCapacitaciones,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    tiposCapacitacion,
    setTiposCapacitacion,
    centrosTrabajo,
    setCentrosTrabajo,
    areas,
    setAreas,
    capacitadoresInternos,
    setCapacitadoresInternos,
    participantes,
    setParticipantes,
    nuevoCampo,
    setNuevoCampo,
    modoNuevo,
    setModoNuevo,
    editingId,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    filterEstado,
    setFilterEstado,
    filterCentro,
    setFilterCentro,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    handleChangeEstado,
    handleCapacitadorChange,
    handleParticipanteChange,
    agregarNuevoCampo
  } = useCapacitacionManager();

  const filteredCapacitaciones = useMemo(() => {
    return capacitaciones.filter(capacitacion => {
      const matchesSearch = capacitacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           capacitacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           capacitacion.capacitadores.some(c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTipo = !filterTipo || capacitacion.tipoCapacitacion === filterTipo;
      const matchesEstado = !filterEstado || capacitacion.estado === filterEstado;
      const matchesCentro = !filterCentro || capacitacion.centroTrabajo === filterCentro;
      
      return matchesSearch && matchesTipo && matchesEstado && matchesCentro;
    });
  }, [capacitaciones, searchTerm, filterTipo, filterEstado, filterCentro]);

  const selectedCount = useMemo(() => {
    return capacitaciones.filter(item => item.selected).length;
  }, [capacitaciones]);

  const renderSelectConAgregar = (label: string, campo: string, opciones: string[], setOpciones: (list: string[]) => void) => {
    // Función helper para obtener el valor string de formData
    const getStringValue = (field: string): string => {
      const value = formData[field as keyof typeof formData];
      if (typeof value === 'string') return value;
      return '';
    };

    return (
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
              value={getStringValue(campo)}
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Capacitaciones</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              Nueva Capacitación
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between mb-6">
            <div className="flex flex-col gap-4 w-full xl:w-auto">
              {/* Buscador y Botón Agregar */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar capacitaciones..."
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
                  {tiposCapacitacion.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="Programado">Programado</option>
                  <option value="Realizado">Realizado</option>
                </select>
                <select
                  value={filterCentro}
                  onChange={(e) => setFilterCentro(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los centros</option>
                  {centrosTrabajo.map(centro => (
                    <option key={centro} value={centro}>{centro}</option>
                  ))}
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
                  {editingId ? "Editar Capacitación" : "Nueva Capacitación"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Capacitación</label>
                  {renderSelectConAgregar('Tipo', 'tipoCapacitacion', tiposCapacitacion, setTiposCapacitacion)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabajo</label>
                  {renderSelectConAgregar('Centro', 'centroTrabajo', centrosTrabajo, setCentrosTrabajo)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                  {renderSelectConAgregar('Área', 'area', areas, setAreas)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Capacitación</label>
                  <input
                    type="date"
                    value={formData.fechaCapacitacion}
                    onChange={(e) => setFormData({ ...formData, fechaCapacitacion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Capacitador</label>
                  <select
                    value={formData.tipoCapacitador}
                    onChange={(e) => setFormData({ ...formData, tipoCapacitador: e.target.value, capacitadores: [] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Interno">Interno</option>
                    <option value="Externo">Externo</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe el propósito de la capacitación..."
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea
                  value={formData.contenido}
                  onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detalla el contenido de la capacitación..."
                  required
                />
              </div>

              {/* Capacitadores */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Capacitadores</h3>
                <div className="space-y-4">
                  {formData.capacitadores.map((capacitador, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <input
                        type="text"
                        placeholder="Nombre del capacitador"
                        value={capacitador.nombre}
                        onChange={(e) => {
                          const newCapacitadores = [...formData.capacitadores];
                          newCapacitadores[index].nombre = e.target.value;
                          setFormData({...formData, capacitadores: newCapacitadores});
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const newCapacitadores = [...formData.capacitadores];
                          newCapacitadores[index].firma = e.target.files?.[0]?.name || "";
                          setFormData({...formData, capacitadores: newCapacitadores});
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newCapacitadores = formData.capacitadores.filter((_, i) => i !== index);
                          setFormData({...formData, capacitadores: newCapacitadores});
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormData({
                      ...formData,
                      capacitadores: [...formData.capacitadores, { nombre: '', firma: '' }]
                    })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Agregar Capacitador
                  </button>
                </div>
              </div>

              {/* Participantes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Participantes</h3>
                  <div className="space-y-4">
                    {formData.participantes.map((participante, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <input
                          type="text"
                          placeholder="Nombre del participante"
                          value={participante.nombre}
                          onChange={(e) => {
                            const newParticipantes = [...formData.participantes];
                            newParticipantes[index].nombre = e.target.value;
                            setFormData({...formData, participantes: newParticipantes});
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const newParticipantes = [...formData.participantes];
                            newParticipantes[index].firma = e.target.files?.[0]?.name || "";
                            setFormData({...formData, participantes: newParticipantes});
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            const newParticipantes = formData.participantes.filter((_, i) => i !== index);
                            setFormData({...formData, participantes: newParticipantes});
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        participantes: [...formData.participantes, { nombre: '', firma: '' }]
                      })}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      Agregar Participante
                    </button>
                  </div>
                </div>



                {/* Imagen de evidencia */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Evidencia</h3>
                  <div>
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
                </div>

              {/* Vigencia */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={formData.vigenciaIndefinida}
                    onChange={(e) => setFormData({ ...formData, vigenciaIndefinida: e.target.checked })}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Vigencia indefinida</label>
                </div>
                {!formData.vigenciaIndefinida && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vigencia (meses)</label>
                    <input
                      type="number"
                      value={formData.vigenciaMeses}
                      onChange={(e) => setFormData({ ...formData, vigenciaMeses: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Pie de página */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pie de página</label>
                <textarea
                  value={formData.piePagina}
                  onChange={(e) => setFormData({ ...formData, piePagina: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mensaje del pie de página..."
                  required
                />
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
                        setCapacitaciones(prev => prev.map(item => ({ ...item, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacitación</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacitador</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCapacitaciones.map((capacitacion) => (
                  <tr key={capacitacion.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={capacitacion.selected}
                        onChange={() => toggleSelect(capacitacion.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{capacitacion.titulo}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{capacitacion.descripcion}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {capacitacion.tipoCapacitacion}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {capacitacion.centroTrabajo}
                        </div>
                        <div className="text-sm text-gray-500">{capacitacion.area}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(capacitacion.fechaCapacitacion).toLocaleDateString('es-CL')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {capacitacion.capacitadores.map(c => c.nombre).join(", ")}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        capacitacion.estado === "Realizado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {capacitacion.estado === "Realizado" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {capacitacion.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(capacitacion)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(capacitacion.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleChangeEstado(capacitacion.id)}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            capacitacion.estado === "Programado" 
                              ? "bg-green-100 text-green-800 hover:bg-green-200" 
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          }`}
                          title={capacitacion.estado === "Programado" ? "Marcar como realizado" : "Marcar como programado"}
                        >
                          {capacitacion.estado === "Programado" ? "Realizar" : "Reprogramar"}
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

export default CapacitacionManager; 