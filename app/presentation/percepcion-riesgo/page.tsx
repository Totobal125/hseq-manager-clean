"use client";
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, X, Check, Filter, AlertTriangle, User, Calendar, Award, FileText } from 'lucide-react';
import { useAuth } from "@/app/context/AuthContext";

interface PercepcionRiesgo {
  id: number;
  nombreTrabajador: string;
  nombreEjecutor: string;
  cargoPostula: string;
  fechaEvaluacion: string;
  resultado: string;
  notaAprobacion: number;
  estado: string;
  tipoContrato: string;
  edad: number;
  nivelEstudios: string;
  evaluador: string;
  firmaEvaluador: string;
  selected: boolean;
}

interface ObservacionGeneral {
  id: number;
  numero: number;
  descripcion: string;
  evidencia: string;
}

interface EvaluacionSeccion {
  id: string;
  titulo: string;
  preguntas: Array<{
    id: string;
    pregunta: string;
    respuesta?: string;
    tipo: 'botones' | 'si_no';
  }>;
  observaciones: ObservacionGeneral[];
  desempeno: string;
  porcentaje: number;
}

const usePercepcionRiesgoManager = () => {
  const [percepcionesRiesgo, setPercepcionesRiesgo] = useState<PercepcionRiesgo[]>([
    {
      id: 1,
      nombreTrabajador: "Juan Molina",
      nombreEjecutor: "María González",
      cargoPostula: "Maestro soldador",
      fechaEvaluacion: "2024-01-15",
      resultado: "Aprobado",
      notaAprobacion: 85,
      estado: "Completado",
      tipoContrato: "Indefinido",
      edad: 28,
      nivelEstudios: "Educación media completa",
      evaluador: "Juan Molina",
      firmaEvaluador: "firma_juan_molina.jpg",
      selected: false
    },
    {
      id: 2,
      nombreTrabajador: "María Soledad",
      nombreEjecutor: "Carlos López",
      cargoPostula: "Encargado área Producción",
      fechaEvaluacion: "2024-02-20",
      resultado: "En Revisión",
      notaAprobacion: 72,
      estado: "Pendiente",
      tipoContrato: "Postulando",
      edad: 35,
      nivelEstudios: "Educación superior incompleta",
      evaluador: "Juan Molina",
      firmaEvaluador: "firma_maria_soledad.jpg",
      selected: false
    }
  ]);

  const [formData, setFormData] = useState({
    nombreTrabajador: '',
    nombreEjecutor: '',
    cargoPostula: '',
    fechaEvaluacion: new Date().toISOString().split('T')[0],
    resultado: '',
    notaAprobacion: 0,
    estado: 'Pendiente',
    tipoContrato: '',
    edad: 0,
    nivelEstudios: '',
    evaluador: 'Juan Molina',
    firmaEvaluador: '',
    // Respuestas de las secciones
    seccionA: {
      A1: '', A2: '', A3: '', A4: '', A5: '', A6: '', A7: ''
    },
    seccionB: {
      B1: '', B2: '', B3: '', B4: '', B5: ''
    },
    seccionC: {
      C1: '', C2: '', C3: '', C4: '', C5: '', C6: ''
    },
    seccionD: {
      D1: '', D2: '', D3: '', D4: '', D5: '', D6: '', D7: '', D8: ''
    },
    seccionE: {
      E1: '', E2: '', E3: '', E4: '', E5: '', E6: '', E7: ''
    },
    // Porcentajes por sección
    porcentajeA: 0,
    porcentajeB: 0,
    porcentajeC: 0,
    porcentajeD: 0,
    porcentajeE: 0,
    promedioGeneral: 0
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [tiposContrato, setTiposContrato] = useState([
    'Indefinido',
    'Postulando', 
    'Fijo',
    'Spot'
  ]);

  const [trabajadores, setTrabajadores] = useState([
    'Juan Molina',
    'María Soledad',
    'Hernan Fernandez'
  ]);

  const [cargos, setCargos] = useState([
    'Maestro soldador',
    'Encargado área Producción',
    'Jefe área Producción'
  ]);

  const [edades, setEdades] = useState([28, 35, 52]);

  const [nivelesEstudios, setNivelesEstudios] = useState([
    'Educación básica incompleta',
    'Educación básica completa',
    'Educación media incompleta',
    'Educación media completa',
    'Educación superior incompleta',
    'Educación superior completa'
  ]);

  const [estados, setEstados] = useState([
    'Pendiente',
    'En Proceso',
    'Completado',
    'Rechazado'
  ]);

  const [nuevoCampo, setNuevoCampo] = useState({ 
    tipoContrato: '', 
    trabajador: '', 
    cargo: '', 
    edad: '', 
    nivelEstudios: '', 
    estado: '' 
  });
  const [modoNuevo, setModoNuevo] = useState({ 
    tipoContrato: false, 
    trabajador: false, 
    cargo: false, 
    edad: false, 
    nivelEstudios: false, 
    estado: false 
  });

  // Estado para las observaciones de cada sección
  const [observaciones, setObservaciones] = useState({
    seccionA: [{ id: 1, descripcion: '', evidencia: '' }],
    seccionB: [{ id: 1, descripcion: '', evidencia: '' }],
    seccionC: [{ id: 1, descripcion: '', evidencia: '' }],
    seccionD: [{ id: 1, descripcion: '', evidencia: '' }],
    seccionE: [{ id: 1, descripcion: '', evidencia: '' }],
    finales: [{ id: 1, descripcion: '', evidencia: '' }]
  });

  const resetForm = () => {
    setFormData({
      nombreTrabajador: '',
      nombreEjecutor: '',
      cargoPostula: '',
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      resultado: '',
      notaAprobacion: 0,
      estado: 'Pendiente',
      tipoContrato: '',
      edad: 0,
      nivelEstudios: '',
      evaluador: 'Juan Molina',
      firmaEvaluador: '',
      // Respuestas de las secciones
      seccionA: {
        A1: '', A2: '', A3: '', A4: '', A5: '', A6: '', A7: ''
      },
      seccionB: {
        B1: '', B2: '', B3: '', B4: '', B5: ''
      },
      seccionC: {
        C1: '', C2: '', C3: '', C4: '', C5: '', C6: ''
      },
      seccionD: {
        D1: '', D2: '', D3: '', D4: '', D5: '', D6: '', D7: '', D8: ''
      },
      seccionE: {
        E1: '', E2: '', E3: '', E4: '', E5: '', E6: '', E7: ''
      },
      // Porcentajes por sección
      porcentajeA: 0,
      porcentajeB: 0,
      porcentajeC: 0,
      porcentajeD: 0,
      porcentajeE: 0,
      promedioGeneral: 0
    });
    
    // Resetear observaciones
    setObservaciones({
      seccionA: [{ id: 1, descripcion: '', evidencia: '' }],
      seccionB: [{ id: 1, descripcion: '', evidencia: '' }],
      seccionC: [{ id: 1, descripcion: '', evidencia: '' }],
      seccionD: [{ id: 1, descripcion: '', evidencia: '' }],
      seccionE: [{ id: 1, descripcion: '', evidencia: '' }],
      finales: [{ id: 1, descripcion: '', evidencia: '' }]
    });
    
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (percepcion: PercepcionRiesgo) => {
    setFormData({
      nombreTrabajador: percepcion.nombreTrabajador,
      nombreEjecutor: percepcion.nombreEjecutor,
      cargoPostula: percepcion.cargoPostula,
      fechaEvaluacion: percepcion.fechaEvaluacion,
      resultado: percepcion.resultado,
      notaAprobacion: percepcion.notaAprobacion,
      estado: percepcion.estado,
      tipoContrato: percepcion.tipoContrato,
      edad: percepcion.edad,
      nivelEstudios: percepcion.nivelEstudios,
      evaluador: percepcion.evaluador,
      firmaEvaluador: percepcion.firmaEvaluador,
      // Respuestas de las secciones (valores por defecto para edición)
      seccionA: {
        A1: '', A2: '', A3: '', A4: '', A5: '', A6: '', A7: ''
      },
      seccionB: {
        B1: '', B2: '', B3: '', B4: '', B5: ''
      },
      seccionC: {
        C1: '', C2: '', C3: '', C4: '', C5: '', C6: ''
      },
      seccionD: {
        D1: '', D2: '', D3: '', D4: '', D5: '', D6: '', D7: '', D8: ''
      },
      seccionE: {
        E1: '', E2: '', E3: '', E4: '', E5: '', E6: '', E7: ''
      },
      // Porcentajes por sección
      porcentajeA: 0,
      porcentajeB: 0,
      porcentajeC: 0,
      porcentajeD: 0,
      porcentajeE: 0,
      promedioGeneral: 0
    });
    setEditingId(percepcion.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (!formData.nombreTrabajador || !formData.tipoContrato) {
      alert('Por favor complete la información básica del trabajador antes de continuar.');
      return;
    }
    
    // Validar que al menos una sección tenga respuestas
    const seccionesCompletadas = [
      Object.values(formData.seccionA).some(v => v !== ''),
      Object.values(formData.seccionB).some(v => v !== ''),
      Object.values(formData.seccionC).some(v => v !== ''),
      Object.values(formData.seccionD).some(v => v !== ''),
      Object.values(formData.seccionE).some(v => v !== '')
    ].filter(Boolean).length;
    
    if (seccionesCompletadas === 0) {
      alert('Por favor complete al menos una sección de evaluación antes de guardar.');
      return;
    }
    
    const promedioGeneral = calcularPromedioGeneral();
    
    // Crear objeto con todas las observaciones
    const evaluacionCompleta = {
      ...formData,
      id: editingId || Date.now(),
      selected: false,
      notaAprobacion: promedioGeneral,
      evaluador: 'Juan Molina',
      observaciones: observaciones,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    if (editingId) {
      setPercepcionesRiesgo(prev => prev.map(item => item.id === editingId ? evaluacionCompleta : item));
      alert('Evaluación actualizada exitosamente.');
    } else {
      setPercepcionesRiesgo(prev => [...prev, evaluacionCompleta]);
      alert('Evaluación guardada exitosamente.');
    }

    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta evaluación?')) {
      setPercepcionesRiesgo(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setPercepcionesRiesgo(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const deleteSelected = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar las evaluaciones seleccionadas?')) {
      setPercepcionesRiesgo(prev => prev.filter(item => !item.selected));
    }
  };

  const agregarNuevoCampo = (campo: string, lista: string[] | number[], setLista: (list: any[]) => void) => {
    if (nuevoCampo[campo as keyof typeof nuevoCampo].trim()) {
      const valor = campo === 'edad' ? parseInt(nuevoCampo[campo as keyof typeof nuevoCampo]) : nuevoCampo[campo as keyof typeof nuevoCampo].trim();
      setLista([...lista, valor]);
      setModoNuevo(prev => ({ ...prev, [campo]: false }));
      setFormData(prev => ({ ...prev, [campo]: valor }));
      setNuevoCampo(prev => ({ ...prev, [campo]: '' }));
    }
  };

  // Función para calcular porcentajes de las secciones
  const calcularPorcentajeSeccion = (seccion: any) => {
    const respuestas = Object.values(seccion).filter(val => val !== '') as string[];
    if (respuestas.length === 0) return 0;
    
    let puntaje = 0;
    respuestas.forEach((respuesta: string) => {
      switch (respuesta) {
        case 'Siempre':
          puntaje += 4;
          break;
        case 'Generalmente':
          puntaje += 3;
          break;
        case 'Pocas veces':
          puntaje += 2;
          break;
        case 'Nunca':
          puntaje += 1;
          break;
        case 'No':
          puntaje += 4;
          break;
        case 'Sí':
          puntaje += 1;
          break;
      }
    });
    
    const maxPuntaje = respuestas.length * 4;
    return Math.round((puntaje / maxPuntaje) * 100);
  };

  // Función para calcular promedio general
  const calcularPromedioGeneral = () => {
    const porcentajeA = calcularPorcentajeSeccion(formData.seccionA);
    const porcentajeB = calcularPorcentajeSeccion(formData.seccionB);
    const porcentajeC = calcularPorcentajeSeccion(formData.seccionC);
    const porcentajeD = calcularPorcentajeSeccion(formData.seccionD);
    const porcentajeE = calcularPorcentajeSeccion(formData.seccionE);
    
    const promedios = [porcentajeA, porcentajeB, porcentajeC, porcentajeD, porcentajeE].filter(p => p > 0);
    if (promedios.length === 0) return 0;
    
    return Math.round(promedios.reduce((a, b) => a + b, 0) / promedios.length);
  };

  // Funciones para manejar observaciones
  const agregarObservacion = (seccion: string) => {
    setObservaciones(prev => ({
      ...prev,
      [seccion]: [...prev[seccion as keyof typeof prev], { 
        id: Date.now(), 
        descripcion: '', 
        evidencia: '' 
      }]
    }));
  };

  const actualizarObservacion = (seccion: string, id: number, campo: string, valor: string) => {
    setObservaciones(prev => ({
      ...prev,
      [seccion]: prev[seccion as keyof typeof prev].map(obs => 
        obs.id === id ? { ...obs, [campo]: valor } : obs
      )
    }));
  };

  const eliminarObservacion = (seccion: string, id: number) => {
    setObservaciones(prev => ({
      ...prev,
      [seccion]: prev[seccion as keyof typeof prev].filter(obs => obs.id !== id)
    }));
  };

  return {
    percepcionesRiesgo,
    setPercepcionesRiesgo,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    tiposContrato,
    setTiposContrato,
    trabajadores,
    setTrabajadores,
    cargos,
    setCargos,
    edades,
    setEdades,
    nivelesEstudios,
    setNivelesEstudios,
    estados,
    setEstados,
    nuevoCampo,
    setNuevoCampo,
    modoNuevo,
    setModoNuevo,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    agregarNuevoCampo,
    calcularPorcentajeSeccion,
    calcularPromedioGeneral,
    observaciones,
    agregarObservacion,
    actualizarObservacion,
    eliminarObservacion
  };
};

const PercepcionRiesgoManager = () => {
  const {
    percepcionesRiesgo,
    setPercepcionesRiesgo,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    tiposContrato,
    setTiposContrato,
    trabajadores,
    setTrabajadores,
    cargos,
    setCargos,
    edades,
    setEdades,
    nivelesEstudios,
    setNivelesEstudios,
    estados,
    setEstados,
    nuevoCampo,
    setNuevoCampo,
    modoNuevo,
    setModoNuevo,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    agregarNuevoCampo,
    calcularPorcentajeSeccion,
    calcularPromedioGeneral,
    observaciones,
    agregarObservacion,
    actualizarObservacion,
    eliminarObservacion
  } = usePercepcionRiesgoManager();

  // Filtrar percepciones de riesgo
  const filteredPercepciones = useMemo(() => 
    percepcionesRiesgo.filter(percepcion =>
      percepcion.nombreTrabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      percepcion.nombreEjecutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      percepcion.cargoPostula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      percepcion.estado.toLowerCase().includes(searchTerm.toLowerCase())
    ), [percepcionesRiesgo, searchTerm]
  );

  const selectedCount = percepcionesRiesgo.filter(percepcion => percepcion.selected).length;

  // Componente para renderizar observaciones
  const renderObservaciones = (seccion: string, titulo: string) => (
    <div className="p-4 bg-blue-50 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h5 className="font-medium text-blue-800">{titulo}</h5>
        <button 
          type="button"
          onClick={() => agregarObservacion(seccion)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Agregar Observación
        </button>
      </div>
      <div className="space-y-4">
        {observaciones[seccion as keyof typeof observaciones].map((obs, index) => (
          <div key={obs.id} className="bg-white rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Observación {index + 1}</span>
              {observaciones[seccion as keyof typeof observaciones].length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarObservacion(seccion, obs.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar observación"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={obs.descripcion}
                  onChange={(e) => actualizarObservacion(seccion, obs.id, 'descripcion', e.target.value)}
                  placeholder="Escriba la observación aquí..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evidencia (Archivo)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        actualizarObservacion(seccion, obs.id, 'evidencia', file.name);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {obs.evidencia && (
                    <span className="text-xs text-gray-500 px-2 py-2">
                      Archivo: {obs.evidencia}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSelectConAgregar = (label: string, campo: string, opciones: string[] | number[], setOpciones: (list: any[]) => void) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <select
          value={formData[campo as keyof typeof formData] as string}
          onChange={(e) => setFormData({ ...formData, [campo]: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Seleccionar {label.toLowerCase()}</option>
          {opciones.map((opcion) => (
            <option key={opcion} value={opcion}>{opcion}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setModoNuevo(prev => ({ ...prev, [campo]: true }))}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
        >
          +
        </button>
      </div>
      
      {modoNuevo[campo as keyof typeof modoNuevo] && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={nuevoCampo[campo as keyof typeof nuevoCampo]}
            onChange={(e) => setNuevoCampo(prev => ({ ...prev, [campo]: e.target.value }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Nuevo ${label.toLowerCase()}`}
          />
          <button
            type="button"
            onClick={() => agregarNuevoCampo(campo, opciones, setOpciones)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={() => setModoNuevo(prev => ({ ...prev, [campo]: false }))}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Percepción de Riesgo</h1>
          <p className="text-gray-600 text-sm sm:text-base">Evaluación de percepción de riesgo de trabajadores</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar evaluaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                Filtros
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
              <button
                onClick={handleAdd}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Nueva Evaluación
              </button>
              {selectedCount > 0 && (
                <button
                  onClick={deleteSelected}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 size={16} />
                  Eliminar ({selectedCount})
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos</option>
                    {tiposContrato.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos</option>
                    {estados.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Formulario de evaluación */}
        {mostrarFormulario && (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
              <h3 className="text-lg font-semibold">
                {editingId ? 'Editar Evaluación' : 'Nueva Evaluación'}
              </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Progreso: {[
                    formData.tipoContrato ? 1 : 0,
                    formData.nombreTrabajador ? 1 : 0,
                    Object.values(formData.seccionA).some(v => v !== '') ? 1 : 0,
                    Object.values(formData.seccionB).some(v => v !== '') ? 1 : 0,
                    Object.values(formData.seccionC).some(v => v !== '') ? 1 : 0,
                    Object.values(formData.seccionD).some(v => v !== '') ? 1 : 0,
                    Object.values(formData.seccionE).some(v => v !== '') ? 1 : 0
                  ].reduce((a, b) => a + b, 0)}/7 secciones completadas
                </p>
              </div>
              <button onClick={() => {
                setMostrarFormulario(false);
                resetForm();
              }} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Tipo de contrato */}
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-900 mb-3">Tipo de Contrato</h4>
                {renderSelectConAgregar("Tipo de Contrato", "tipoContrato", tiposContrato, setTiposContrato)}
              </div>

              {/* Información del trabajador */}
              {formData.tipoContrato && (
                <div className="border-b pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información del Trabajador</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderSelectConAgregar("Nombre Trabajador", "nombreTrabajador", trabajadores, setTrabajadores)}
                    {renderSelectConAgregar("Cargo", "cargoPostula", cargos, setCargos)}
                    {renderSelectConAgregar("Edad", "edad", edades, setEdades)}
                    {renderSelectConAgregar("Nivel de Estudios", "nivelEstudios", nivelesEstudios, setNivelesEstudios)}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Evaluación</label>
                      <input
                        type="date"
                        value={formData.fechaEvaluacion}
                        onChange={(e) => setFormData({ ...formData, fechaEvaluacion: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sección A: Adhesión a la norma */}
              {formData.tipoContrato && (
                <div className="border-b pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">A. Adhesión a la norma y políticas organizacionales</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">A.1. Evidencia respeto absoluto hacia los protocolo de trabajo</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionA: { ...prev.seccionA, A1: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionA.A1 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">A.2. Reconoce la utilidad de los protocolos y normativas</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionA: { ...prev.seccionA, A2: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionA.A2 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">A.3. Expresa incomodidad frente a alguna regla, protocolo o norma</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionA: { ...prev.seccionA, A3: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionA.A3 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">A.4. Ha saltado normas cuando una jefatura lo solicita</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionA: { ...prev.seccionA, A4: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionA.A4 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">A.5. Reconoce que su forma de trabajar impacta directa o indirectamente en otros</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionA: { ...prev.seccionA, A5: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionA.A5 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">A.6. En sus respuestas explicita la relevancia de las normas de sana convivencia</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionA: { ...prev.seccionA, A6: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionA.A6 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">A.7. El evaluado presenta alguna de estas condiciones: Considera que hay normas y protocolos poco útiles y/o ha estado implicado en riñas en las que ha agredido físicamente a otros trabajadores</p>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionA: { ...prev.seccionA, A7: 'Sí' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionA.A7 === 'Sí'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          Sí
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionA: { ...prev.seccionA, A7: 'No' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionA.A7 === 'No'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {renderObservaciones('seccionA', 'Observaciones Generales')}

                    {/* Resultados Sección A */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Desempeño</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option value="">Seleccionar</option>
                            <option value="Bajo">Bajo</option>
                            <option value="Medio">Medio</option>
                            <option value="Alto">Alto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adhesión a la norma y políticas organizacionales %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={calcularPorcentajeSeccion(formData.seccionA)}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                            placeholder="0-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección B: Conocimiento de riesgos */}
              {formData.tipoContrato && (
                <div className="border-b pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">B. Conocimiento de riesgos y medidas de control</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">B.1. Identifica correctamente los riesgos asociados a su trabajo</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionB: { ...prev.seccionB, B1: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionB.B1 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                        </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">B.2. Conoce las medidas de control implementadas</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionB: { ...prev.seccionB, B2: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionB.B2 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">B.3. Utiliza correctamente los elementos de protección personal</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionB: { ...prev.seccionB, B3: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionB.B3 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">B.4. Reporta condiciones inseguras cuando las identifica</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionB: { ...prev.seccionB, B4: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionB.B4 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">B.5. Participa activamente en charlas de seguridad</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionB: { ...prev.seccionB, B5: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionB.B5 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    {renderObservaciones('seccionB', 'Observaciones Generales')}

                    {/* Resultados Sección B */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Desempeño</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option value="">Seleccionar</option>
                            <option value="Bajo">Bajo</option>
                            <option value="Medio">Medio</option>
                            <option value="Alto">Alto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Conocimiento de riesgos %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={calcularPorcentajeSeccion(formData.seccionB)}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                            placeholder="0-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección C: Comportamiento seguro */}
              {formData.tipoContrato && (
                <div className="border-b pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">C. Comportamiento seguro y actitud preventiva</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">C.1. Mantiene una actitud preventiva en su trabajo</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionC: { ...prev.seccionC, C1: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionC.C1 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">C.2. Evita comportamientos de riesgo</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionC: { ...prev.seccionC, C2: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionC.C2 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">C.3. Colabora con sus compañeros en temas de seguridad</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionC: { ...prev.seccionC, C3: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionC.C3 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">C.4. Ha tenido incidentes o accidentes en el último año</p>
                        <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionC: { ...prev.seccionC, C4: 'Sí' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionC.C4 === 'Sí'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          Sí
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionC: { ...prev.seccionC, C4: 'No' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionC.C4 === 'No'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">C.5. Considera que la seguridad es responsabilidad de todos</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionC: { ...prev.seccionC, C5: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionC.C5 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">C.6. El evaluado presenta alguna de estas condiciones: Antecedentes de conducción temeraria; daño al equipo producto de maniobras arriesgadas; sobre valoración de sus capacidades (se respaldan por sus años de experiencia)</p>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionC: { ...prev.seccionC, C6: 'Sí' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionC.C6 === 'Sí'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          Sí
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionC: { ...prev.seccionC, C6: 'No' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionC.C6 === 'No'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {renderObservaciones('seccionC', 'Observaciones Generales')}

                    {/* Resultados Sección C */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Desempeño</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option value="">Seleccionar</option>
                            <option value="Bajo">Bajo</option>
                            <option value="Medio">Medio</option>
                            <option value="Alto">Alto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Comportamiento seguro %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={calcularPorcentajeSeccion(formData.seccionC)}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                            placeholder="0-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección D: Autocontrol y modulación emocional */}
              {formData.tipoContrato && (
                <div className="border-b pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">D. Autocontrol y modulación emocional</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">D.1. Reconoce las emociones que le generan el mal actuar de otros (rabia, tristeza o frustración)</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionD: { ...prev.seccionD, D1: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionD.D1 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">D.2. Está consciente de que los problemas personales pueden distraerlo de sus funciones</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionD: { ...prev.seccionD, D2: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionD.D2 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">D.3. Utiliza estrategias de autorregulación frente a situaciones complejas (deteniendo su trabajo, utilizando estrategias de respiración o focalizando la atención en otros aspectos)</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionD: { ...prev.seccionD, D3: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionD.D3 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">D.4. Tras autorregularse logra continuar con su trabajo con calma y normalidad</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionD: { ...prev.seccionD, D4: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionD.D4 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">D.5. Reconoce que los problemas personales lo han invadido mientras trabaja, provocando diminución de su desempeño</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionD: { ...prev.seccionD, D5: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionD.D5 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">D.6. En situaciones que le generan desagrado se le dificulta regularse</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionD: { ...prev.seccionD, D6: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionD.D6 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">D.7. Reconoce que en situaciones críticas tiende a bloquearse</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionD: { ...prev.seccionD, D7: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionD.D7 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">D.8. El evaluado presenta alguna de estas condiciones: Conflictos violentos con otros; jefaturas o personal de faenas/terreno</p>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionD: { ...prev.seccionD, D8: 'Sí' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionD.D8 === 'Sí'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          Sí
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionD: { ...prev.seccionD, D8: 'No' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionD.D8 === 'No'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {renderObservaciones('seccionD', 'Observaciones Generales')}

                    {/* Resultados Sección D */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Desempeño</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option value="">Seleccionar</option>
                            <option value="Bajo">Bajo</option>
                            <option value="Medio">Medio</option>
                            <option value="Alto">Alto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Autocontrol y modulación emocional %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={calcularPorcentajeSeccion(formData.seccionD)}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                            placeholder="0-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección E: Orientación a la conducta segura y autocuidado */}
              {formData.tipoContrato && (
                <div className="border-b pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">E. Orientación a la conducta segura y autocuidado</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">E.1. Explicita en su respuesta usar sus EPP</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionE: { ...prev.seccionE, E1: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionE.E1 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">E.2. Realiza actividades extra laborales que le permiten distraer: Caminatas, pescas, deportes etc</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionE: { ...prev.seccionE, E2: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionE.E2 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">E.3. Revisa su equipo de trabajo: Antes de la operación</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionE: { ...prev.seccionE, E3: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionE.E3 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">E.4. Revisa equipo de trabajo: Durante la operación</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionE: { ...prev.seccionE, E4: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionE.E4 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">E.5. Revisa equipo de trabajo: Después de la operación</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionE: { ...prev.seccionE, E5: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionE.E5 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">E.6. Reconoce explicitamente que con su actuar puede perjudicar a otros</p>
                      <div className="flex flex-wrap gap-2">
                        {['Siempre', 'Generalmente', 'Pocas veces', 'Nunca'].map((opcion) => (
                          <button
                            key={opcion}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              seccionE: { ...prev.seccionE, E6: opcion }
                            }))}
                            className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                              formData.seccionE.E6 === opcion
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-3">E.7. El evaluado presenta alguna de estas condiciones: Alta frecuencia de accidentabilidad, lesiones, reportes negativos de jefaturas anteriores en relación a velocidades de conduccion, acciones temerarias y uso de EPP</p>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionE: { ...prev.seccionE, E7: 'Sí' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionE.E7 === 'Sí'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          Sí
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            seccionE: { ...prev.seccionE, E7: 'No' }
                          }))}
                          className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                            formData.seccionE.E7 === 'No'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {renderObservaciones('seccionE', 'Observaciones Generales')}

                    {/* Resultados Sección E */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Desempeño</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option value="">Seleccionar</option>
                            <option value="Bajo">Bajo</option>
                            <option value="Medio">Medio</option>
                            <option value="Alto">Alto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Orientación a la conducta segura %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={calcularPorcentajeSeccion(formData.seccionE)}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                            placeholder="0-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resultados Finales */}
              {formData.tipoContrato && (
                <div className="border-b pb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Resultados Finales de la Evaluación</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Promedio General (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={calcularPromedioGeneral()}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                            placeholder="0-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Resultado Final</label>
                          <select 
                            value={formData.resultado}
                            onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="">Seleccionar</option>
                            <option value="Aprobado">Aprobado</option>
                            <option value="En Revisión">En Revisión</option>
                            <option value="Rechazado">Rechazado</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nota de Aprobación (%)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={calcularPromedioGeneral()}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                            placeholder="0-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Información del evaluador */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3">Información del Evaluador</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Evaluador</label>
                          <input
                            type="text"
                            value="Juan Molina"
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                            placeholder="Juan Molina"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Firma del Evaluador</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {renderObservaciones('finales', 'Observaciones Finales')}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formData.nombreTrabajador || !formData.tipoContrato}
                >
                  <Check size={16} />
                  {editingId ? 'Actualizar Evaluación' : 'Guardar Evaluación'}
                </button>
                <button
                  onClick={() => {
                    setMostrarFormulario(false);
                    resetForm();
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm transition-colors"
                >
                  Cerrar y Cancelar
                </button>
              </div>
              
              {/* Indicador de estado del formulario */}
              {(!formData.nombreTrabajador || !formData.tipoContrato) && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Complete la información básica del trabajador para poder guardar la evaluación.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabla de evaluaciones */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setPercepcionesRiesgo(prev => prev.map(percepcion => ({ ...percepcion, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap">Trabajador</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap">Ejecutor</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap">Cargo</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap">Fecha</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap">Resultado</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap">Nota (%)</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap">Estado</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPercepciones.map((percepcion) => (
                  <tr key={percepcion.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={percepcion.selected}
                        onChange={() => toggleSelect(percepcion.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{percepcion.nombreTrabajador}</div>
                          <div className="text-xs text-gray-500">{percepcion.tipoContrato}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{percepcion.nombreEjecutor}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{percepcion.cargoPostula}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{percepcion.fechaEvaluacion}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        percepcion.resultado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                        percepcion.resultado === 'En Revisión' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {percepcion.resultado}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        percepcion.notaAprobacion >= 80 ? 'bg-green-100 text-green-800' :
                        percepcion.notaAprobacion >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {percepcion.notaAprobacion}%
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        percepcion.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                        percepcion.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                        percepcion.estado === 'Pendiente' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {percepcion.estado}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(percepcion)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(percepcion.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600">
              <div>
                Mostrar {filteredPercepciones.length} de {percepcionesRiesgo.length} registros
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <span>Total evaluaciones: {percepcionesRiesgo.length}</span>
                <span>Seleccionadas: {selectedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PercepcionRiesgoPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return <PercepcionRiesgoManager />;
} 