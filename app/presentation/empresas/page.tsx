"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface TipoEmpresa {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface Empresa {
  id: number;
  nombre: string;
  razonSocial: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  tipoEmpresaId: number;
  tipoEmpresa?: TipoEmpresa;
  activo: boolean;
  fechaCreacion: string;
}

export default function EmpresasPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // Datos simulados de tipos de empresas
  const [tiposEmpresas] = useState<TipoEmpresa[]>([
    { id: 1, nombre: "Empresa Industrial", descripcion: "Empresas del sector industrial", activo: true },
    { id: 2, nombre: "Empresa Comercial", descripcion: "Empresas del sector comercial", activo: true },
    { id: 3, nombre: "Empresa de Servicios", descripcion: "Empresas del sector servicios", activo: true },
  ]);

  const [empresas, setEmpresas] = useState<Empresa[]>([
    {
      id: 1,
      nombre: "TechCorp S.A.",
      razonSocial: "TechCorp Sociedad Anónima",
      ruc: "20123456789",
      direccion: "Av. Principal 123, Lima",
      telefono: "+51 1 234-5678",
      email: "contacto@techcorp.com",
      tipoEmpresaId: 1,
      activo: true,
      fechaCreacion: "2024-01-15"
    },
    {
      id: 2,
      nombre: "Comercial ABC",
      razonSocial: "Comercial ABC E.I.R.L.",
      ruc: "20123456790",
      direccion: "Jr. Comercial 456, Arequipa",
      telefono: "+51 54 987-6543",
      email: "info@comercialabc.com",
      tipoEmpresaId: 2,
      activo: true,
      fechaCreacion: "2024-02-20"
    }
  ]);
  
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    razonSocial: "",
    ruc: "",
    direccion: "",
    telefono: "",
    email: "",
    tipoEmpresaId: 1,
    activo: true
  });

  // Verificar si es superusuario (simulado)
  const isSuperUser = true; // Esto se debería verificar con el backend

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    router.push("/presentation/login");
    return null;
  }

  if (!isSuperUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const getTipoEmpresa = (tipoId: number) => {
    return tiposEmpresas.find(tipo => tipo.id === tipoId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEmpresa) {
      // Editar empresa existente
      setEmpresas(prev => 
        prev.map(empresa => 
          empresa.id === editingEmpresa.id 
            ? { ...empresa, ...formData }
            : empresa
        )
      );
      setEditingEmpresa(null);
    } else {
      // Crear nueva empresa
      const newEmpresa: Empresa = {
        id: Math.max(...empresas.map(e => e.id)) + 1,
        ...formData,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };
      setEmpresas(prev => [...prev, newEmpresa]);
    }
    
    setFormData({
      nombre: "",
      razonSocial: "",
      ruc: "",
      direccion: "",
      telefono: "",
      email: "",
      tipoEmpresaId: 1,
      activo: true
    });
    setShowForm(false);
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      nombre: empresa.nombre,
      razonSocial: empresa.razonSocial,
      ruc: empresa.ruc,
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      email: empresa.email,
      tipoEmpresaId: empresa.tipoEmpresaId,
      activo: empresa.activo
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta empresa?")) {
      setEmpresas(prev => prev.filter(empresa => empresa.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingEmpresa(null);
    setFormData({
      nombre: "",
      razonSocial: "",
      ruc: "",
      direccion: "",
      telefono: "",
      email: "",
      tipoEmpresaId: 1,
      activo: true
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Empresas</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Empresa
            </button>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">
                {editingEmpresa ? "Editar Empresa" : "Nueva Empresa"}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={formData.razonSocial}
                    onChange={(e) => setFormData({...formData, razonSocial: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUC
                  </label>
                  <input
                    type="text"
                    value={formData.ruc}
                    onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={11}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Empresa
                  </label>
                  <select
                    value={formData.tipoEmpresaId}
                    onChange={(e) => setFormData({...formData, tipoEmpresaId: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {tiposEmpresas.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Activo
                  </label>
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    {editingEmpresa ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RUC
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {empresa.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{empresa.nombre}</div>
                        <div className="text-sm text-gray-500">{empresa.razonSocial}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {empresa.ruc}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTipoEmpresa(empresa.tipoEmpresaId)?.nombre}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{empresa.telefono}</div>
                      <div className="text-sm text-gray-500">{empresa.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        empresa.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {empresa.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(empresa)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(empresa.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
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
} 