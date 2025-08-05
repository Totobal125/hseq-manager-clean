import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const isAuth = !!token?.value;
  const { pathname } = request.nextUrl;

  // Rutas permitidas sin autenticación
  const publicRoutes = ['/login', '/presentation/login'];

  // Si el usuario no está autenticado y va a una ruta privada
  const isProtectedRoute = !publicRoutes.includes(pathname);
  if (!isAuth && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si está autenticado y quiere acceder al login
  if (isAuth && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',                         // Home
    '/login',                    // Login corto
    '/presentation/:path*',      // Rutas internas
    '/desempeno',                // Ruta reescrita
    '/inspeccion',               // Ruta reescrita
    '/observacion',              // Reescrita
    '/capacitacion',
    '/epp',
    '/incidentes',
    '/rendimiento',
    '/observaciones',
    '/perfil',
    '/usuarios/:path*',          // incluyendo /usuarios/nuevo
  ],
};
