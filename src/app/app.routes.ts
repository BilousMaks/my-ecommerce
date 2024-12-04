import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Імпорт HomeComponent
import { ProductsComponent } from './products/products.component'; // Імпорт компоненту товарів
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component'
import { AuthGuard } from './auth.guard'; // Імпорт Guard
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Головна сторінка
  { path: 'products/:subcategoryId', component: ProductsComponent }, // Динамічний маршрут
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent }, 
];