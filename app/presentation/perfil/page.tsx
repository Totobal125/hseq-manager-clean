"use client";
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Building, Calendar, 
  Shield, Camera, Save, X, Edit3, Eye, EyeOff, 
  Bell, Globe 
} from 'lucide-react';
import Link from 'next/link';

const LOCAL_KEY = "userProfileData";

const defaultPersonalData = {
  firstName: 'Juan Carlos',
  lastName: 'Rodríguez',
  email: 'juan.rodriguez@empresa.com',
  phone: '+56 9 1234 5678',
  position: 'Gerente de Ventas',
  department: 'Comercial',
  employeeId: 'EMP-2024-001',
  birthDate: '1985-03-15',
  nationality: 'Chile'
};

const defaultCompanyData = {
  company: 'TechCorp Solutions',
  businessUnit: 'Ventas LATAM',
  location: 'Santiago, Chile',
  office: 'Torre Norte, Piso 15',
  manager: 'María González',
  startDate: '2020-01-15',
  contractType: 'Indefinido',
  workSchedule: 'Tiempo Completo'
};

const defaultSecurityData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: true,
  loginAlerts: true,
  sessionTimeout: '30'
};

const defaultPreferences = {
  language: 'es',
  timezone: 'America/Santiago',
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  theme: 'light',
  dateFormat: 'DD/MM/YYYY',
  currency: 'CLP'
};

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150/3B82F6/FFFFFF?text=Usuario');
  const [personalData, setPersonalData] = useState(defaultPersonalData);
  const [companyData, setCompanyData] = useState(defaultCompanyData);
  const [securityData, setSecurityData] = useState(defaultSecurityData);
  const [preferences, setPreferences] = useState(defaultPreferences);

  // Cargar datos desde localStorage al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPersonalData(parsed.personalData || defaultPersonalData);
        setCompanyData(parsed.companyData || defaultCompanyData);
        setSecurityData(parsed.securityData || defaultSecurityData);
        setPreferences(parsed.preferences || defaultPreferences);
        setProfileImage(parsed.profileImage || 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=Usuario');
      }
    }
  }, []);

  // Guardar datos en localStorage al guardar
  const handleSave = async () => {
    try {
      const data = {
        personalData,
        companyData,
        securityData,
        preferences,
        profileImage
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      setIsEditing(false);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      alert('Error al guardar el perfil');
    }
  };

  // Handlers para actualizar estados
  const handlePersonalChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurityData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: { 
          ...(typeof (prev as any)[parent] === 'object' && (prev as any)[parent] !== null ? (prev as any)[parent] : {}), 
          [child]: value 
        }
      }));
    } else {
      setPreferences(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Componente de Input reutilizable
  interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    disabled?: boolean;
    required?: boolean;
    options?: { value: string; label: string }[] | null;
  }

  const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    value, 
    onChange, 
    type = 'text', 
    disabled = false, 
    required = false, 
    options = null 
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || !isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || !isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      )}
    </div>
  );

  // Componente de Toggle Switch
  interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
  }

  const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
    label, 
    checked, 
    onChange, 
    disabled = false 
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => !disabled && isEditing && onChange(!checked)}
        disabled={disabled || !isEditing}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  // Pestaña de Información Personal
  const PersonalTab = () => (
    <div className="space-y-6">
      {/* Foto de perfil */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {personalData.firstName} {personalData.lastName}
          </h3>
          <p className="text-gray-600">{personalData.position}</p>
          <p className="text-sm text-gray-500">{personalData.department}</p>
        </div>
      </div>

      {/* Formulario de datos personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nombres"
          value={personalData.firstName}
          onChange={(value) => handlePersonalChange('firstName', value)}
          required
        />
        <InputField
          label="Apellidos"
          value={personalData.lastName}
          onChange={(value) => handlePersonalChange('lastName', value)}
          required
        />
        <InputField
          label="Email Corporativo"
          value={personalData.email}
          onChange={(value) => handlePersonalChange('email', value)}
          type="email"
          required
        />
        <InputField
          label="Teléfono"
          value={personalData.phone}
          onChange={(value) => handlePersonalChange('phone', value)}
          type="tel"
        />
        <InputField
          label="Cargo"
          value={personalData.position}
          onChange={(value) => handlePersonalChange('position', value)}
          required
        />
        <InputField
          label="Departamento"
          value={personalData.department}
          onChange={(value) => handlePersonalChange('department', value)}
          required
        />
        <InputField
          label="ID Empleado"
          value={personalData.employeeId}
          onChange={(value) => handlePersonalChange('employeeId', value)}
          disabled
        />
        <InputField
          label="Fecha de Nacimiento"
          value={personalData.birthDate}
          onChange={(value) => handlePersonalChange('birthDate', value)}
          type="date"
        />
        <InputField
          label="Nacionalidad"
          value={personalData.nationality}
          onChange={(value) => handlePersonalChange('nationality', value)}
          options={[
            { value: 'Chile', label: 'Chile' },
            { value: 'Argentina', label: 'Argentina' },
            { value: 'Brasil', label: 'Brasil' },
            { value: 'Colombia', label: 'Colombia' },
            { value: 'Perú', label: 'Perú' },
            { value: 'Otro', label: 'Otro' }
          ]}
        />
      </div>
    </div>
  );

  // Pestaña de Información de Empresa
  const CompanyTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Empresa"
          value={companyData.company}
          onChange={(value) => handleCompanyChange('company', value)}
          disabled
        />
        <InputField
          label="Unidad de Negocio"
          value={companyData.businessUnit}
          onChange={(value) => handleCompanyChange('businessUnit', value)}
        />
        <InputField
          label="Ubicación"
          value={companyData.location}
          onChange={(value) => handleCompanyChange('location', value)}
        />
        <InputField
          label="Oficina"
          value={companyData.office}
          onChange={(value) => handleCompanyChange('office', value)}
        />
        <InputField
          label="Jefe Directo"
          value={companyData.manager}
          onChange={(value) => handleCompanyChange('manager', value)}
          disabled
        />
        <InputField
          label="Fecha de Ingreso"
          value={companyData.startDate}
          onChange={(value) => handleCompanyChange('startDate', value)}
          type="date"
          disabled
        />
        <InputField
          label="Tipo de Contrato"
          value={companyData.contractType}
          onChange={(value) => handleCompanyChange('contractType', value)}
          options={[
            { value: 'Indefinido', label: 'Indefinido' },
            { value: 'Plazo Fijo', label: 'Plazo Fijo' },
            { value: 'Temporal', label: 'Temporal' },
            { value: 'Consultor', label: 'Consultor' }
          ]}
          disabled
        />
        <InputField
          label="Jornada Laboral"
          value={companyData.workSchedule}
          onChange={(value) => handleCompanyChange('workSchedule', value)}
          options={[
            { value: 'Tiempo Completo', label: 'Tiempo Completo' },
            { value: 'Medio Tiempo', label: 'Medio Tiempo' },
            { value: 'Flexible', label: 'Flexible' }
          ]}
          disabled
        />
      </div>
    </div>
  );

  // Pestaña de Seguridad
  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Shield className="text-yellow-600 mr-2" size={20} />
          <p className="text-sm text-yellow-800">
            Por seguridad, los cambios de contraseña requieren verificación adicional.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h4>
        
        <InputField
          label="Contraseña Actual"
          value={securityData.currentPassword}
          onChange={(value) => handleSecurityChange('currentPassword', value)}
          type={showPassword ? 'text' : 'password'}
        />
        
        <div className="relative">
          <InputField
            label="Nueva Contraseña"
            value={securityData.newPassword}
            onChange={(value) => handleSecurityChange('newPassword', value)}
            type={showPassword ? 'text' : 'password'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <InputField
          label="Confirmar Nueva Contraseña"
          value={securityData.confirmPassword}
          onChange={(value) => handleSecurityChange('confirmPassword', value)}
          type={showPassword ? 'text' : 'password'}
        />
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Seguridad</h4>
        <div className="space-y-4">
          <ToggleSwitch
            label="Autenticación de Dos Factores"
            checked={securityData.twoFactorEnabled}
            onChange={(value) => handleSecurityChange('twoFactorEnabled', value)}
          />
          <ToggleSwitch
            label="Alertas de Inicio de Sesión"
            checked={securityData.loginAlerts}
            onChange={(value) => handleSecurityChange('loginAlerts', value)}
          />
          <InputField
            label="Tiempo de Sesión (minutos)"
            value={securityData.sessionTimeout}
            onChange={(value) => handleSecurityChange('sessionTimeout', value)}
            options={[
              { value: '15', label: '15 minutos' },
              { value: '30', label: '30 minutos' },
              { value: '60', label: '1 hora' },
              { value: '120', label: '2 horas' }
            ]}
          />
        </div>
      </div>
    </div>
  );

  // Pestaña de Preferencias
  const PreferencesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Idioma"
          value={preferences.language}
          onChange={(value) => handlePreferenceChange('language', value)}
          options={[
            { value: 'es', label: 'Español' },
            { value: 'en', label: 'English' },
            { value: 'pt', label: 'Português' }
          ]}
        />
        <InputField
          label="Zona Horaria"
          value={preferences.timezone}
          onChange={(value) => handlePreferenceChange('timezone', value)}
          options={[
            { value: 'America/Santiago', label: 'Santiago (GMT-3)' },
            { value: 'America/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
            { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
            { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
            { value: 'America/Lima', label: 'Lima (GMT-5)' }
          ]}
        />
        <InputField
          label="Formato de Fecha"
          value={preferences.dateFormat}
          onChange={(value) => handlePreferenceChange('dateFormat', value)}
          options={[
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
          ]}
        />
        <InputField
          label="Moneda"
          value={preferences.currency}
          onChange={(value) => handlePreferenceChange('currency', value)}
          options={[
            { value: 'CLP', label: 'Peso Chileno (CLP)' },
            { value: 'USD', label: 'Dólar Americano (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' },
            { value: 'BRL', label: 'Real Brasileño (BRL)' },
            { value: 'ARS', label: 'Peso Argentino (ARS)' }
          ]}
        />
        <InputField
          label="Tema"
          value={preferences.theme}
          onChange={(value) => handlePreferenceChange('theme', value)}
          options={[
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Oscuro' },
            { value: 'auto', label: 'Automático' }
          ]}
        />
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h4>
        <div className="space-y-4">
          <ToggleSwitch
            label="Notificaciones por Email"
            checked={preferences.notifications.email}
            onChange={(value) => handlePreferenceChange('notifications.email', value)}
          />
          <ToggleSwitch
            label="Notificaciones Push"
            checked={preferences.notifications.push}
            onChange={(value) => handlePreferenceChange('notifications.push', value)}
          />
          <ToggleSwitch
            label="Notificaciones por SMS"
            checked={preferences.notifications.sms}
            onChange={(value) => handlePreferenceChange('notifications.sms', value)}
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'personal', label: 'Información Personal', icon: User },
    { id: 'company', label: 'Empresa', icon: Building },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'preferences', label: 'Preferencias', icon: Edit3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Perfil de Usuario</h1>
              <p className="text-gray-600 mt-1">Gestiona tu información personal y configuraciones</p>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                  >
                    <X size={16} />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                  >
                    <Save size={16} />
                    <span>Guardar</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                >
                  <Edit3 size={16} />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'personal' && <PersonalTab />}
          {activeTab === 'company' && <CompanyTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'preferences' && <PreferencesTab />}
        </div>

        {/* Enlace a edición completa */}
        <div className="mt-6 text-center">
          <Link
  href="/presentation/perfil"
  className="block w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 font-medium"
>
  Editar Perfil Completo
</Link>
        </div>
      </div>
    </div>
  );
};

export default function PerfilPage() {
  return <UserProfile />;
}