"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Trash2, Plus, Search, List, Eye, Clipboard } from "lucide-react";
import ErrorBoundary from "../components/ErrorBoundary";

interface ChecklistItem {
  id: number;
  descripcion: string;
  tipo: string;
  activo: boolean;
}

interface Checklist {
  id: number;
  nombre: string;
  tipo: "Inspección" | "Observación";
  descripcion: string;
  items: ChecklistItem[];
  estado: string;
  fechaCreacion: string;
}

const tiposChecklist = ["Inspección", "Observación"];
const estados = ["Activo", "Inactivo", "Borrador"];

export default function ChecklistPage() {
  return (
    <ErrorBoundary>
      <ChecklistPageContent />
    </ErrorBoundary>
  );
}

function ChecklistPageContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [checklists, setChecklists] = useState<Checklist[]>([
    {
      id: 1,
      nombre: "Checklist Inspección General",
      tipo: "Inspección",
      descripcion: "Checklist para inspecciones generales de seguridad",
      items: [
        { id: 1, descripcion: "Verificar uso de EPP", tipo: "Seguridad", activo: true },
        { id: 2, descripcion: "Revisar estado de máquinas", tipo: "Equipos", activo: true },
        { id: 3, descripcion: "Comprobar señalización", tipo: "Ambiente", activo: true }
      ],
      estado: "Activo",
      fechaCreacion: "2024-01-15"
    },
    {
      id: 2,
      nombre: "Checklist Observación de Trabajo",
      tipo: "Observación",
      descripcion: "Checklist para observaciones de comportamiento seguro",
      items: [
        { id: 4, descripcion: "Postura correcta", tipo: "Ergonomía", activo: true },
        { id: 5, descripcion: "Uso correcto de herramientas", tipo: "Procedimientos", activo: true },
        { id: 6, descripcion: "Comunicación entre trabajadores", tipo: "Comunicación", activo: true }
      ],
      estado: "Activo",
      fechaCreacion: "2024-02-20"
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [mostrarItems, setMostrarItems] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    descripcion: "",
    estado: "Activo"
  });

  const [nuevoItem, setNuevoItem] = useState({
    descripcion: "",
    tipo: ""
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      tipo: "",
      descripcion: "",
      estado: "Activo"
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    setMostrarFormulario(true);
    resetForm();
  };

  const handleEdit = (checklist: Checklist) => {
    setFormData({
      nombre: checklist.nombre,
      tipo: checklist.tipo,
      descripcion: checklist.descripcion,
      estado: checklist.estado
    });
    setEditingId(checklist.id);
    setMostrarFormulario(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este checklist?")) {
      setChecklists(prev => prev.filter(checklist => checklist.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setChecklists(prev => prev.map(checklist => 
        checklist.id === editingId 
          ? { 
              ...checklist, 
              nombre: formData.nombre,
              tipo: formData.tipo as "Inspección" | "Observación",
              descripcion: formData.descripcion,
              estado: formData.estado
            }
          : checklist
      ));
    } else {
      const newChecklist: Checklist = {
        id: Math.max(...checklists.map(c => c.id)) + 1,
        nombre: formData.nombre,
        tipo: formData.tipo as "Inspección" | "Observación",
        descripcion: formData.descripcion,
        estado: formData.estado,
        items: [],
        fechaCreacion: new Date().toISOString().split('T')[0]
      };
      setChecklists(prev => [...prev, newChecklist]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const handleAddItem = (checklistId: number) => {
    if (nuevoItem.descripcion.trim() && nuevoItem.tipo.trim()) {
      const newItem: ChecklistItem = {
        id: Math.max(...checklists.flatMap(c => c.items).map(i => i.id)) + 1,
        descripcion: nuevoItem.descripcion,
        tipo: nuevoItem.tipo,
        activo: true
      };

      setChecklists(prev => prev.map(checklist => 
        checklist.id === checklistId 
          ? { ...checklist, items: [...checklist.items, newItem] }
          : checklist
      ));

      setNuevoItem({ descripcion: "", tipo: "" });
    }
  };

  const handleDeleteItem = (checklistId: number, itemId: number) => {
    setChecklists(prev => prev.map(checklist => 
      checklist.id === checklistId 
        ? { ...checklist, items: checklist.items.filter(item => item.id !== itemId) }
        : checklist
    ));
  };

  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = checklist.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checklist.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !filterTipo || checklist.tipo === filterTipo;
    const matchesEstado = !filterEstado || checklist.estado === filterEstado;
    
    return matchesSearch && matchesTipo && matchesEstado;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Checklist</h1>
        <p className="text-gray-600">Administra los checklist de inspección y observación</p>
      </div>

      {/* Controles superiores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar checklist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {tiposChecklist.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>

              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Checklist
          </button>
        </div>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Checklist" : "Agregar Nuevo Checklist"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Checklist</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposChecklist.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe el propósito y alcance del checklist..."
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {editingId ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  resetForm();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Checklists */}
      <div className="space-y-4">
        {filteredChecklists.map((checklist) => (
          <div key={checklist.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {checklist.tipo === "Inspección" ? (
                    <Eye className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Clipboard className="w-6 h-6 text-green-600" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{checklist.nombre}</h3>
                    <p className="text-sm text-gray-600">{checklist.descripcion}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    checklist.tipo === "Inspección" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                  }`}>
                    {checklist.tipo}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    checklist.estado === "Activo" ? "bg-green-100 text-green-800" : 
                    checklist.estado === "Inactivo" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {checklist.estado}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  {checklist.items.length} items • Creado: {checklist.fechaCreacion}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMostrarItems(mostrarItems === checklist.id ? null : checklist.id)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    {mostrarItems === checklist.id ? "Ocultar Items" : "Ver Items"}
                  </button>
                  <button
                    onClick={() => handleEdit(checklist)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(checklist.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items del Checklist */}
              {mostrarItems === checklist.id && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Items del Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Descripción del item"
                        value={nuevoItem.descripcion}
                        onChange={(e) => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tipo (ej: Seguridad, Equipos)"
                          value={nuevoItem.tipo}
                          onChange={(e) => setNuevoItem({ ...nuevoItem, tipo: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleAddItem(checklist.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {checklist.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <List className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.descripcion}</div>
                            <div className="text-xs text-gray-500">Tipo: {item.tipo}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(checklist.id, item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 