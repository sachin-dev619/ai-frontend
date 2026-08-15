import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Conversation } from '../models/conversation.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private apiUrl = `${environment.apiUrl}/conversations`;

  constructor(
    private http: HttpClient
  ) {}

  getConversations(): Observable<Conversation[]> {
    return this.http
      .get<ApiResponse<Conversation[]>>(this.apiUrl)
      .pipe(map((response) => response.data ?? []));
  }

  createConversation(title: string = 'New Chat'): Observable<Conversation> {
    return this.http
      .post<ApiResponse<Conversation>>(
        this.apiUrl,
        { title }
      )
      .pipe(map((response) => response.data));
  }

  getConversation(id: number): Observable<Conversation> {
    return this.http
      .get<ApiResponse<Conversation>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(map((response) => response.data));
  }

  deleteConversation(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}
