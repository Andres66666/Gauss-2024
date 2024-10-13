import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  getItem(key: string): any {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem(key) || 'null');
    }
    return null; // O manejar de otra forma si no está disponible
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}
