"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Logo from "../components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Guardar cookie simulada
    document.cookie = "auth_token=demo123; path=/";

    login();

    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl min-h-[600px] md:h-[600px]">
        <div className="flex flex-col md:flex-row h-full">
          {/* Panel izquierdo decorativo */}
          <div className="w-full md:w-1/2 bg-gradient-to-b from-[#0b1f5b] to-[#132a85] relative h-48 md:h-full">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0">
              {/* Línea superior - más difuminada */}
              <div className="absolute top-16 left-8 w-20 h-0.5 bg-white/35 backdrop-blur-md blur-md"></div>
              
              {/* Línea superior derecha */}
              <div className="absolute top-24 right-12 w-16 h-0.5 bg-white/30 backdrop-blur-md blur-md"></div>
              
              {/* Línea media izquierda */}
              <div className="absolute top-1/2 left-1/4 w-24 h-0.5 bg-white/45 backdrop-blur-sm blur-sm"></div>
              
              {/* Línea media derecha */}
              <div className="absolute top-1/2 right-1/4 w-20 h-0.5 bg-white/50 backdrop-blur-sm blur-sm"></div>
              
              {/* Línea centro superior */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-18 h-0.5 bg-white/40 backdrop-blur-sm blur-sm"></div>
              
              {/* Línea inferior izquierda - menos difuminada */}
              <div className="absolute bottom-20 left-12 w-28 h-0.5 bg-white/60 backdrop-blur-sm blur-sm"></div>
              
              {/* Línea inferior derecha - menos difuminada */}
              <div className="absolute bottom-16 right-6 w-14 h-0.5 bg-white/65 backdrop-blur-sm blur-sm"></div>
              
              {/* Línea centro inferior */}
              <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-22 h-0.5 bg-white/55 backdrop-blur-sm blur-sm"></div>
              
              {/* Líneas adicionales para más textura */}
              <div className="absolute top-40 left-1/3 w-16 h-0.5 bg-white/25 backdrop-blur-md blur-md"></div>
              <div className="absolute bottom-40 right-1/3 w-18 h-0.5 bg-white/40 backdrop-blur-sm blur-sm"></div>
            </div>
            
            {/* Contenido del panel izquierdo */}
            <div className="relative z-10 p-6 md:p-12 text-white h-full flex flex-col justify-center">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">¡Bienvenido de nuevo!</h1>
              <p className="text-sm md:text-lg mb-4 md:mb-8 opacity-90">Inicia sesión para acceder a tu cuenta</p>
            </div>

            {/* Patrón ondulado en la parte inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 75%)'
            }}></div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex-1 flex flex-col justify-center">
            {/* Logo y título en la misma línea */}
            <div className="flex items-center justify-center mb-6 md:mb-8">
              <div className="text-center">
                <Logo width={160} height={72} className="md:w-[200px] md:h-[90px]" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">Iniciar Sesión</h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-center text-sm md:text-base">Ingresa tus credenciales para acceder al panel</p>

            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b1f5b] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b1f5b] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0b1f5b] hover:bg-[#08153f] text-white font-medium py-3 px-4 rounded-md transition duration-200"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
