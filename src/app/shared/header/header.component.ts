import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Додано CommonModule для підтримки *ngIf

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule], // Додано CommonModule
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Виправлено на styleUrls
})
export class HeaderComponent {
  isUserLoggedIn = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Перевіряємо, чи є email в localStorage
    const userEmail = localStorage.getItem('userEmail');
    this.isUserLoggedIn = !!userEmail;
  }

  onProfileClick() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/profile']); // Перенаправляємо на сторінку профілю
    } else {
      this.router.navigate(['/register']); // Перенаправляємо на сторінку реєстрації
    }
  }

  logout() {
    // Видаляємо інформацію про користувача з localStorage
    localStorage.removeItem('userEmail');
    this.isUserLoggedIn = false;

    // Перенаправляємо на головну сторінку
    this.router.navigate(['/']);
  }

  get user() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
