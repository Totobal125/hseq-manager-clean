"use client";
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, X, Check, Users } from 'lucide-react';
import ErrorBoundary from "../components/ErrorBoundary";

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  fechaCreacion: string;
  selected: boolean;
};

const useUsuariosManager = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@empresa.com",
      rol: "Superusuario",
      estado: "Activo",
      fechaCreacion: "2024-01-15",
      selected: false
    },
    {
      id: 2,
      nombre: "María González",
      email: "maria.gonzalez@empresa.com",
      rol: "Prevencionista",
      estado: "Activo",
      fechaCreacion: "2024-02-20",
      selected: false
    },
    {
      id: 3,
      nombre: "Carlos López",
      email: "carlos.lopez@empresa.com",
      rol: "Encargado de Área",
      estado: "Activo",
      fechaCreacion: "2024-03-10",
      selected: false
    }
  ]);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rol: "",
    estado: "Activo"
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [roles, setRoles] = useState(['Superusuario', 'Prevencionista', 'Encargado de Área', 'Trabajador']);
  const [estados, setEstados] = useState(['Activo', 'Inactivo', 'Pendiente']);

  const [nuevoCampo, setNuevoCampo] = useState({ rol: '', estado: '' });
  const [modoNuevo, setModoNuevo] = useState({ rol: false, estado: false });

  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      rol: "",
      estado: "Activo"
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (usuario: Usuario) => {
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado
    });
    setEditingId(usuario.id);
    setMostrarFormulario(true);
  };

  const handleUpdate = () => {
    if (!formData.nombre || !formData.email || !formData.rol) return;

    const nuevoUsuario: Usuario = {
      id: editingId || Date.now(),
      nombre: formData.nombre,
      email: formData.email,
      rol: formData.rol,
      estado: formData.estado,
      fechaCreacion: editingId ? usuarios.find(u => u.id === editingId)?.fechaCreacion || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      selected: false
    };

    if (editingId) {
      setUsuarios(prev => prev.map(item => item.id === editingId ? nuevoUsuario : item));
    } else {
      setUsuarios(prev => [...prev, nuevoUsuario]);
    }

    setMostrarFormulario(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsuarios(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleSelect = (id: number) => {
    setUsuarios(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const deleteSelected = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar los usuarios seleccionados?')) {
      setUsuarios(prev => prev.filter(item => !item.selected));
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
    usuarios,
    setUsuarios,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    filterRol,
    setFilterRol,
    filterEstado,
    setFilterEstado,
    roles,
    setRoles,
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

const UsuariosManager = () => {
  const {
    usuarios,
    setUsuarios,
    formData,
    setFormData,
    mostrarFormulario,
    setMostrarFormulario,
    editingId,
    searchTerm,
    setSearchTerm,
    filterRol,
    setFilterRol,
    filterEstado,
    setFilterEstado,
    roles,
    setRoles,
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
  } = useUsuariosManager();

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter(usuario =>
      (usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
       usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRol === "" || usuario.rol === filterRol) &&
      (filterEstado === "" || usuario.estado === filterEstado)
    );
  }, [usuarios, searchTerm, filterRol, filterEstado]);

  const selectedCount = useMemo(() => {
    return usuarios.filter(item => item.selected).length;
  }, [usuarios]);

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo Usuario
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
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={filterRol}
                  onChange={(e) => setFilterRol(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los roles</option>
                  {roles.map(rol => (
                    <option key={rol} value={rol}>{rol}</option>
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
                  {editingId ? "Editar Usuario" : "Nuevo Usuario"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  {renderSelectConAgregar('Rol', 'rol', roles, setRoles)}
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
                        setUsuarios(prev => prev.map(item => ({ ...item, selected: e.target.checked })));
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={usuario.selected}
                        onChange={() => toggleSelect(usuario.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nombre}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.rol}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                        usuario.estado === 'Inactivo' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.fechaCreacion}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.id)}
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

          {filteredUsuarios.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
              <p className="text-gray-500">Comienza agregando un nuevo usuario.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function UsuariosPage() {
  return (
    <ErrorBoundary>
      <UsuariosManager />
    </ErrorBoundary>
  );
} 