import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Message } from '../models/message.model';
import { AiMode } from './ai-mode.service';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface SendMessageResponse {
  user_message: Message;
  assistant_message: Message;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = `${environment.apiUrl}/conversations`;

  constructor(
    private http: HttpClient
  ) {}

  getMessages(conversationId: number): Observable<Message[]> {
    return this.http
      .get<ApiResponse<Message[]>>(
        `${this.apiUrl}/${conversationId}/messages`
      )
      .pipe(map((response) => response.data ?? []));
  }

  sendMessage(
    conversationId: number,
    content: string,
    mode: AiMode = 'online'
  ): Observable<SendMessageResponse> {

    return this.http
      .post<ApiResponse<SendMessageResponse>>(
        `${this.apiUrl}/${conversationId}/messages`,
        {
          content,
          mode
        }
      )
      .pipe(map((response) => response.data));
  }
}
