import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs';

import { Conversation } from '../../../core/models/conversation.model';
import { ConversationService } from '../../../core/services/conversation.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {

  @Input()
  selectedConversationId: number | null = null;

  @Output()
  conversationSelected = new EventEmitter<number>();

  conversations: Conversation[] = [];
  loading = false;
  loadError = '';
  private requestInFlight = false;

  constructor(
    private conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.loadConversations(true);
  }

  loadConversations(showFullLoader = false): void {
    // Avoid stacking list requests behind a long AI reply
    // (php artisan serve handles one request at a time).
    if (this.requestInFlight) {
      return;
    }

    this.requestInFlight = true;

    if (showFullLoader && this.conversations.length === 0) {
      this.loading = true;
    }

    this.loadError = '';

    this.conversationService
      .getConversations()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.requestInFlight = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.conversations = Array.isArray(response) ? response : [];
        },
        error: (error) => {
          console.error('Failed to load conversations', error);
          if (this.conversations.length === 0) {
            this.loadError = 'Could not load chats.';
          }
        }
      });
  }

  prependConversation(conversation: Conversation): void {
    if (!conversation?.id) {
      return;
    }

    this.loading = false;
    this.loadError = '';

    const rest = this.conversations.filter((item) => item.id !== conversation.id);
    this.conversations = [conversation, ...rest];
  }

  updateConversationTitle(id: number, title: string): void {
    this.conversations = this.conversations.map((item) =>
      item.id === id ? { ...item, title } : item
    );
  }

  selectConversation(id: number): void {
    this.conversationSelected.emit(id);
  }
}
