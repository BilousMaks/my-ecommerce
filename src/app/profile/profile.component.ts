import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Імпортуємо CommonModule
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule],  // Додаємо CommonModule
})
export class ProfileComponent implements OnInit {
  user: any;
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      this.apiService.getProfile(userEmail).subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          this.errorMessage = 'Помилка завантаження профілю';
          console.error(err);
          if (err.status === 404) {
            this.errorMessage = 'Користувача не знайдено';
          }
        },
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
