'use client';
import React, { useState } from "react";

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150/3B82F6/FFFFFF?text=Usuario');
  const [personalData, setPersonalData] = useState({
    firstName: 'Juan Carlos',
    lastName: 'Rodríguez',
    email: 'juan.rodriguez@empresa.com',
    phone: '+56 9 1234 5678',
    position: 'Gerente de Ventas',
    department: 'Comercial',
    employeeId: 'EMP-2024-001',
    birthDate: '1985-03-15',
    nationality: 'Chile'
  });

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={profileImage}
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {personalData.firstName} {personalData.lastName}
          </h3>
          <p className="text-gray-600">{personalData.position}</p>
          <p className="text-sm text-gray-500">{personalData.department}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="font-medium text-gray-700">Email:</span>
          <span className="ml-2">{personalData.email}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Teléfono:</span>
          <span className="ml-2">{personalData.phone}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">ID Empleado:</span>
          <span className="ml-2">{personalData.employeeId}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Fecha de Nacimiento:</span>
          <span className="ml-2">{personalData.birthDate}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Nacionalidad:</span>
          <span className="ml-2">{personalData.nationality}</span>
        </div>
      </div>
      {/* Aquí puedes agregar más stats, tabs, o acciones */}
    </div>
  );
};

export default UserProfile;