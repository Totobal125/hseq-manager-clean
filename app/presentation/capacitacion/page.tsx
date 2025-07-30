"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Trash2, Plus, Search, GraduationCap, Calendar, Users, MapPin, CheckCircle, Clock } from "lucide-react";

interface Capacitacion {
  id: number;
  tipoCapacitacion: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  fechaCapacitacion: string;
  capacitadores: string[];
  tipoCapacitador: string;
  participantes: string[];
  centroTrabajo: string;
  area: string;
  estado: string;
  vigenciaIndefinida: boolean;
  vigenciaMeses: number;
  piePagina: string;
  fechaCreacion: string;
}

const tiposCapacitacion = [
  "Charla Asistente Social",
  "Curso",
  "Charlas de 5 min",
  "Alertas",
  "Inducción"
];

const centrosTrabajo = [
  "Planta A",
  "Planta B"
];

const areas = [
  "Bodega",
  "Zona Norte"
];

const capacitadoresInternos = [
  "Juan Valdéz",
  "María Fernandez"
];

const participantes = [
  "Juan Molina",
  "Maria Soledad",
  "Hernan Fernandez"
];

const estados = ["Programado", "Realizado"];

const piePaginaDefault = "Doy testimonio que se me ha capacitado y he comprendido todos los temas aquí señalados, siendo de mi responsabilidad cumplir con todos los aspectos tratados en la actividad aquí descrita.";

