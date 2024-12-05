import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  subcategoryId: number | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    // Отримання параметра subcategoryId
    this.route.params.subscribe((params) => {
      this.subcategoryId = +params['subcategoryId'];
      if (this.subcategoryId) {
        this.apiService.getProducts(this.subcategoryId).subscribe(
          (data) => (this.products = data),
          (error) => console.error('Помилка завантаження продуктів:', error)
        );
      }
    });
  }
}
