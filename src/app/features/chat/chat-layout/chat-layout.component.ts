import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ConversationService } from '../../../core/services/conversation.service';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss']
})
export class ChatLayoutComponent {

  @ViewChild(ConversationListComponent)
  conversationList?: ConversationListComponent;

  selectedConversationId: number | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private conversationService: ConversationService
  ) {}

  selectConversation(id: number): void {
    this.selectedConversationId = id;
  }

  onConversationCreated(id: number): void {
    this.selectedConversationId = id;
    this.conversationList?.loadConversations();
  }

  newChat(): void {
    this.conversationService
      .createConversation('New Chat')
      .subscribe({
        next: (conversation) => {
          this.selectedConversationId = conversation.id;
          this.conversationList?.loadConversations();
        },
        error: (error) => {
          console.error('Failed to create conversation', error);
        }
      });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  private clearSession(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
