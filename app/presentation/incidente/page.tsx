"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import ErrorBoundary from "../components/ErrorBoundary";

interface Trabajador {
  rut: string;
  nombre: string;
  cargo: string;
  edad: number;
  antiguedad: number;
}

interface Causal {
  id: number;
  tipo: 'accion' | 'condicion';
  accionSubestandar?: string;
  condicionSubestandar?: string;
  causasBasicas: string[];
  faltaControl: string[];
}

interface MedidaControl {
  id: number;
  causalId: number;
  medida: string;
  plazo: string;
  responsable: string;
  imagen: string;
}

interface Incidente {
  id: number;
  rut: string;
  nombreAccidentado: string;
  cargo: string;
  area: string;
  centroTrabajo: string;
  tipoEvento: string;
  fechaIncidente: string;
  estado: string;
  // Datos completos del formulario
  tipoIncidente: string;
  lugarIncidente: string;
  fechaHoraIncidente: string;
  fuenteEvento: string;
  agenteEvento: string;
  riesgoEspecifico: string;
  edad: number;
  antiguedadCargo: number;
  parteCuerpoLesionada: string;
  tipoLesion: string;
  equipo: string;
  proceso: string;
  danoMaterial: number;
  danoAmbiental: string;
  descripcion: string;
  imagenEvidencia: string;
  causales: Causal[];
  medidasControl: MedidaControl[];
  probabilidad: string;
  consecuencias: string;
  riesgoEvaluado: string;
  investigadores: Array<{nombre: string, firma: string}>;
  informador: string;
  firmaInformador: string;
}

export default function IncidentePage() {
  return (
    <ErrorBoundary>
      <IncidentePageContent />
    </ErrorBoundary>
  );
}

function IncidentePageContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Datos simulados de trabajadores
  const [trabajadores] = useState<Trabajador[]>([
    { rut: "18652129-3", nombre: "Juan Molina", cargo: "Maestro soldador", edad: 28, antiguedad: 4 },
    { rut: "19616321-2", nombre: "Maria Soledad", cargo: "Encargado área Producción", edad: 35, antiguedad: 2 },
    { rut: "10049166-4", nombre: "Hernan Fernandez", cargo: "Jefe área Producción", edad: 52, antiguedad: 6 },
  ]);

  const [incidentes, setIncidentes] = useState<Incidente[]>([
    {
      id: 1,
      rut: "18652129-3",
      nombreAccidentado: "Juan Molina",
      cargo: "Maestro soldador",
      area: "Santiago",
      centroTrabajo: "Planta A",
      tipoEvento: "Accidente sin Tiempo Perdido (STP)",
      fechaIncidente: "2024-01-15",
      estado: "En Investigación",
      tipoIncidente: "Accidente sin Tiempo Perdido (STP)",
      lugarIncidente: "Área de soldadura",
      fechaHoraIncidente: "2024-01-15T08:30",
      fuenteEvento: "Soldadura eléctrica",
      agenteEvento: "Maquinaria",
      riesgoEspecifico: "Exposición a chispas",
      edad: 28,
      antiguedadCargo: 4,
      parteCuerpoLesionada: "Cabeza",
      tipoLesion: "Contusión",
      equipo: "Soldadora eléctrica",
      proceso: "Soldadura de tuberías",
      danoMaterial: 50000,
      danoAmbiental: "Ninguno",
      descripcion: "El trabajador sufrió una contusión en la cabeza al golpearse con una viga durante el proceso de soldadura.",
      imagenEvidencia: "",
      causales: [],
      medidasControl: [],
      probabilidad: "Media",
      consecuencias: "Levemente dañino",
      riesgoEvaluado: "Moderado",
      investigadores: [{nombre: "Carlos Silva", firma: ""}],
      informador: "Juan Molina",
      firmaInformador: ""
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingIncidente, setEditingIncidente] = useState<Incidente | null>(null);
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);
  const [showAcciones, setShowAcciones] = useState(false);
  const [showCondiciones, setShowCondiciones] = useState(false);
  const [selectedCausal, setSelectedCausal] = useState<string>("");
  const [showCausales, setShowCausales] = useState(false);
  const [showMedidas, setShowMedidas] = useState(false);

  const [formData, setFormData] = useState({
    tipoIncidente: "",
    lugarIncidente: "",
    fechaHoraIncidente: "",
    centroTrabajo: "",
    area: "",
    fuenteEvento: "",
    agenteEvento: "",
    riesgoEspecifico: "",
    rut: "",
    nombreAccidentado: "",
    cargo: "",
    edad: 0,
    antiguedadCargo: 0,
    parteCuerpoLesionada: "",
    tipoLesion: "",
    equipo: "",
    proceso: "",
    danoMaterial: 0,
    danoAmbiental: "",
    descripcion: "",
    imagenEvidencia: "",
    causales: [] as Causal[],
    medidasControl: [] as MedidaControl[],
    probabilidad: "",
    consecuencias: "",
    investigadores: [] as Array<{nombre: string, firma: string}>,
    informador: "Juan Molina",
    firmaInformador: ""
  });

  const tiposIncidente = [
    "Accidente con Daño Ambiental (DAM)",
    "Accidente con Daño Material (CDM)",
    "Accidente con Daño Productivo (CDP)",
    "Accidente con Tiempo Perdido (CTP)",
    "Accidente Fatal (FAT)",
    "Accidente sin Tiempo Perdido (STP)",
    "Accidente Trayecto (TRA)",
    "Cuasi Accidente (CA)"
  ];

  const centrosTrabajo = ["Planta A", "Planta B"];
  const areas = ["Área de Producción A", "Almacén de Materiales", "Oficinas Administrativas", "Taller de Mantenimiento"];
  const agentesEvento = [
    "Ambiente del Trabajo",
    "Maquinaria",
    "Materiales, sustancias y radiaciones",
    "Otros agentes no clasificados"
  ];
  const partesCuerpo = ["Cabeza", "Costado derecho", "Costado izquierdo"];
  const tiposLesion = ["Amputación", "Asfixia", "Contusión", "Fractura"];
  const probabilidades = ["Alta", "Media", "Baja"];
  const consecuencias = ["Extremadamente dañino", "Dañino", "Levemente dañino"];
  const investigadoresDisponibles = ["Carlos Silva", "Ana Martínez", "Roberto Díaz", "Patricia López"];
  
  // Opciones para análisis causal
  const accionesSubestandares = [
    "Adoptar una posición inadecuada para hacer la tarea",
    "Almacenar de manera incorrecta"
  ];
  
  const condicionesSubestandares = [
    "Condiciones ambientales peligrosas: gases, polvos, humos, emanaciones metálicas, vapores",
    "Equipos de protección inadecuados o insuficientes"
  ];
  
  const causasBasicas = {
    "Capacidad Física/Fisiológica Inadecuada": [
      "Altura, peso, talla, fuerza, alcance, etc., inadecuados",
      "Capacidad de movimiento corporal limitada",
      "Capacidad limitada para mantenerse en determinadas posiciones corporales"
    ],
    "Capacidad Mental/Sicológica Inadecuada": [
      "Temores y fobias",
      "Problemas emocionales"
    ]
  };
  
  const faltaControl = [
    "Análisis de los accidentes / incidentes",
    "Análisis y procedimientos de trabajo"
  ];
  
  const responsables = ["Juan Molina", "Maria Soledad", "Hernan Fernandez", "Carlos Silva"];

  const evaluarRiesgo = (probabilidad: string, consecuencias: string) => {
    // Mapear valores a números para facilitar el cálculo
    const probMap = { "Baja": 1, "Media": 2, "Alta": 3 };
    const consMap = { "Levemente dañino": 1, "Dañino": 2, "Extremadamente dañino": 3 };
    
    const probValue = probMap[probabilidad as keyof typeof probMap] || 0;
    const consValue = consMap[consecuencias as keyof typeof consMap] || 0;
    
    // Calcular puntuación total (máximo 6)
    const puntuacion = probValue + consValue;
    
    if (puntuacion <= 2) return "Aceptable";
    if (puntuacion <= 4) return "Moderado";
    if (puntuacion <= 5) return "Importante";
    if (puntuacion >= 6) return "Intolerable";
    
    return "Moderado";
  };

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case "Aceptable": return "border-green-500 bg-green-50 text-green-800";
      case "Moderado": return "border-yellow-500 bg-yellow-50 text-yellow-800";
      case "Importante": return "border-orange-500 bg-orange-50 text-orange-800";
      case "Intolerable": return "border-red-500 bg-red-50 text-red-800";
      default: return "border-gray-500 bg-gray-50 text-gray-800";
    }
  };

  const renderSemaforoHorizontal = (riesgo: string) => {
    return (
      <div className="flex items-center space-x-1">
        <div className={`w-3 h-3 rounded-full border border-gray-400 ${
          riesgo === "Intolerable" ? "bg-red-500" : "bg-gray-300"
        }`}></div>
        <div className={`w-3 h-3 rounded-full border border-gray-400 ${
          riesgo === "Moderado" || riesgo === "Importante" ? "bg-yellow-500" : "bg-gray-300"
        }`}></div>
        <div className={`w-3 h-3 rounded-full border border-gray-400 ${
          riesgo === "Aceptable" ? "bg-green-500" : "bg-gray-300"
        }`}></div>
      </div>
    );
  };

  const handleTrabajadorChange = (rut: string) => {
    const trabajador = trabajadores.find(t => t.rut === rut);
    setSelectedTrabajador(trabajador || null);
    if (trabajador) {
      setFormData(prev => ({
        ...prev,
        rut: trabajador.rut,
        nombreAccidentado: trabajador.nombre,
        cargo: trabajador.cargo,
        edad: trabajador.edad,
        antiguedadCargo: trabajador.antiguedad
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const riesgoEvaluado = evaluarRiesgo(formData.probabilidad, formData.consecuencias);
    
    if (editingIncidente) {
      setIncidentes(prev => 
        prev.map(incidente => 
          incidente.id === editingIncidente.id 
            ? { ...incidente, ...formData, riesgoEvaluado }
            : incidente
        )
      );
      setEditingIncidente(null);
    } else {
      const newIncidente: Incidente = {
        id: Math.max(...incidentes.map(i => i.id)) + 1,
        rut: formData.rut,
        nombreAccidentado: formData.nombreAccidentado,
        cargo: formData.cargo,
        area: formData.area,
        centroTrabajo: formData.centroTrabajo,
        tipoEvento: formData.tipoIncidente,
        fechaIncidente: formData.fechaHoraIncidente.split('T')[0],
        estado: "En Investigación",
        tipoIncidente: formData.tipoIncidente,
        lugarIncidente: formData.lugarIncidente,
        fechaHoraIncidente: formData.fechaHoraIncidente,
        fuenteEvento: formData.fuenteEvento,
        agenteEvento: formData.agenteEvento,
        riesgoEspecifico: formData.riesgoEspecifico,
        edad: formData.edad,
        antiguedadCargo: formData.antiguedadCargo,
        parteCuerpoLesionada: formData.parteCuerpoLesionada,
        tipoLesion: formData.tipoLesion,
        equipo: formData.equipo,
        proceso: formData.proceso,
        danoMaterial: formData.danoMaterial,
        danoAmbiental: formData.danoAmbiental,
        descripcion: formData.descripcion,
        imagenEvidencia: formData.imagenEvidencia,
        causales: formData.causales,
        medidasControl: formData.medidasControl,
        probabilidad: formData.probabilidad,
        consecuencias: formData.consecuencias,
        riesgoEvaluado,
        investigadores: formData.investigadores,
        informador: formData.informador,
        firmaInformador: formData.firmaInformador
      };
      setIncidentes(prev => [...prev, newIncidente]);
    }
    
    setFormData({
      tipoIncidente: "",
      lugarIncidente: "",
      fechaHoraIncidente: "",
      centroTrabajo: "",
      area: "",
      fuenteEvento: "",
      agenteEvento: "",
      riesgoEspecifico: "",
      rut: "",
      nombreAccidentado: "",
      cargo: "",
      edad: 0,
      antiguedadCargo: 0,
      parteCuerpoLesionada: "",
      tipoLesion: "",
      equipo: "",
      proceso: "",
      danoMaterial: 0,
      danoAmbiental: "",
      descripcion: "",
      imagenEvidencia: "",
      causales: [],
      medidasControl: [],
      probabilidad: "",
      consecuencias: "",
      investigadores: [],
      informador: "Juan Molina",
      firmaInformador: ""
    });
    setShowForm(false);
  };

  const handleEdit = (incidente: Incidente) => {
    setEditingIncidente(incidente);
    setFormData({
      tipoIncidente: incidente.tipoIncidente,
      lugarIncidente: incidente.lugarIncidente,
      fechaHoraIncidente: incidente.fechaHoraIncidente,
      centroTrabajo: incidente.centroTrabajo,
      area: incidente.area,
      fuenteEvento: incidente.fuenteEvento,
      agenteEvento: incidente.agenteEvento,
      riesgoEspecifico: incidente.riesgoEspecifico,
      rut: incidente.rut,
      nombreAccidentado: incidente.nombreAccidentado,
      cargo: incidente.cargo,
      edad: incidente.edad,
      antiguedadCargo: incidente.antiguedadCargo,
      parteCuerpoLesionada: incidente.parteCuerpoLesionada,
      tipoLesion: incidente.tipoLesion,
      equipo: incidente.equipo,
      proceso: incidente.proceso,
              danoMaterial: incidente.danoMaterial,
        danoAmbiental: incidente.danoAmbiental,
        descripcion: incidente.descripcion,
        imagenEvidencia: incidente.imagenEvidencia,
        causales: incidente.causales,
        medidasControl: incidente.medidasControl,
        probabilidad: incidente.probabilidad,
        consecuencias: incidente.consecuencias,
        investigadores: incidente.investigadores,
        informador: incidente.informador,
        firmaInformador: incidente.firmaInformador
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este incidente?")) {
      setIncidentes(prev => prev.filter(incidente => incidente.id !== id));
    }
  };

  // Funciones para análisis causal
  const agregarCausal = (tipo: 'accion' | 'condicion') => {
    const nuevaCausal: Causal = {
      id: Date.now(),
      tipo,
      causasBasicas: [],
      faltaControl: []
    };
    setFormData(prev => ({
      ...prev,
      causales: [...prev.causales, nuevaCausal]
    }));
  };

  const eliminarCausal = (causalId: number) => {
    setFormData(prev => ({
      ...prev,
      causales: prev.causales.filter(c => c.id !== causalId),
      medidasControl: prev.medidasControl.filter(m => m.causalId !== causalId)
    }));
  };

  const actualizarCausal = (causalId: number, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      causales: prev.causales.map(c => 
        c.id === causalId ? { ...c, [campo]: valor } : c
      )
    }));
  };

  const agregarMedidaControl = (causalId: number) => {
    const nuevaMedida: MedidaControl = {
      id: Date.now(),
      causalId,
      medida: "",
      plazo: "",
      responsable: "",
      imagen: ""
    };
    setFormData(prev => ({
      ...prev,
      medidasControl: [...prev.medidasControl, nuevaMedida]
    }));
  };

  const eliminarMedidaControl = (medidaId: number) => {
    setFormData(prev => ({
      ...prev,
      medidasControl: prev.medidasControl.filter(m => m.id !== medidaId)
    }));
  };

  const actualizarMedidaControl = (medidaId: number, campo: string, valor: string) => {
    setFormData(prev => ({
      ...prev,
      medidasControl: prev.medidasControl.map(m => 
        m.id === medidaId ? { ...m, [campo]: valor } : m
      )
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/presentation/login");
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Incidentes</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Incidente
            </button>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-2xl font-semibold mb-6">
                {editingIncidente ? "Editar Incidente" : "Nuevo Incidente"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Antecedentes del Incidente */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Antecedentes del Incidente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidente</label>
                      <select
                        value={formData.tipoIncidente}
                        onChange={(e) => setFormData({...formData, tipoIncidente: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        {tiposIncidente.map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lugar del Incidente</label>
                      <input
                        type="text"
                        value={formData.lugarIncidente}
                        onChange={(e) => setFormData({...formData, lugarIncidente: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora de Incidente</label>
                      <input
                        type="datetime-local"
                        value={formData.fechaHoraIncidente}
                        onChange={(e) => setFormData({...formData, fechaHoraIncidente: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Trabajo</label>
                      <select
                        value={formData.centroTrabajo}
                        onChange={(e) => setFormData({...formData, centroTrabajo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar centro</option>
                        {centrosTrabajo.map(centro => (
                          <option key={centro} value={centro}>{centro}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fuente de evento</label>
                      <input
                        type="text"
                        value={formData.fuenteEvento}
                        onChange={(e) => setFormData({...formData, fuenteEvento: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Agente del evento</label>
                      <select
                        value={formData.agenteEvento}
                        onChange={(e) => setFormData({...formData, agenteEvento: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar agente</option>
                        {agentesEvento.map(agente => (
                          <option key={agente} value={agente}>{agente}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Riesgo Específico</label>
                      <input
                        type="text"
                        value={formData.riesgoEspecifico}
                        onChange={(e) => setFormData({...formData, riesgoEspecifico: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Identificación del Incidente */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Identificación del Incidente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                      <select
                        value={formData.rut}
                        onChange={(e) => handleTrabajadorChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar trabajador</option>
                        {trabajadores.map(trabajador => (
                          <option key={trabajador.rut} value={trabajador.rut}>{trabajador.rut}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Accidentado</label>
                      <input
                        type="text"
                        value={formData.nombreAccidentado}
                        onChange={(e) => setFormData({...formData, nombreAccidentado: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                      <input
                        type="text"
                        value={formData.cargo}
                        onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                      <input
                        type="number"
                        value={formData.edad}
                        onChange={(e) => setFormData({...formData, edad: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Antigüedad en el Cargo</label>
                      <input
                        type="number"
                        value={formData.antiguedadCargo}
                        onChange={(e) => setFormData({...formData, antiguedadCargo: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parte del cuerpo lesionada</label>
                      <select
                        value={formData.parteCuerpoLesionada}
                        onChange={(e) => setFormData({...formData, parteCuerpoLesionada: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar parte</option>
                        {partesCuerpo.map(parte => (
                          <option key={parte} value={parte}>{parte}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Lesión</label>
        <select
                        value={formData.tipoLesion}
                        onChange={(e) => setFormData({...formData, tipoLesion: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        {tiposLesion.map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
                    </div>
                  </div>
                </div>

                {/* Antecedentes del daño */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Antecedentes del daño</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Equipo</label>
                      <input
                        type="text"
                        value={formData.equipo}
                        onChange={(e) => setFormData({...formData, equipo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Proceso</label>
                      <input
                        type="text"
                        value={formData.proceso}
                        onChange={(e) => setFormData({...formData, proceso: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Daño material (CLP)</label>
                      <input
                        type="number"
                        value={formData.danoMaterial}
                        onChange={(e) => setFormData({...formData, danoMaterial: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Daño ambiental</label>
                      <input
                        type="text"
                        value={formData.danoAmbiental}
                        onChange={(e) => setFormData({...formData, danoAmbiental: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción del evento */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Descripción del evento</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="mt-4">
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

                {/* Análisis Causal de evento */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Análisis Causal de evento</h3>
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => agregarCausal('accion')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Añadir Acción
                    </button>
                    <button
                      type="button"
                      onClick={() => agregarCausal('condicion')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      Añadir Condición
                    </button>
                  </div>

                  {/* Causales del Evento */}
                  {formData.causales.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-gray-800">Causales del Evento:</h4>
                      {formData.causales.map((causal, index) => (
                        <div key={causal.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h5 className="font-semibold text-gray-800">
                              {causal.tipo === 'accion' ? 'Acción' : 'Condición'} ({index + 1})
                            </h5>
                            <button
                              type="button"
                              onClick={() => eliminarCausal(causal.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {causal.tipo === 'accion' ? (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Acción Subestandar</label>
                                <select
                                  value={causal.accionSubestandar || ''}
                                  onChange={(e) => actualizarCausal(causal.id, 'accionSubestandar', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Seleccionar acción</option>
                                  {accionesSubestandares.map(accion => (
                                    <option key={accion} value={accion}>{accion}</option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Condición Subestandar</label>
                                <select
                                  value={causal.condicionSubestandar || ''}
                                  onChange={(e) => actualizarCausal(causal.id, 'condicionSubestandar', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Seleccionar condición</option>
                                  {condicionesSubestandares.map(condicion => (
                                    <option key={condicion} value={condicion}>{condicion}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Causas Básicas */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Causas Básicas (seleccionar varias)</label>
                            <select
                              multiple
                              value={causal.causasBasicas}
                              onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                actualizarCausal(causal.id, 'causasBasicas', selectedOptions);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                            >
                              {Object.entries(causasBasicas).map(([categoria, items]) => (
                                <optgroup key={categoria} label={categoria}>
                                  {items.map(item => (
                                    <option key={item} value={item}>{item}</option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples opciones</p>
                          </div>

                          {/* Falta de Control */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Falta de Control (seleccionar varias)</label>
                            <select
                              multiple
                              value={causal.faltaControl}
                              onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                actualizarCausal(causal.id, 'faltaControl', selectedOptions);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                            >
                              {faltaControl.map(item => (
                                <option key={item} value={item}>{item}</option>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples opciones</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Evaluación del Riesgo */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Evaluación del Riesgo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad</label>
                      <select
                        value={formData.probabilidad}
                        onChange={(e) => setFormData({...formData, probabilidad: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar probabilidad</option>
                        {probabilidades.map(prob => (
                          <option key={prob} value={prob}>{prob}</option>
                        ))}
                      </select>
              </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consecuencias</label>
                      <select
                        value={formData.consecuencias}
                        onChange={(e) => setFormData({...formData, consecuencias: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccionar consecuencias</option>
                        {consecuencias.map(cons => (
                          <option key={cons} value={cons}>{cons}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {formData.probabilidad && formData.consecuencias && (
                    <div className="mt-4">
                      <div className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
                        evaluarRiesgo(formData.probabilidad, formData.consecuencias) === "Aceptable" ? "bg-green-100 text-green-800" :
                        evaluarRiesgo(formData.probabilidad, formData.consecuencias) === "Moderado" ? "bg-yellow-100 text-yellow-800" :
                        evaluarRiesgo(formData.probabilidad, formData.consecuencias) === "Importante" ? "bg-orange-100 text-orange-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        Riesgo: {evaluarRiesgo(formData.probabilidad, formData.consecuencias)}
                      </div>
          </div>
        )}
                </div>

                {/* Plan de Acción (Medidas de Control) */}
                {formData.causales.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-blue-600">Plan de Acción (Medidas de Control)</h3>
                    <p className="text-sm text-gray-600 mb-4">Para agregar una medida de control, primero debe seleccionar una causal del evento.</p>
                    
                    <div className="space-y-6">
                      {formData.causales.map((causal, index) => (
                        <div key={causal.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Causales del Evento: {causal.tipo === 'accion' ? 'Acción' : 'Condición'} ({index + 1})
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {causal.tipo === 'accion' ? 'Acción' : 'Condición'} Subestandar:
                                </label>
                                <p className="text-sm text-gray-800 bg-white p-2 rounded border">
                                  {causal.tipo === 'accion' ? causal.accionSubestandar : causal.condicionSubestandar}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Causas Básicas:</label>
                                <div className="text-sm text-gray-800 bg-white p-2 rounded border min-h-[60px]">
                                  {causal.causasBasicas.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1">
                                      {causal.causasBasicas.map((causa, idx) => (
                                        <li key={idx}>{causa}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-gray-500">No se han seleccionado causas básicas</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Falta de Control:</label>
                                <div className="text-sm text-gray-800 bg-white p-2 rounded border min-h-[60px]">
                                  {causal.faltaControl.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1">
                                      {causal.faltaControl.map((falta, idx) => (
                                        <li key={idx}>{falta}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="text-gray-500">No se han seleccionado faltas de control</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                              <button
                                type="button"
                                onClick={() => agregarMedidaControl(causal.id)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                              >
                                Agregar Medida de Control
                              </button>
                              <button
                                type="button"
                                onClick={() => eliminarCausal(causal.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Eliminar Causal
                              </button>
                            </div>

                            {/* Medidas de Control para esta causal */}
                            {formData.medidasControl.filter(m => m.causalId === causal.id).map((medida) => (
                              <div key={medida.id} className="mt-4 p-3 border border-gray-200 rounded bg-white">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-medium text-gray-800">Medida de Control</h6>
                                  <button
                                    type="button"
                                    onClick={() => eliminarMedidaControl(medida.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Medida de Control</label>
                                    <input
                                      type="text"
                                      value={medida.medida}
                                      onChange={(e) => actualizarMedidaControl(medida.id, 'medida', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Describir la medida"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Plazo</label>
                                    <input
                                      type="date"
                                      value={medida.plazo}
                                      onChange={(e) => actualizarMedidaControl(medida.id, 'plazo', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                                    <select
                                      value={medida.responsable}
                                      onChange={(e) => actualizarMedidaControl(medida.id, 'responsable', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="">Seleccionar responsable</option>
                                      {responsables.map(resp => (
                                        <option key={resp} value={resp}>{resp}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adjuntar Imagen</label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          actualizarMedidaControl(medida.id, 'imagen', file.name);
                                        }
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {medida.imagen && (
                                      <p className="text-sm text-green-600 mt-1">✓ {medida.imagen}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investigadores */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Investigadores</h3>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      investigadores: [...formData.investigadores, {nombre: "", firma: ""}]
                    })}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mb-4"
                  >
                    Añadir investigador
                  </button>
                  
                  {formData.investigadores.map((investigador, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                      <select
                        value={investigador.nombre}
                        onChange={(e) => {
                          const newInvestigadores = [...formData.investigadores];
                          newInvestigadores[index].nombre = e.target.value;
                          setFormData({...formData, investigadores: newInvestigadores});
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar investigador</option>
                        {investigadoresDisponibles.map(inv => (
                          <option key={inv} value={inv}>{inv}</option>
                        ))}
                      </select>
          <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => {
                          const newInvestigadores = [...formData.investigadores];
                          newInvestigadores[index].firma = e.target.files?.[0]?.name || "";
                          setFormData({...formData, investigadores: newInvestigadores});
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
        </div>
                  ))}
                </div>

                {/* Informador */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">Informador</h3>
                  <div className="flex gap-4">
          <input
            type="text"
            value={formData.informador}
                      onChange={(e) => setFormData({...formData, informador: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => setFormData({...formData, firmaInformador: e.target.files?.[0]?.name || ""})}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    {editingIncidente ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingIncidente(null);
                    }}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Accidentado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro de Trabajo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Evento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Incidente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Riesgo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incidentes.map((incidente) => (
                  <tr key={incidente.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{incidente.rut}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{incidente.nombreAccidentado}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{incidente.cargo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{incidente.area}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{incidente.centroTrabajo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{incidente.tipoEvento}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{incidente.fechaIncidente}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {incidente.riesgoEvaluado && (
                        <div className="flex items-center space-x-2">
                          {renderSemaforoHorizontal(incidente.riesgoEvaluado)}
                          <span className="text-xs text-gray-600">{incidente.riesgoEvaluado}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(incidente)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(incidente.id)}
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
        </div>
      </div>
    </div>
  );
}