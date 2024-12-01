import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Імпорт HomeComponent
import { ProductsComponent } from './products/products.component'; // Імпорт компоненту товарів

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Головна сторінка
  { path: 'products/:subcategoryId', component: ProductsComponent }, // Динамічний маршрут
  
];
