"use client";
import React from "react";
import { X } from "lucide-react";
import Link from "next/link";

type Props = {
  onClose: () => void;
};

export default function UserProfileSidebar({ onClose }: Props) {
  return (
    <div className="h-full flex flex-col bg-white rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              JP
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Juan Pérez</h3>
            <p className="text-gray-600">Administrador</p>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Información Personal</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">Juan Pérez</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">juan@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rol:</span>
                  <span className="font-medium">Administrador</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departamento:</span>
                  <span className="font-medium">IT</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Acciones Rápidas</h4>
                <Link
                href="/presentation/perfil"
                className="block w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 font-medium"
                >
                Editar Perfil Completo
                </Link>
              <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="text-gray-700 font-medium">Cambiar Contraseña</span>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="text-gray-700 font-medium">Configuraciones</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}