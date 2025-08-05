"use client";
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, X, Check, User, FileText, Calendar, Download, AlertCircle } from 'lucide-react';

type Trabajador = {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  cargo: string;
  departamento: string;
  fechaIngreso: string;
  documentos: Documento[];
  selected: boolean;
};

type Documento = {
  id: number;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
  estado: string;
  descripcion: string;
};

const useDocumentacionManager = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([
    {
      id: 1,
      nombre: "Juan Carlos",
      apellido: "Pérez",
      rut: "18652129-3",
      cargo: "Maestro Soldador",
      departamento: "Producción",
      fechaIngreso: "2020-03-15",
      documentos: [
        {
          id: 1,
          nombre: "Contrato Indefinido",
          tipo: "Contrato de Trabajo",
          fechaCreacion: "2020-03-15",
          estado: "Vigente",
          descripcion: "Contrato de trabajo indefinido firmado"
        },
        {
          id: 2,
          nombre: "Examen Preocupacional",
          tipo: "Examen Preocupacional",
          fechaCreacion: "2020-03-10",
          estado: "Vigente",
          descripcion: "Examen médico preocupacional completo"
        },
        {
          id: 3,
          nombre: "Certificado EPP",
          tipo: "Certificado de EPP",
          fechaCreacion: "2024-01-15",
          estado: "Vigente",
          descripcion: "Certificado de entrega de equipos de protección personal"
        }
      ],
      selected: false
    },
    {
      id: 2,
      nombre: "María Elena",
      apellido: "González",
      rut: "19616321-2",
      cargo: "Encargada de Área Producción",
      departamento: "Producción",
      fechaIngreso: "2019-08-20",
      documentos: [
        {
          id: 4,
          nombre: "Contrato Indefinido",
          tipo: "Contrato de Trabajo",
          fechaCreacion: "2019-08-20",
          estado: "Vigente",
          descripcion: "Contrato de trabajo indefinido firmado"
        },
        {
          id: 5,
          nombre: "Certificado de Capacitación",
          tipo: "Certificado de Capacitación",
          fechaCreacion: "2023-11-10",
          estado: "Vigente",
          descripcion: "Certificado de capacitación en seguridad industrial"
        },
        {
          id: 6,
          nombre: "Examen de Salud Ocupacional",
          tipo: "Examen de Salud Ocupacional",
          fechaCreacion: "2024-02-15",
          estado: "Vigente",
          descripcion: "Examen de salud ocupacional anual"
        }
      ],
      selected: false
    },
    {
      id: 3,
      nombre: "Carlos Alberto",
      apellido: "López",
      rut: "10049166-4",
      cargo: "Jefe de Área Producción",
      departamento: "Producción",
      fechaIngreso: "2018-05-10",
      documentos: [
        {
          id: 7,
          nombre: "Contrato Indefinido",
          tipo: "Contrato de Trabajo",
          fechaCreacion: "2018-05-10",
          estado: "Vigente",
          descripcion: "Contrato de trabajo indefinido firmado"
        },
        {
          id: 8,
          nombre: "Certificado de Estudios",
          tipo: "Certificado de Estudios",
          fechaCreacion: "2018-05-10",
          estado: "Vigente",
          descripcion: "Certificado de título profesional"
        },
        {
          id: 9,
          nombre: "Certificado de Antecedentes",
          tipo: "Certificado de Antecedentes",
          fechaCreacion: "2024-01-20",
          estado: "Vigente",
          descripcion: "Certificado de antecedentes penales vigente"
        }
      ],
      selected: false
    }
  ]);

  const [tiposDocumento, setTiposDocumento] = useState([
    "Contrato de Trabajo",
    "Carnet de Identidad",
    "Certificado de Estudios",
    "Certificado de Capacitación",
    "Examen Preocupacional",
    "Examen de Salud Ocupacional",
    "Certificado de Antecedentes",
    "Certificado de AFP",
    "Certificado de Isapre/Fonasa",
    "Certificado de Seguro de Accidentes",
    "Certificado de EPP",
    "Otros"
  ]);

  const [estados, setEstados] = useState(['Vigente', 'Vencido', 'Pendiente', 'En Revisión']);
  const [departamentos, setDepartamentos] = useState(['Producción', 'Administración', 'Mantenimiento', 'Calidad', 'Logística']);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterDepartamento, setFilterDepartamento] = useState('');
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    cargo: '',
    departamento: '',
    fechaIngreso: ''
  });

  const [nuevoCampo, setNuevoCampo] = useState({ 
    tipoDocumento: '', 
    estado: '', 
    departamento: '' 
  });
  const [modoNuevo, setModoNuevo] = useState({ 
    tipoDocumento: false, 
    estado: false, 
    departamento: false 
  });

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      rut: '',
      cargo: '',
      departamento: '',
      fechaIngreso: ''
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (trabajador: Trabajador) => {
    setFormData({
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      rut: trabajador.rut,
      cargo: trabajador.cargo,
      departamento: trabajador.departamento,
      fechaIngreso: trabajador.fechaIngreso
    });
    setEditingId(trabajador.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (!formData.nombre || !formData.apellido || !formData.rut || !formData.cargo || !formData.departamento || !formData.fechaIngreso) return;
    
    const nuevoTrabajador: Trabajador = {
      id: editingId || Date.now(),
      nombre: formData.nombre,
      apellido: formData.apellido,
      rut: formData.rut,
      cargo: formData.cargo,
      departamento: formData.departamento,
      fechaIngreso: formData.fechaIngreso,
      documentos: [],
      selected: false
    };

    if (editingId) {
      setTrabajadores(prev => prev.map(item => item.id === editingId ? nuevoTrabajador : item));
    } else {
      setTrabajadores(prev => [...prev, nuevoTrabajador]);
    }

    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este trabajador?')) {
      setTrabajadores(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setTrabajadores(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const deleteSelected = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar los trabajadores seleccionados?')) {
      setTrabajadores(prev => prev.filter(item => !item.selected));
    }
  };

  const handleVerDocumentos = (trabajador: Trabajador) => {
    setSelectedTrabajador(trabajador);
  };

  const handleCerrarDocumentos = () => {
    setSelectedTrabajador(null);
  };

  const handleDescargar = (documento: Documento) => {
    alert("Función de descarga no disponible. Requiere implementación de base de datos.");
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
    trabajadores,
    setTrabajadores,
    tiposDocumento,
    setTiposDocumento,
    estados,
    setEstados,
    departamentos,
    setDepartamentos,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    filterEstado,
    setFilterEstado,
    filterDepartamento,
    setFilterDepartamento,
    selectedTrabajador,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    formData,
    setFormData,
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
    handleVerDocumentos,
    handleCerrarDocumentos,
    handleDescargar,
    agregarNuevoCampo
  };
};

const DocumentacionManager = () => {
  const {
    trabajadores,
    setTrabajadores,
    tiposDocumento,
    setTiposDocumento,
    estados,
    setEstados,
    departamentos,
    setDepartamentos,
    searchTerm,
    setSearchTerm,
    filterTipo,
    setFilterTipo,
    filterEstado,
    setFilterEstado,
    filterDepartamento,
    setFilterDepartamento,
    selectedTrabajador,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    formData,
    setFormData,
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
    handleVerDocumentos,
    handleCerrarDocumentos,
    handleDescargar,
    agregarNuevoCampo
  } = useDocumentacionManager();

  const filteredTrabajadores = useMemo(() => {
    return trabajadores.filter(trabajador => {
      const matchesSearch = trabajador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trabajador.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trabajador.rut.includes(searchTerm) ||
                           trabajador.cargo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartamento = !filterDepartamento || trabajador.departamento === filterDepartamento;
      
      if (filterTipo || filterEstado) {
        const documentosFiltrados = trabajador.documentos.filter(doc => {
          const matchesTipo = !filterTipo || doc.tipo === filterTipo;
          const matchesEstado = !filterEstado || doc.estado === filterEstado;
          return matchesTipo && matchesEstado;
        });
        return matchesSearch && matchesDepartamento && documentosFiltrados.length > 0;
      }
      
      return matchesSearch && matchesDepartamento;
    });
  }, [trabajadores, searchTerm, filterTipo, filterEstado, filterDepartamento]);

  const selectedCount = useMemo(() => {
    return trabajadores.filter(item => item.selected).length;
  }, [trabajadores]);

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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Documentación de Trabajadores</h1>
          <p className="text-gray-600 text-sm sm:text-base">Gestiona y visualiza la documentación de todos los trabajadores</p>
        </div>

        {/* Alerta de implementación */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Función de Descarga No Disponible</h3>
              <p className="text-sm text-yellow-700 mt-1">
                La funcionalidad de descarga de documentos requiere la implementación de la base de datos. 
                Por el momento solo se puede visualizar la información.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="space-y-4">
            {/* Barra superior */}
            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
              <div className="flex flex-col gap-4 w-full xl:w-auto">
                {/* Buscador y Botón Agregar */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Buscar trabajadores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Agregar Trabajador</span>
                    <span className="sm:hidden">Agregar</span>
                  </button>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos los tipos</option>
                    {tiposDocumento.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>

                  <select
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos los estados</option>
                    {estados.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>

                  <select
                    value={filterDepartamento}
                    onChange={(e) => setFilterDepartamento(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos los departamentos</option>
                    {departamentos.map(depto => (
                      <option key={depto} value={depto}>{depto}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                {selectedCount > 0 && (
                  <button
                    onClick={deleteSelected}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Eliminar Seleccionados</span>
                    <span className="sm:hidden">Eliminar ({selectedCount})</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de agregar/editar */}
        {mostrarFormulario && (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Editar Trabajador' : 'Nuevo Trabajador'}
              </h3>
              <button onClick={() => {
                setMostrarFormulario(false);
                resetForm();
              }} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del trabajador"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Apellido del trabajador"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUT *</label>
                <input
                  type="text"
                  value={formData.rut}
                  onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12345678-9"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
                <input
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cargo del trabajador"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                {renderSelectConAgregar('Departamento', 'departamento', departamentos, setDepartamentos)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso *</label>
                <input
                  type="date"
                  value={formData.fechaIngreso}
                  onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Check size={16} />
                {editingId ? 'Actualizar' : 'Agregar'}
              </button>
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  resetForm();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Tabla de Trabajadores */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setTrabajadores(prev => prev.map(item => ({ ...item, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap uppercase tracking-wider">Trabajador</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap uppercase tracking-wider hidden md:table-cell">Cargo</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap uppercase tracking-wider hidden lg:table-cell">Departamento</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap uppercase tracking-wider hidden sm:table-cell">Fecha Ingreso</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap uppercase tracking-wider">Documentos</th>
                  <th className="p-3 font-semibold text-gray-700 whitespace-nowrap uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrabajadores.map((trabajador) => (
                  <tr key={trabajador.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={trabajador.selected}
                        onChange={() => toggleSelect(trabajador.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{trabajador.nombre} {trabajador.apellido}</div>
                          <div className="text-sm text-gray-500">{trabajador.rut}</div>
                          <div className="text-sm text-gray-500 md:hidden">{trabajador.cargo}</div>
                          <div className="text-sm text-gray-500 lg:hidden">{trabajador.departamento}</div>
                          <div className="text-sm text-gray-500 sm:hidden">{new Date(trabajador.fechaIngreso).toLocaleDateString('es-CL')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">{trabajador.cargo}</td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{trabajador.departamento}</td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                      {new Date(trabajador.fechaIngreso).toLocaleDateString('es-CL')}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm text-gray-900">{trabajador.documentos.length} documentos</span>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerDocumentos(trabajador)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors text-sm"
                        >
                          <span className="hidden sm:inline">Ver Documentos</span>
                          <span className="sm:hidden">Ver</span>
                        </button>
                        <button
                          onClick={() => handleEdit(trabajador)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(trabajador.id)}
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
                Mostrar {filteredTrabajadores.length} de {trabajadores.length} registros
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <span>Total trabajadores: {trabajadores.length}</span>
                <span>Seleccionados: {selectedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Documentos */}
        {selectedTrabajador && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Documentos de {selectedTrabajador.nombre} {selectedTrabajador.apellido}
                  </h3>
                  <button
                    onClick={handleCerrarDocumentos}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTrabajador.documentos.map((documento) => (
                    <div key={documento.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <FileText className="w-4 h-4 mr-2 text-blue-500" />
                            <h4 className="text-sm font-medium text-gray-900">{documento.nombre}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Tipo:</span> {documento.tipo}
                            </div>
                            <div>
                              <span className="font-medium">Estado:</span>
                              <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                documento.estado === "Vigente" ? "bg-green-100 text-green-800" :
                                documento.estado === "Vencido" ? "bg-red-100 text-red-800" :
                                documento.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {documento.estado}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Fecha:</span> {new Date(documento.fechaCreacion).toLocaleDateString('es-CL')}
                            </div>
                            <div>
                              <span className="font-medium">Descripción:</span> {documento.descripcion}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={() => handleDescargar(documento)}
                            className="flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                            title="Descarga no disponible"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleCerrarDocumentos}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentacionManager; 