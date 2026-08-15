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

        this.authService.saveToken(
          response.token
        );

        this.router.navigate(['/chat']);

      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Registration failed.';

      },

      complete: () => {
        this.loading = false;
      }

    });
  }
}