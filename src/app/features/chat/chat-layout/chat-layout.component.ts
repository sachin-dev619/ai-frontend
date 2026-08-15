import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss']
})
export class ChatLayoutComponent {

  selectedConversationId: number | null = null;

  constructor(
    private router: Router
  ) {}

  selectConversation(id: number): void {
    this.selectedConversationId = id;
  }

  newChat(): void {
    this.selectedConversationId = null;
  }

  logout(): void {

    localStorage.removeItem('auth_token');

    this.router.navigate(['/login']);
  }
}