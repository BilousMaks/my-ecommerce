import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Відправляємо дані реєстрації:', this.registerForm.value);
  
      this.apiService.registerUser(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Успішна відповідь сервера:', response);
          this.message = response.message;
  
          localStorage.setItem('user', JSON.stringify({
            username: this.registerForm.value.username,
            email: this.registerForm.value.email,
          }));
  
          setTimeout(() => this.router.navigate(['/profile']), 2000);
        },
        error: (err) => {
          console.error('Помилка реєстрації:', err);
          this.message = err.error.message || 'Помилка реєстрації';
        },
      });
    }
  }
}