import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merchandise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchandise.component.html',
  styleUrls: ['./merchandise.component.scss'],
})
export class MerchandiseComponent implements OnInit {
  product: any;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      // Завантаження інформації про товар
      this.apiService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data;

          // Логування взаємодії користувача з товаром (перегляд)
          const userId = localStorage.getItem('userId'); // Перевіряємо чи є userId в localStorage

          if (userId) {
            // Якщо є userId, то логування взаємодії
            this.apiService.logUserInteraction(userId, productId, 'view').subscribe({
              next: () => console.log('Взаємодія з товаром збережена'),
              error: (err) => console.error('Помилка збереження взаємодії:', err),
            });
          } else {
            console.log('Користувач не авторизований, взаємодія не збережена');
          }
        },
        error: (err) => console.error('Помилка завантаження товару:', err),
      });
    }
}

}
