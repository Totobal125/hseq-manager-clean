"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, X, Check, Filter, Menu } from 'lucide-react';
import DesempenoChart from "../components/desempenoChart";

type Employee = {
  id: number;
  nombre: string;
  cargo: string;
  periodo: string;
  planBuenConductor: number;
  matrizImpacto: number;
  fonoDenuncia: number | 'NA';
  variablesOperacionales: number | 'NA';
  observacionCabina: number | 'NA';
  ops: number | 'NA';
  percepcionRiesgo: number | 'NA';
  incidentes: number | 'NA';
  incidentesCTPFatal: number | 'NA';
  formularioAsistencia: number | 'NA';
  incidentesDAM: number | 'NA';
  notaFinal: number;
  selected: boolean;
};

type NumericFieldKeys = 
  'planBuenConductor' | 'matrizImpacto' | 'fonoDenuncia' |
  'variablesOperacionales' | 'observacionCabina' | 'ops' |
  'percepcionRiesgo' | 'incidentes' |
  'incidentesCTPFatal' | 'formularioAsistencia' | 'incidentesDAM' |
  'notaFinal';

const valueFields: (keyof Employee)[] = [
  'planBuenConductor',
  'matrizImpacto',
  'fonoDenuncia',
  'variablesOperacionales',
  'observacionCabina',
  'ops',
  'percepcionRiesgo',
  'incidentes',
  'incidentesCTPFatal',
  'formularioAsistencia',
  'incidentesDAM',
  'notaFinal'
];

// Datos iniciales
const initialEmployees: Employee[] = [
  {
    id: 1,
    nombre: 'Jairo Cadiz Zapata',
    cargo: 'Desarrollador Web',
    periodo: '01-07-2025',
    planBuenConductor: 5.0,
    matrizImpacto: 5.0,
    fonoDenuncia: 5.0,
    variablesOperacionales: 5.0,
    observacionCabina: 3.6,
    ops: 4.3,
    percepcionRiesgo: 3.7,
    incidentes: 1.9,
    incidentesCTPFatal: 'NA',
    formularioAsistencia: 'NA',
    incidentesDAM: 'NA',
    notaFinal: 4.2,
    selected: false
  },
  {
    id: 2,
    nombre: 'Juan Cruz Barberis Diaz',
    cargo: 'Desarrollador Móvil',
    periodo: '01-07-2025',
    planBuenConductor: 4.3,
    matrizImpacto: 3.7,
    fonoDenuncia: 'NA',
    variablesOperacionales: 4.5,
    observacionCabina: 5.0,
    ops: 1.6,
    percepcionRiesgo: 1.6,
    incidentes: 1.2,
    incidentesCTPFatal: 'NA',
    formularioAsistencia: 'NA',
    incidentesDAM: 'NA',
    notaFinal: 3.3,
    selected: false
  },
  {
    id: 3,
    nombre: 'Karen Viviana Antonio Jara',
    cargo: 'Líder Técnico',
    periodo: '01-07-2025',
    planBuenConductor: 5.0,
    matrizImpacto: 3.4,
    fonoDenuncia: 5.0,
    variablesOperacionales: 4.6,
    observacionCabina: 5.0,
    ops: 4.0,
    percepcionRiesgo: 5.0,
    incidentes: 4.0,
    incidentesCTPFatal: 5.0,
    formularioAsistencia: 4.5,
    incidentesDAM: 5.0,
    notaFinal: 4.7,
    selected: false
  },
  {
    id: 4,
    nombre: 'Pruebas Play Store',
    cargo: 'Desarrollador Móvil',
    periodo: '01-07-2025',
    planBuenConductor: 5.0,
    matrizImpacto: 5.0,
    fonoDenuncia: 'NA',
    variablesOperacionales: 'NA',
    observacionCabina: 'NA',
    ops: 'NA',
    percepcionRiesgo: 'NA',
    incidentes: 'NA',
    incidentesCTPFatal: 'NA',
    formularioAsistencia: 'NA',
    incidentesDAM: 'NA',
    notaFinal: 5.0,
    selected: false
  }
];

// Configuración de campos y headers
const evaluationFields: { key: NumericFieldKeys; label: string }[] = [
  { key: 'planBuenConductor', label: 'Plan Buen Conductor' },
  { key: 'matrizImpacto', label: 'Matriz de Impacto' },
  { key: 'fonoDenuncia', label: 'Fono Denuncia' },
  { key: 'variablesOperacionales', label: 'Variables Operacionales' },
  { key: 'observacionCabina', label: 'Observación en Cabina' },
  { key: 'ops', label: 'OPS' },
  { key: 'percepcionRiesgo', label: 'Percepción del Riesgo' },
  { key: 'incidentes', label: 'Incidentes' },
  { key: 'incidentesCTPFatal', label: 'Incidentes CTP y Fatal' },
  { key: 'formularioAsistencia', label: 'Formulario Asistencia' },
  { key: 'incidentesDAM', label: 'Incidentes DAM (Solo)' },
  { key: 'notaFinal', label: 'Nota Final' }
];

