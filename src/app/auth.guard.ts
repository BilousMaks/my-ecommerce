import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Перевіряємо, чи є інформація про користувача в localStorage
    const user = localStorage.getItem('user');
    
    // Якщо користувач вже зареєстрований, переходимо на сторінку профілю
    if (user) {
      this.router.navigate(['/profile']);
      return false;  // Не дозволяємо доступ до реєстрації
    }
    
    return true;  // Дозволяємо доступ до реєстрації
  }
}
