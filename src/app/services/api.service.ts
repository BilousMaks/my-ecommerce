import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Отримати всі категорії
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  // Отримати всі підкатегорії
  getSubcategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/subcategories`);
  }

  // Отримати всі продукти
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products`);
  }
}
