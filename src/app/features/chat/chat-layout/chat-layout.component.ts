import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { Conversation } from '../../../core/models/conversation.model';

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
    private authService: AuthService
  ) {}

  selectConversation(id: number): void {
    this.selectedConversationId = id;
  }

  onConversationCreated(conversation: Conversation): void {
    this.selectedConversationId = conversation.id;
    // Update sidebar immediately — do not wait on a list API call
    // (that can get stuck behind the long AI request).
    this.conversationList?.prependConversation(conversation);
  }

  onMessagesUpdated(): void {
    this.conversationList?.loadConversations(false);
  }

  newChat(): void {
    this.selectedConversationId = null;
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
