import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
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

  constructor(private router: Router) {}

  ngOnInit() {
    // Перевіряємо, чи є користувач авторизованим
    const userEmail = localStorage.getItem('userEmail');
    this.isUserLoggedIn = !!userEmail;
  }

  onLoginClick() {
    // Перенаправлення на сторінку входу
    this.router.navigate(['/login']);
  }

  logout() {
    // Видаляємо інформацію про користувача
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    this.isUserLoggedIn = false;
    this.router.navigate(['/']);
  }
}
