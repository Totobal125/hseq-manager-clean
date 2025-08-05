"use client";
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, X, Check, Users, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import ErrorBoundary from "../components/ErrorBoundary";

type Trabajador = {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  cargo: string;
  departamento: string;
  centroTrabajo: string;
  estado: string;
  fechaCreacion: string;
  selected: boolean;
};

const useTrabajadoresManager = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([
    {
      id: 1,
      rut: "18652129-3",
      nombre: "Juan",
      apellido: "Molina",
      email: "juan.molina@empresa.com",
      telefono: "+56 9 1234 5678",
      fechaNacimiento: "1990-05-15",
      fechaIngreso: "2020-03-01",
      cargo: "Maestro Soldador",
      departamento: "Producción",
      centroTrabajo: "Planta A",
      estado: "Activo",
      fechaCreacion: "2024-01-15",
      selected: false
    },
    {
      id: 2,
      rut: "19616321-2",
      nombre: "María",
      apellido: "Soledad",
      email: "maria.soledad@empresa.com",
      telefono: "+56 9 2345 6789",
      fechaNacimiento: "1985-08-22",
      fechaIngreso: "2019-07-15",
      cargo: "Encargado de Área",
      departamento: "Producción",
      centroTrabajo: "Planta A",
      estado: "Activo",
      fechaCreacion: "2024-02-20",
      selected: false
    },
    {
      id: 3,
      rut: "10049166-4",
      nombre: "Hernán",
      apellido: "Fernández",
      email: "hernan.fernandez@empresa.com",
      telefono: "+56 9 3456 7890",
      fechaNacimiento: "1988-12-10",
      fechaIngreso: "2021-01-10",
      cargo: "Jefe de Mantenimiento",
      departamento: "Mantenimiento",
      centroTrabajo: "Planta B",
      estado: "Activo",
      fechaCreacion: "2024-03-10",
      selected: false
    }
  ]);

  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    fechaIngreso: "",
    cargo: "",
    departamento: "",
    centroTrabajo: "",
    estado: "Activo"
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCargo, setFilterCargo] = useState("");
  const [filterDepartamento, setFilterDepartamento] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [cargos, setCargos] = useState(['Maestro Soldador', 'Encargado de Área', 'Jefe de Mantenimiento', 'Operador de Máquina', 'Técnico de Calidad', 'Auxiliar de Producción']);
  const [departamentos, setDepartamentos] = useState(['Producción', 'Mantenimiento', 'Calidad', 'Logística', 'Administración']);
  const [centrosTrabajo, setCentrosTrabajo] = useState(['Planta A', 'Planta B', 'Oficinas Centrales', 'Almacén']);
  const [estados, setEstados] = useState(['Activo', 'Inactivo', 'Vacaciones', 'Licencia']);

  const [nuevoCampo, setNuevoCampo] = useState({ cargo: '', departamento: '', centroTrabajo: '', estado: '' });
  const [modoNuevo, setModoNuevo] = useState({ cargo: false, departamento: false, centroTrabajo: false, estado: false });

  const resetForm = () => {
    setFormData({
      rut: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      fechaNacimiento: "",
      fechaIngreso: "",
      cargo: "",
      departamento: "",
      centroTrabajo: "",
      estado: "Activo"
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (trabajador: Trabajador) => {
    setFormData({
      rut: trabajador.rut,
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      email: trabajador.email,
      telefono: trabajador.telefono,
      fechaNacimiento: trabajador.fechaNacimiento,
      fechaIngreso: trabajador.fechaIngreso,
      cargo: trabajador.cargo,
      departamento: trabajador.departamento,
      centroTrabajo: trabajador.centroTrabajo,
      estado: trabajador.estado
    });
    setEditingId(trabajador.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (!formData.rut || !formData.nombre || !formData.apellido || !formData.email || !formData.cargo) return;

    const nuevoTrabajador: Trabajador = {
      id: editingId || Date.now(),
      rut: formData.rut,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      fechaNacimiento: formData.fechaNacimiento,
      fechaIngreso: formData.fechaIngreso,
      cargo: formData.cargo,
      departamento: formData.departamento,
      centroTrabajo: formData.centroTrabajo,
      estado: formData.estado,
      fechaCreacion: editingId ? trabajadores.find(t => t.id === editingId)?.fechaCreacion || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
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
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    filterCargo,
    setFilterCargo,
    filterDepartamento,
    setFilterDepartamento,
    filterEstado,
    setFilterEstado,
    cargos,
    setCargos,
    departamentos,
    setDepartamentos,
    centrosTrabajo,
    setCentrosTrabajo,
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
    agregarNuevoCampo
  };
};

const TrabajadoresManager = () => {
  const {
    trabajadores,
    setTrabajadores,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    filterCargo,
    setFilterCargo,
    filterDepartamento,
    setFilterDepartamento,
    filterEstado,
    setFilterEstado,
    cargos,
    setCargos,
    departamentos,
    setDepartamentos,
    centrosTrabajo,
    setCentrosTrabajo,
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
    agregarNuevoCampo
  } = useTrabajadoresManager();

  const filteredTrabajadores = useMemo(() => {
    return trabajadores.filter(trabajador =>
      (trabajador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
       trabajador.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
       trabajador.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
       trabajador.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCargo === "" || trabajador.cargo === filterCargo) &&
      (filterDepartamento === "" || trabajador.departamento === filterDepartamento) &&
      (filterEstado === "" || trabajador.estado === filterEstado)
    );
  }, [trabajadores, searchTerm, filterCargo, filterDepartamento, filterEstado]);

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
            required={campo === 'cargo'}
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Trabajadores</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo Trabajador
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
                    placeholder="Buscar trabajadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
                </div>
            </div>

            {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filterCargo}
                onChange={(e) => setFilterCargo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los cargos</option>
                {cargos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
              <select
                value={filterDepartamento}
                onChange={(e) => setFilterDepartamento(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los departamentos</option>
                  {departamentos.map(departamento => (
                    <option key={departamento} value={departamento}>{departamento}</option>
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
                  {editingId ? "Editar Trabajador" : "Nuevo Trabajador"}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                <input
                  type="text"
                  value={formData.rut}
                    onChange={(e) => setFormData({...formData, rut: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345678-9"
                  required
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  type="text"
                  value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+56 9 1234 5678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                <input
                  type="date"
                  value={formData.fechaIngreso}
                    onChange={(e) => setFormData({...formData, fechaIngreso: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  {renderSelectConAgregar('Cargo', 'cargo', cargos, setCargos)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  {renderSelectConAgregar('Departamento', 'departamento', departamentos, setDepartamentos)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabajo</label>
                  {renderSelectConAgregar('Centro de Trabajo', 'centroTrabajo', centrosTrabajo, setCentrosTrabajo)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  {renderSelectConAgregar('Estado', 'estado', estados, setEstados)}
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
                        setTrabajadores(prev => prev.map(item => ({ ...item, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trabajador</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contacto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Departamento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Centro</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Fecha Ingreso</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrabajadores.map((trabajador) => (
                <tr key={trabajador.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={trabajador.selected}
                        onChange={() => toggleSelect(trabajador.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{trabajador.nombre} {trabajador.apellido}</div>
                      <div className="text-sm text-gray-500">{trabajador.rut}</div>
                      <div className="text-sm text-gray-500 md:hidden">
                        <Mail className="w-3 h-3 inline mr-1" />
                        {trabajador.email}
                        </div>
                      <div className="text-sm text-gray-500 md:hidden">
                        <Phone className="w-3 h-3 inline mr-1" />
                        {trabajador.telefono}
                      </div>
                      <div className="text-sm text-gray-500 md:hidden">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {trabajador.departamento} - {trabajador.centroTrabajo}
                      </div>
                      <div className="text-sm text-gray-500 md:hidden">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {trabajador.fechaIngreso}
                    </div>
                  </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-900">{trabajador.email}</div>
                    <div className="text-sm text-gray-500">{trabajador.telefono}</div>
                  </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{trabajador.cargo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{trabajador.departamento}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">{trabajador.centroTrabajo}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        trabajador.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                        trabajador.estado === 'Inactivo' ? 'bg-red-100 text-red-800' :
                        trabajador.estado === 'Vacaciones' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trabajador.estado}
                    </span>
                  </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{trabajador.fechaIngreso}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(trabajador)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(trabajador.id)}
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

          {filteredTrabajadores.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay trabajadores</h3>
              <p className="text-gray-500">Comienza agregando un nuevo trabajador.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TrabajadoresPage() {
  return (
    <ErrorBoundary>
      <TrabajadoresManager />
    </ErrorBoundary>
  );
} 