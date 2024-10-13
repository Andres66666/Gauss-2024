import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  private windowWidthSubject = new BehaviorSubject<number>(0);
  windowWidth$ = this.windowWidthSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      this.windowWidthSubject.next(window.innerWidth);
      window.addEventListener('resize', () => {
        this.windowWidthSubject.next(window.innerWidth);
      });
    }
  }
}
