"use client";
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiCamera, FiUser } from 'react-icons/fi';

interface Trabajador {
  rut: string;
  nombre: string;
  cargo: string;
  centroTrabajo: string;
  area: string;
}

interface EntregaEPP {
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
  fotoFirmaTrabajador?: string;
  fotoFirmaResponsable?: string;
}

export default function EntregaEPPPage() {
  const [entregas, setEntregas] = useState<EntregaEPP[]>([
    {
      id: 1,
      rutTrabajador: "18652129-3",
      nombreTrabajador: "Juan Molina",
      cargo: "Operador",
      responsable: "Juan Molina",
      eppEntregado: "Casco de Seguridad",
      talla: "M",
      fechaHora: "2024-01-15 08:30",
      centroTrabajo: "Planta Principal",
      area: "Producción"
    },
    {
      id: 2,
      rutTrabajador: "19616321-2",
      nombreTrabajador: "Maria Soledad",
      cargo: "Supervisor",
      responsable: "Juan Molina",
      eppEntregado: "Guantes de Trabajo",
      talla: "S",
      fechaHora: "2024-01-15 09:15",
      centroTrabajo: "Almacén",
      area: "Logística"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingEntrega, setEditingEntrega] = useState<EntregaEPP | null>(null);
  const [formData, setFormData] = useState({
    rutTrabajador: '',
    nombreTrabajador: '',
    cargo: '',
    responsable: 'Juan Molina',
    eppEntregado: '',
    talla: '',
    fechaHora: new Date().toISOString().slice(0, 16),
    centroTrabajo: '',
    area: ''
  });

  const trabajadores: Trabajador[] = [
    { rut: "18652129-3", nombre: "Juan Molina", cargo: "Operador", centroTrabajo: "Planta Principal", area: "Producción" },
    { rut: "19616321-2", nombre: "Maria Soledad", cargo: "Supervisor", centroTrabajo: "Almacén", area: "Logística" },
    { rut: "10049166-4", nombre: "Hernan Fernandez", cargo: "Técnico", centroTrabajo: "Taller", area: "Mantenimiento" }
  ];

  const epps = ["Casco de Seguridad", "Guantes de Trabajo", "Botas de Seguridad", "Gafas de Protección", "Chaleco Reflectante"];
  const tallas = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    if (formData.rutTrabajador) {
      const trabajador = trabajadores.find(t => t.rut === formData.rutTrabajador);
      if (trabajador) {
        setFormData(prev => ({
          ...prev,
          nombreTrabajador: trabajador.nombre,
          cargo: trabajador.cargo,
          centroTrabajo: trabajador.centroTrabajo,
          area: trabajador.area
        }));
      }
    }
  }, [formData.rutTrabajador]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEntrega) {
      setEntregas(entregas.map(entrega => 
        entrega.id === editingEntrega.id 
          ? { ...entrega, ...formData }
          : entrega
      ));
      setEditingEntrega(null);
    } else {
      const newEntrega: EntregaEPP = {
        id: Date.now(),
        ...formData
      };
      setEntregas([...entregas, newEntrega]);
    }
    
    setFormData({
      rutTrabajador: '',
      nombreTrabajador: '',
      cargo: '',
      responsable: 'Juan Molina',
      eppEntregado: '',
      talla: '',
      fechaHora: new Date().toISOString().slice(0, 16),
      centroTrabajo: '',
      area: ''
    });
    setShowForm(false);
  };

  const handleEdit = (entrega: EntregaEPP) => {
    setEditingEntrega(entrega);
    setFormData({
      rutTrabajador: entrega.rutTrabajador,
      nombreTrabajador: entrega.nombreTrabajador,
      cargo: entrega.cargo,
      responsable: entrega.responsable,
      eppEntregado: entrega.eppEntregado,
      talla: entrega.talla,
      fechaHora: entrega.fechaHora,
      centroTrabajo: entrega.centroTrabajo,
      area: entrega.area
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setEntregas(entregas.filter(entrega => entrega.id !== id));
  };

  const handleFotoFirma = (tipo: 'trabajador' | 'responsable') => {
    // Aquí se implementaría la lógica para tomar foto
    alert(`Tomando foto de firma del ${tipo}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Entrega de EPPs</h1>
          <p className="text-gray-600">Registro de entrega de Elementos de Protección Personal</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar entrega..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              <FiFilter className="w-4 h-4" />
              <span>Filtrar</span>
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            <span>Nueva Entrega</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">RUT Trabajador</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Nombre Trabajador</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Cargo</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Responsable</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">EPP Entregado</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Talla</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Fecha/Hora</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Centro de Trabajo</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Área</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entregas.map((entrega) => (
                  <tr key={entrega.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{entrega.rutTrabajador}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{entrega.nombreTrabajador}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{entrega.cargo}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{entrega.responsable}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {entrega.eppEntregado}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{entrega.talla}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{entrega.fechaHora}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{entrega.centroTrabajo}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{entrega.area}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(entrega)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entrega.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingEntrega ? 'Editar Entrega' : 'Nueva Entrega de EPP'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* RUT Trabajador */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RUT Trabajador
                    </label>
                    <select
                      value={formData.rutTrabajador}
                      onChange={(e) => setFormData({...formData, rutTrabajador: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar RUT</option>
                      {trabajadores.map((trabajador) => (
                        <option key={trabajador.rut} value={trabajador.rut}>{trabajador.rut}</option>
                      ))}
                    </select>
                  </div>

                  {/* Nombre Trabajador */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Trabajador
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.nombreTrabajador}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => handleFotoFirma('trabajador')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiCamera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Responsable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsable de Entrega
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.responsable}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => handleFotoFirma('responsable')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiCamera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* EPP Entregado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EPP Entregado
                    </label>
                    <select
                      value={formData.eppEntregado}
                      onChange={(e) => setFormData({...formData, eppEntregado: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar EPP</option>
                      {epps.map((epp) => (
                        <option key={epp} value={epp}>{epp}</option>
                      ))}
                    </select>
                  </div>

                  {/* Talla */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Talla
                    </label>
                    <select
                      value={formData.talla}
                      onChange={(e) => setFormData({...formData, talla: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar talla</option>
                      {tallas.map((talla) => (
                        <option key={talla} value={talla}>{talla}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fecha/Hora */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha/Hora
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.fechaHora}
                      onChange={(e) => setFormData({...formData, fechaHora: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Centro de Trabajo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Centro de Trabajo
                    </label>
                    <input
                      type="text"
                      value={formData.centroTrabajo}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  {/* Área */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    {editingEntrega ? 'Actualizar' : 'Registrar Entrega'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingEntrega(null);
                      setFormData({
                        rutTrabajador: '',
                        nombreTrabajador: '',
                        cargo: '',
                        responsable: 'Juan Molina',
                        eppEntregado: '',
                        talla: '',
                        fechaHora: new Date().toISOString().slice(0, 16),
                        centroTrabajo: '',
                        area: ''
                      });
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 