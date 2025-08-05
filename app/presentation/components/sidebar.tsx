'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FiLogOut, 
  FiChevronDown, 
  FiHome, 
  FiSettings, 
  FiUsers, 
  FiShield, 
  FiTrendingUp, 
  FiEye, 
  FiBookOpen, 
  FiPackage,
  FiAlertTriangle,
  FiBarChart,
  FiClipboard,
  FiUser,
  FiPlus,
  FiGrid,
  FiBriefcase,
  FiFileText,
  FiX,
  FiDatabase,
  FiTarget,
  FiAward
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import TypewriterText from '@/app/presentation/components/TypewriterText';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isMobileSidebarOpen, isDesktopSidebarOpen, logout, closeMobileSidebar, closeSidebar } = useAuth();
  const [showGestion, setShowGestion] = useState(true);
  const [showAjustes, setShowAjustes] = useState(false);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleLinkClick = () => {
    // Cerrar el sidebar móvil cuando se hace clic en un enlace
    closeMobileSidebar();
  };

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      title: "Gestión",
      icon: <FiShield className="w-5 h-5" />,
      isOpen: showGestion,
      onToggle: () => setShowGestion(!showGestion),
      items: [
        { href: "/inspeccion", label: "Inspección", icon: <FiEye className="w-4 h-4" /> },
        { href: "/observacion", label: "Observación", icon: <FiClipboard className="w-4 h-4" /> },
        { href: "/entrega-epp", label: "Entrega EPP", icon: <FiPackage className="w-4 h-4" /> },
        { href: "/capacitacion", label: "Capacitación", icon: <FiBookOpen className="w-4 h-4" /> },
        { href: "/desempeno", label: "Desempeño", icon: <FiTrendingUp className="w-4 h-4" /> },
        { href: "/incidente", label: "Incidentes", icon: <FiAlertTriangle className="w-4 h-4" /> },
        { href: "/documentacion", label: "Documentación", icon: <FiBookOpen className="w-4 h-4" /> },
        { href: "/percepcion-riesgo", label: "Percepción de Riesgo", icon: <FiAward className="w-4 h-4" /> },
      ]
    },

    {
      title: "Ajustes",
      icon: <FiSettings className="w-5 h-5" />,
      isOpen: showAjustes,
      onToggle: () => setShowAjustes(!showAjustes),
      items: [
        { href: "/tipos-empresas", label: "Tipos de Empresas", icon: <FiGrid className="w-4 h-4" /> },
        { href: "/empresas", label: "Empresas", icon: <FiBriefcase className="w-4 h-4" /> },
        { href: "/usuarios", label: "Usuarios", icon: <FiPlus className="w-4 h-4" /> },
        { href: "/trabajadores", label: "Trabajadores", icon: <FiUsers className="w-4 h-4" /> },
        { href: "/cargos", label: "Cargos", icon: <FiBriefcase className="w-4 h-4" /> },
        { href: "/epp", label: "Tipo de EPP", icon: <FiPackage className="w-4 h-4" /> },
        { href: "/encargados", label: "Encargados", icon: <FiUser className="w-4 h-4" /> },
        { href: "/areas", label: "Áreas", icon: <FiGrid className="w-4 h-4" /> },
        { href: "/centros-trabajo", label: "Centros de Trabajo", icon: <FiGrid className="w-4 h-4" /> },
        { href: "/checklist", label: "Checklist", icon: <FiClipboard className="w-4 h-4" /> },
        { href: "/actividades", label: "Actividades", icon: <FiClipboard className="w-4 h-4" /> },
        { href: "/informes", label: "Informes de Capacitación", icon: <FiFileText className="w-4 h-4" /> },
        { href: "/perfil", label: "Perfil", icon: <FiUser className="w-4 h-4" /> },
        { href: "/causas-basicas", label: "Causas Básicas", icon: <FiDatabase className="w-4 h-4" /> },
        { href: "/acciones-subestandares", label: "Acciones Subestandares", icon: <FiAlertTriangle className="w-4 h-4" /> },
        { href: "/condiciones-subestandares", label: "Condiciones Subestandares", icon: <FiShield className="w-4 h-4" /> },
        { href: "/falta-control", label: "Falta de Control", icon: <FiTarget className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <aside className={`h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white fixed left-0 top-0 shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-[999] md:z-auto
      ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
      ${isDesktopSidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full'}`}>
      {/* Header */}
      <div className="px-6 py-8 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              HSEQ Manager
            </h1>
            <p className="text-xs text-slate-400 mt-1">Gestión de Seguridad y Salud en el Trabajo</p>
          </div>
          {/* Botón X para cerrar - visible en móvil y desktop */}
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 group"
            aria-label="Cerrar sidebar"
          >
            <FiX className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-200" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 scrollbar-thin">
        <nav className="space-y-2 px-4">
          {/* Dashboard */}
          <Link 
            href="/" 
            onClick={handleLinkClick}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive("/") 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
            }`}
          >
            <FiHome className="w-5 h-5" />
            <span className="font-medium">Tablero</span>
          </Link>

          {/* Menu Sections */}
          {menuItems.map((section, index) => (
            <div key={index} className="space-y-1">
              <button
                onClick={section.onToggle}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                </div>
                <FiChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    section.isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {section.isOpen && (
                <div className="ml-8 space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30"
                          : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-200"
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive(item.href) && (
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-auto"></div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 p-4 flex-shrink-0">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
