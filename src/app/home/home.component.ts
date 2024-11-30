import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';  // Імпортуємо CommonModule для *ngFor

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],  // Додаємо CommonModule до імпортів
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  subcategories: any[] = [];
  products: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getCategories().subscribe(
      (data) => (this.categories = data),
      (error) => console.error('Помилка завантаження категорій:', error)
    );

    this.apiService.getSubcategories().subscribe(
      (data) => (this.subcategories = data),
      (error) => console.error('Помилка завантаження підкатегорій:', error)
    );

    this.apiService.getProducts().subscribe(
      (data) => (this.products = data),
      (error) => console.error('Помилка завантаження продуктів:', error)
    );
  }

  getSubcategories(categoryId: number) {
    return this.subcategories.filter((sub) => sub.category_id === categoryId);
  }

  getProducts(subcategoryId: number) {
    return this.products.filter((prod) => prod.subcategory_id === subcategoryId);
  }
}