export default function CapacitacionPage() {
  const { isAuthenticated } = useAuth();
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([
    {
      id: 1,
      tipoCapacitacion: "Curso",
      titulo: "Seguridad en Alturas",
      descripcion: "Capacitación sobre procedimientos seguros para trabajos en altura",
      contenido: "1. Identificación de riesgos\n2. Uso correcto de EPP\n3. Procedimientos de rescate\n4. Normativas vigentes",
      fechaCapacitacion: "2024-03-15",
      capacitadores: ["Juan Valdéz"],
      tipoCapacitador: "Interno",
      participantes: ["Juan Molina", "Hernan Fernandez"],
      centroTrabajo: "Planta A",
      area: "Zona Norte",
      estado: "Programado",
      vigenciaIndefinida: false,
      vigenciaMeses: 12,
      piePagina: piePaginaDefault,
      fechaCreacion: "2024-02-20"
    },
    {
      id: 2,
      tipoCapacitacion: "Inducción",
      titulo: "Inducción General de Seguridad",
      descripcion: "Inducción para nuevos trabajadores sobre políticas de seguridad",
      contenido: "1. Políticas de la empresa\n2. Procedimientos de emergencia\n3. Uso de EPP\n4. Reporte de incidentes",
      fechaCapacitacion: "2024-03-10",
      capacitadores: ["María Fernandez"],
      tipoCapacitador: "Interno",
      participantes: ["Maria Soledad"],
      centroTrabajo: "Planta B",
      area: "Bodega",
      estado: "Realizado",
      vigenciaIndefinida: true,
      vigenciaMeses: 0,
      piePagina: piePaginaDefault,
      fechaCreacion: "2024-02-15"
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterCentro, setFilterCentro] = useState("");

  // Estados para campos dinámicos
  const [tipoCapacitacionCustom, setTipoCapacitacionCustom] = useState(false);
  const [centroTrabajoCustom, setCentroTrabajoCustom] = useState(false);
  const [areaCustom, setAreaCustom] = useState(false);
  const [participanteCustom, setParticipanteCustom] = useState(false);

  const [formData, setFormData] = useState({
    tipoCapacitacion: "",
    titulo: "",
    descripcion: "",
    contenido: "",
    fechaCapacitacion: "",
    capacitadores: [] as string[],
    tipoCapacitador: "Interno",
    participantes: [] as string[],
    centroTrabajo: "",
    area: "",
    estado: "Programado",
    vigenciaIndefinida: false,
    vigenciaMeses: 12,
    piePagina: piePaginaDefault
  });

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
      piePagina: piePaginaDefault
    });
    setEditingId(null);
    setTipoCapacitacionCustom(false);
    setCentroTrabajoCustom(false);
    setAreaCustom(false);
    setParticipanteCustom(false);
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
      piePagina: capacitacion.piePagina
    });
    setEditingId(capacitacion.id);
    setMostrarFormulario(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta capacitación?")) {
      setCapacitaciones(prev => prev.filter(capacitacion => capacitacion.id !== id));
    }
  };

  const handleChangeEstado = (id: number) => {
    setCapacitaciones(prev => prev.map(capacitacion => 
      capacitacion.id === id 
        ? { ...capacitacion, estado: capacitacion.estado === "Programado" ? "Realizado" : "Programado" }
        : capacitacion
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setCapacitaciones(prev => prev.map(capacitacion => 
        capacitacion.id === editingId 
          ? { ...capacitacion, ...formData }
          : capacitacion
      ));
    } else {
      const newCapacitacion: Capacitacion = {
        id: Math.max(...capacitaciones.map(c => c.id)) + 1,
        ...formData,
        fechaCreacion: new Date().toISOString().split('T')[0]
      };
      setCapacitaciones(prev => [...prev, newCapacitacion]);
    }
    
    setMostrarFormulario(false);
    resetForm();
  };

  const handleCapacitadorChange = (capacitador: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        capacitadores: [...prev.capacitadores, capacitador]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        capacitadores: prev.capacitadores.filter(c => c !== capacitador)
      }));
    }
  };

  const handleParticipanteChange = (participante: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        participantes: [...prev.participantes, participante]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        participantes: prev.participantes.filter(p => p !== participante)
      }));
    }
  };

  const filteredCapacitaciones = capacitaciones.filter(capacitacion => {
    const matchesSearch = capacitacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capacitacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capacitacion.capacitadores.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTipo = !filterTipo || capacitacion.tipoCapacitacion === filterTipo;
    const matchesEstado = !filterEstado || capacitacion.estado === filterEstado;
    const matchesCentro = !filterCentro || capacitacion.centroTrabajo === filterCentro;
    
    return matchesSearch && matchesTipo && matchesEstado && matchesCentro;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Capacitaciones</h1>
        <p className="text-gray-600">Administra las capacitaciones y entrenamientos del personal</p>
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
                placeholder="Buscar capacitaciones..."
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
                {tiposCapacitacion.map(tipo => (
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

              <select
                value={filterCentro}
                onChange={(e) => setFilterCentro(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los centros</option>
                {centrosTrabajo.map(centro => (
                  <option key={centro} value={centro}>{centro}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Capacitación
          </button>
        </div>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Capacitación" : "Agregar Nueva Capacitación"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Capacitación</label>
                {!tipoCapacitacionCustom ? (
                  <div className="flex gap-2">
                    <select
                      value={formData.tipoCapacitacion}
                      onChange={(e) => setFormData({ ...formData, tipoCapacitacion: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposCapacitacion.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setTipoCapacitacionCustom(true)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                    >
                      + Otro
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.tipoCapacitacion}
                      onChange={(e) => setFormData({ ...formData, tipoCapacitacion: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingrese tipo de capacitación"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setTipoCapacitacionCustom(false)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabajo</label>
                {!centroTrabajoCustom ? (
                  <div className="flex gap-2">
                    <select
                      value={formData.centroTrabajo}
                      onChange={(e) => setFormData({ ...formData, centroTrabajo: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar centro</option>
                      {centrosTrabajo.map(centro => (
                        <option key={centro} value={centro}>{centro}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setCentroTrabajoCustom(true)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                    >
                      + Otro
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.centroTrabajo}
                      onChange={(e) => setFormData({ ...formData, centroTrabajo: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingrese centro de trabajo"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setCentroTrabajoCustom(false)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                {!areaCustom ? (
                  <div className="flex gap-2">
                    <select
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar área</option>
                      {areas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setAreaCustom(true)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                    >
                      + Otro
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingrese área"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setAreaCustom(false)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Capacitación</label>
                <input
                  type="date"
                  value={formData.fechaCapacitacion}
                  onChange={(e) => setFormData({ ...formData, fechaCapacitacion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe el propósito de la capacitación..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
              <textarea
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detalla el contenido de la capacitación..."
                required
              />
            </div>

            {/* Capacitador(es) */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Capacitador(es)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Capacitador</label>
                  <select
                    value={formData.tipoCapacitador}
                    onChange={(e) => setFormData({ ...formData, tipoCapacitador: e.target.value, capacitadores: [] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Interno">Interno</option>
                    <option value="Externo">Externo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacitador(es)</label>
                  {formData.tipoCapacitador === "Interno" ? (
                    <div className="space-y-2">
                      {capacitadoresInternos.map(capacitador => (
                        <label key={capacitador} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.capacitadores.includes(capacitador)}
                            onChange={(e) => handleCapacitadorChange(capacitador, e.target.checked)}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          {capacitador}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={formData.capacitadores.join(", ")}
                      onChange={(e) => setFormData({ ...formData, capacitadores: e.target.value.split(", ").filter(c => c.trim()) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ingrese capacitadores separados por comas"
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Dirigido a */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dirigido a</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participantes</label>
                {!participanteCustom ? (
                  <div className="space-y-2">
                    {participantes.map(participante => (
                      <label key={participante} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.participantes.includes(participante)}
                          onChange={(e) => handleParticipanteChange(participante, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {participante}
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() => setParticipanteCustom(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Agregar otro
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {participantes.map(participante => (
                      <label key={participante} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.participantes.includes(participante)}
                          onChange={(e) => handleParticipanteChange(participante, e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {participante}
                      </label>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nuevo participante"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              handleParticipanteChange(input.value.trim(), true);
                              input.value = '';
                              setParticipanteCustom(false);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setParticipanteCustom(false)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Vigencia */}
            <div className="border-t pt-6">
              <div className="flex items-center mb-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
              )}
            </div>

            {/* Pie de página */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pie de página</label>
              <textarea
                value={formData.piePagina}
                onChange={(e) => setFormData({ ...formData, piePagina: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mensaje del pie de página..."
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

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacitación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacitador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCapacitaciones.map((capacitacion) => (
                <tr key={capacitacion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {capacitacion.tipoCapacitacion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {capacitacion.centroTrabajo}
                      </div>
                      <div className="text-sm text-gray-500">{capacitacion.area}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {new Date(capacitacion.fechaCapacitacion).toLocaleDateString('es-CL')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      {capacitacion.capacitadores.join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
  );
} 