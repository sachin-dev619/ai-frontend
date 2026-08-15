import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    this.authService.login(
      email,
      password
    ).subscribe({

      next: (response) => {
        if (!response?.token) {
          this.loading = false;
          this.errorMessage = 'Login succeeded but no token was returned.';
          return;
        }

        this.authService.saveToken(
          response.token
        );

        this.router.navigate(['/chat']);

      },

      error: (error) => {

        this.loading = false;
        console.error('Login error', error);

        this.errorMessage = this.extractError(
          error,
          'Invalid email or password.'
        );

      },

      complete: () => {
        this.loading = false;
      }

    });
  }

  private extractError(error: any, fallback: string): string {
    const errors = error?.error?.errors;

    if (errors) {
      const firstKey = Object.keys(errors)[0];
      if (firstKey && errors[firstKey]?.[0]) {
        return errors[firstKey][0];
      }
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.status === 0) {
      return 'Cannot reach API. Make sure Laravel is running on port 8000 and refresh the page.';
    }

    if (error?.status) {
      return `${fallback} (HTTP ${error.status})`;
    }

    return fallback;
  }
}
