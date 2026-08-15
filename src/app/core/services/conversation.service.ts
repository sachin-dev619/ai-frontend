import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private apiUrl = `${environment.apiUrl}/conversations`;

  constructor(
    private http: HttpClient
  ) {}

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.apiUrl);
  }

  createConversation(title: string = 'New Chat'): Observable<Conversation> {
    return this.http.post<Conversation>(
      this.apiUrl,
      { title }
    );
  }

  getConversation(id: number): Observable<Conversation> {
    return this.http.get<Conversation>(
      `${this.apiUrl}/${id}`
    );
  }

  deleteConversation(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}