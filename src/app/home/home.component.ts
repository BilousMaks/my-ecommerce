import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // Додаємо CommonModule та RouterModule до імпортів
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  subcategories: any[] = [];
  products: any[] = [];
  recommendedProducts: any[] = []; // Для рекомендацій

  selectedCategoryId: number | null = null;
  selectedSubcategoryId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadRecommendations(); // Завантаження рекомендацій
  }

  // Завантаження категорій
  loadCategories() {
    this.apiService.getCategories().subscribe(
      (data) => (this.categories = data),
      (error) => console.error('Помилка завантаження категорій:', error)
    );
  }

  // Завантаження рекомендацій
  loadRecommendations() {
    const userId = localStorage.getItem('userId'); // Замініть на реальне джерело ID користувача
    if (userId) {
      this.apiService.getRecommendations(userId).subscribe(
        (data) => (this.recommendedProducts = data),
        (error) => console.error('Помилка завантаження рекомендацій:', error)
      );
    } else {
      console.warn('Користувач не автентифікований. Рекомендації недоступні.');
    }
  }

  // Завантаження підкатегорій
  onCategoryChange(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.selectedSubcategoryId = null; // Очистити вибір підкатегорії
    this.apiService.getSubcategories(categoryId).subscribe(
      (data) => (this.subcategories = data),
      (error) => console.error('Помилка завантаження підкатегорій:', error)
    );
  }

  // Завантаження продуктів
  onSubcategoryChange(subcategoryId: number) {
    this.selectedSubcategoryId = subcategoryId;
    this.apiService.getProducts(subcategoryId).subscribe(
      (data) => (this.products = data),
      (error) => console.error('Помилка завантаження продуктів:', error)
    );
  }

  // Отримати підкатегорії для вибраної категорії
  getSubcategories(categoryId: number) {
    return this.subcategories.filter((sub) => sub.category_id === categoryId);
  }

  // Отримати продукти для вибраної підкатегорії
  getProducts(subcategoryId: number) {
    return this.products.filter((prod) => prod.subcategory_id === subcategoryId);
  }
}
