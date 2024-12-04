import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Додано CommonModule для підтримки *ngIf
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn = false;
  user: any = null; // Змінна для зберігання користувача

  constructor(private router: Router) {}

  ngOnInit() {
    const userEmail = localStorage.getItem('userEmail');
    this.isUserLoggedIn = !!userEmail;
    if (this.isUserLoggedIn) {
      // Отримуємо дані користувача з localStorage
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }
  }

  onProfileClick() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/profile']); // Перенаправляємо на сторінку профілю
    } else {
      this.router.navigate(['/login']); // Перенаправляємо на сторінку реєстрації
    }
  }

  logout() {
    // Видаляємо інформацію про користувача з localStorage
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user'); // Видаляємо дані користувача
    this.isUserLoggedIn = false;
    this.user = null; // Оновлюємо значення користувача

    // Перенаправляємо на головну сторінку
    this.router.navigate(['/']);
  }
}