const tableHeaders = [
  'Sel', 'Nombre', 'Cargo', 'Periodo', 'Plan Buen Conductor', 'Matriz de Impacto', 'Fono Denuncia',
  'Variables Operacionales', 'Observación en Cabina', 'OPS', 'Percepción del Riesgo',
  'Incidentes', 'Incidentes CTP y Fatal', 'Formulario asistencia', 'Incidentes DAM (Solo)', 
  'Nota Final', 'Acciones'
];

// Formulario inicial
const initialFormData: Omit<Employee, 'id' | 'notaFinal' | 'selected'> = {
  nombre: '',
  cargo: '',
  periodo: new Date().toISOString().split('T')[0],
  planBuenConductor: 0,
  matrizImpacto: 0,
  fonoDenuncia: 0,
  variablesOperacionales: 0,
  observacionCabina: 0,
  ops: 0,
  percepcionRiesgo: 0,
  incidentes: 0,
  incidentesCTPFatal: 'NA',
  formularioAsistencia: 'NA',
  incidentesDAM: 'NA',
};

// Constantes para localStorage
const STORAGE_KEYS = {
  EMPLOYEES: 'employee_manager_employees',
  SEARCH_TERM: 'employee_manager_search_term',
  FILTERS: 'employee_manager_filters'
};

// Utilidades de localStorage
const storage = {
  save: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  load: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Hook personalizado para gestión de empleados con localStorage
const useEmployeeManager = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Employee, 'id' | 'notaFinal' | 'selected'>>(initialFormData);
  const [showFilters, setShowFilters] = useState(false);

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    const savedEmployees = storage.load(STORAGE_KEYS.EMPLOYEES);
    const savedSearchTerm = storage.load(STORAGE_KEYS.SEARCH_TERM, '');
    
    if (savedEmployees && savedEmployees.length > 0) {
      setEmployees(savedEmployees);
    }
    setSearchTerm(savedSearchTerm);
  }, []);

  // Guardar empleados en localStorage cuando cambian
  useEffect(() => {
    storage.save(STORAGE_KEYS.EMPLOYEES, employees);
  }, [employees]);

  // Guardar término de búsqueda en localStorage
  useEffect(() => {
    storage.save(STORAGE_KEYS.SEARCH_TERM, searchTerm);
  }, [searchTerm]);

  // Calcular nota final
type EvaluatedMetrics = {
  [key: string]: number | string;
};

const calculateFinalGrade = (data: EvaluatedMetrics): string => {
  const numericFields = evaluationFields.map(field => field.key);
  let sum = 0;
  let count = 0;

  numericFields.forEach(field => {
    if (data[field] !== 'NA' && data[field] !== '' && !isNaN(Number(data[field]))) {
      sum += parseFloat(data[field] as string);
      count++;
    }
  });

  return count > 0 ? (sum / count).toFixed(1) : '0.0';
};

  // Resetear formulario
  const resetForm = () => {
    setFormData(initialFormData);
    setShowAddForm(false);
    setEditingId(null);
  };

  // Agregar empleado
  const handleAdd = () => {
    if (!formData.nombre || !formData.cargo) return;
    
    const notaFinal = calculateFinalGrade(formData);
    const newEmployee = {
      id: Date.now(),
      ...formData,
      notaFinal: parseFloat(notaFinal),
      selected: false
    };
    setEmployees(prev => [...prev, newEmployee]);
    resetForm();
  };

  // Editar empleado
  const handleEdit = (employee: Employee) => {
  const {
    nombre,
    cargo,
    periodo,
    planBuenConductor,
    matrizImpacto,
    fonoDenuncia,
    variablesOperacionales,
    observacionCabina,
    ops,
    percepcionRiesgo,
    incidentes,
    incidentesCTPFatal,
    formularioAsistencia,
    incidentesDAM
  } = employee;

  setEditingId(employee.id);

  setFormData({
    nombre,
    cargo,
    periodo,
    planBuenConductor,
    matrizImpacto,
    fonoDenuncia: fonoDenuncia === 'NA' ? 0 : Number(fonoDenuncia),
    variablesOperacionales: variablesOperacionales === 'NA' ? 0 : Number(variablesOperacionales),
    observacionCabina: observacionCabina === 'NA' ? 0 : Number(observacionCabina),
    ops: ops === 'NA' ? 0 : Number(ops),
    percepcionRiesgo: percepcionRiesgo === 'NA' ? 0 : Number(percepcionRiesgo),
    incidentes: incidentes === 'NA' ? 0 : Number(incidentes),
    incidentesCTPFatal,
    formularioAsistencia,
    incidentesDAM
  });

  setShowAddForm(true);
};

  // Actualizar empleado
  const handleUpdate = () => {
    if (!editingId || !formData.nombre || !formData.cargo) return;
    
    const notaFinal = calculateFinalGrade(formData);
    setEmployees(prev => prev.map(emp =>
      emp.id === editingId ? { 
        ...emp, 
        ...formData, 
        notaFinal: parseFloat(notaFinal)
      } : emp
    ));
    resetForm();
  };

  // Eliminar empleado
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evaluado?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  // Toggle selección
  const toggleSelect = (id: number) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === id ? { ...emp, selected: !emp.selected } : emp
    ));
  };

  // Eliminar seleccionados
  const deleteSelected = () => {
    const selectedCount = employees.filter(emp => emp.selected).length;
    if (selectedCount > 0 && window.confirm(`¿Eliminar ${selectedCount} evaluado(s) seleccionado(s)?`)) {
      setEmployees(prev => prev.filter(emp => !emp.selected));
    }
  };

  // Limpiar localStorage
  const clearStorage = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos guardados?')) {
      Object.values(STORAGE_KEYS).forEach(key => storage.remove(key));
      setEmployees(initialEmployees);
      setSearchTerm('');
      resetForm();
    }
  };

  return {
    employees,
    showAddForm,
    setShowAddForm,
    editingId,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    showFilters,
    setShowFilters,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    clearStorage
  };
};

