import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Simulación de verificación de autenticación
  const isAuthenticated = !!localStorage.getItem('token'); // Cambiar 'token' por tu lógica

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a la página de login
    window.location.href = '/Gauss/login';
    return false;
  }

  // Si está autenticado, permitir el acceso
  return true;
};
