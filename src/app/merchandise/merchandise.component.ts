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
      this.apiService.getProductById(productId).subscribe({
        next: (data) => (this.product = data),
        error: (err) => console.error('Помилка завантаження товару:', err),
      });
    }
  }
}