// Utilidades
const getValueColor = (value: string | number | undefined): string => {
  if (value === 'NA' || value === undefined) return 'text-gray-400';
  const numValue = parseFloat(String(value));
  if (numValue >= 4.5) return 'text-green-600';
  if (numValue >= 3.0) return 'text-yellow-600';
  return 'text-red-600';
};

// Componente principal
const EmployeeManager = () => {
  const {
    employees,
    showAddForm,
    setShowAddForm,
    editingId,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    showFilters,
    setShowFilters,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    toggleSelect,
    deleteSelected,
    clearStorage
  } = useEmployeeManager();

  // Filtrar empleados
  const filteredEmployees = useMemo(() => 
    employees.filter(emp =>
      emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    ), [employees, searchTerm]
  );

  const selectedCount = employees.filter(emp => emp.selected).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestión Desempeño</h1>
          <p className="text-gray-600 text-sm sm:text-base">Administra los evaluados y sus métricas de rendimiento</p>
        </div>

        {/* Gráficos */}
        <div className="mb-6">
          <DesempenoChart />
        </div>

        {/* Controles superiores */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="space-y-4">
            {/* Barra superior */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:w-auto">
                {/* Buscador */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar evaluado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Botón de filtros móvil */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  <Filter size={16} />
                  Filtros
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
                
                <button
                  onClick={clearStorage}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  title="Limpiar datos guardados"
                >
                  <span className="hidden sm:inline">Limpiar Datos</span>
                  <span className="sm:hidden">Limpiar</span>
                </button>
                
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Agregar Evaluado</span>
                  <span className="sm:hidden">Agregar</span>
                </button>
              </div>
            </div>

            {/* Filtros expandibles */}
            {showFilters && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <select className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>julio-2025</option>
                    <option>junio-2025</option>
                    <option>mayo-2025</option>
                  </select>
                  
                  <select className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Todos los cargos</option>
                    <option>Desarrollador Web</option>
                    <option>Desarrollador Móvil</option>
                    <option>Líder Técnico</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Formulario de agregar/editar */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Editar Evaluado' : 'Nuevo Evaluado'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Información básica */}
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-900 mb-3">Información Básica</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre completo"
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
                      placeholder="Cargo del empleado"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                    <input
                      type="date"
                      value={formData.periodo}
                      onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Métricas numéricas */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Métricas de Evaluación</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {evaluationFields.map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
              <button
                onClick={editingId ? handleUpdate : handleAdd}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Check size={16} />
                {editingId ? 'Actualizar' : 'Agregar'}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Tabla de evaluados */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header} className="p-3 font-semibold text-gray-700 whitespace-nowrap min-w-[100px]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={employee.selected}
                        onChange={() => toggleSelect(employee.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3 font-medium text-gray-900 whitespace-nowrap">{employee.nombre}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{employee.cargo}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{employee.periodo}</td>
                    {evaluationFields.map(({ key }) => (
                      <td key={key} className={`p-3 whitespace-nowrap font-medium ${getValueColor(employee[key])}`}>
                        {employee[key]}
                      </td>
                    ))}
                    <td className={`p-3 whitespace-nowrap font-medium ${getValueColor(employee.incidentesCTPFatal)}`}>
                      {employee.incidentesCTPFatal}
                    </td>
                    <td className={`p-3 whitespace-nowrap font-medium ${getValueColor(employee.formularioAsistencia)}`}>
                      {employee.formularioAsistencia}
                    </td>
                    <td className={`p-3 whitespace-nowrap font-medium ${getValueColor(employee.incidentesDAM)}`}>
                      {employee.incidentesDAM}
                    </td>
                    <td className={`p-3 whitespace-nowrap font-bold ${getValueColor(employee.notaFinal)}`}>
                      {employee.notaFinal}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
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
                Mostrar {filteredEmployees.length} de {employees.length} registros
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <span>Total evaluados: {employees.length}</span>
                <span>Seleccionados: {selectedCount}</span>
                <span className="text-green-600">📁 Datos guardados automáticamente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManager;