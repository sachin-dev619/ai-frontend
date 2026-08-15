import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { User } from '../../shared/models/user.model';

interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

interface UserResponse {
  success: boolean;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiService
  ) {}

  register(
    name: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.api.post<AuthResponse>(
      'register',
      {
        name,
        email,
        password
      }
    );
  }

  login(
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.api.post<AuthResponse>(
      'login',
      {
        email,
        password
      }
    );
  }

  getUser(): Observable<UserResponse> {

    return this.api.get<UserResponse>('user');
  }

  logout(): Observable<any> {

    return this.api.post<any>('logout', {});
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    localStorage.removeItem('auth_token');
  }
}