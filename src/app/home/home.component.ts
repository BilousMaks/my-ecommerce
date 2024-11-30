import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

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

  selectedCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getCategories().subscribe(
      (data) => (this.categories = data),
      (error) => console.error('Помилка завантаження категорій:', error)
    );

    if (this.selectedCategoryId) {
      this.apiService.getSubcategories(this.selectedCategoryId).subscribe(
        (data) => (this.subcategories = data),
        (error) => console.error('Помилка завантаження підкатегорій:', error)
      );
    }

    if (this.selectedSubcategoryId) {
      this.apiService.getProducts(this.selectedSubcategoryId).subscribe(
        (data) => (this.products = data),
        (error) => console.error('Помилка завантаження продуктів:', error)
      );
    }
  }

  getSubcategories(categoryId: number) {
    return this.subcategories.filter((sub) => sub.category_id === categoryId);
  }

  getProducts(subcategoryId: number) {
    return this.products.filter((prod) => prod.subcategory_id === subcategoryId);
  }

  onCategoryChange(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.selectedSubcategoryId = null;  // Очистити вибір підкатегорії
    this.apiService.getSubcategories(categoryId).subscribe(
      (data) => (this.subcategories = data),
      (error) => console.error('Помилка завантаження підкатегорій:', error)
    );
  }

  onSubcategoryChange(subcategoryId: number) {
    this.selectedSubcategoryId = subcategoryId;
    this.apiService.getProducts(subcategoryId).subscribe(
      (data) => (this.products = data),
      (error) => console.error('Помилка завантаження продуктів:', error)
    );
  }
}
