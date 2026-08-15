import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  loading = false;
  errorMessage = '';

  registerForm = this.fb.group({

    name: [
      '',
      [
        Validators.required
      ]
    ],

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
        Validators.required,
        Validators.minLength(8)
      ]
    ]

  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const name = this.registerForm.value.name!;
    const email = this.registerForm.value.email!;
    const password = this.registerForm.value.password!;

    this.authService.register(
      name,
      email,
      password
    ).subscribe({

      next: (response) => {
        if (!response?.token) {
          this.loading = false;
          this.errorMessage = 'Registration succeeded but no token was returned.';
          return;
        }

        this.authService.saveToken(
          response.token
        );

        this.router.navigate(['/chat']);

      },

      error: (error) => {

        this.loading = false;
        console.error('Register error', error);

        this.errorMessage = this.extractError(
          error,
          'Registration failed.'
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
