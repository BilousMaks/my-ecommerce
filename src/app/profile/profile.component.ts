import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Імпортуємо CommonModule

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule], // Додаємо CommonModule
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.http.get(`http://localhost:3000/users/${email}`).subscribe({
        next: (data) => (this.user = data),
        error: (err) => console.error('Помилка завантаження профілю:', err),
      });
    }
  }
}
