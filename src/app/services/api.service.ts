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

  // Отримати всі підкатегорії для конкретної категорії
  getSubcategories(categoryId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/subcategories/${categoryId}`);
  }

  // Отримати всі продукти для конкретної підкатегорії
  getProducts(subcategoryId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${subcategoryId}`);
  }
  registerUser(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }
  checkEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/check-email/${email}`);
  }
  getProfile(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/${email}`);
  }
}