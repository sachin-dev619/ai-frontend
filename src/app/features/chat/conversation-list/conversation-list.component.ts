import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Conversation } from '../../../core/models/conversation.model';
import { ConversationService } from '../../../core/services/conversation.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit {

  @Output()
  conversationSelected = new EventEmitter<number>();

  conversations: Conversation[] = [];

  loading = false;

  constructor(
    private conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {

    this.loading = true;

    this.conversationService
      .getConversations()
      .subscribe({

        next: (response) => {
          this.conversations = Array.isArray(response) ? response : [];
        },

        error: (error) => {
          console.error('Failed to load conversations', error);
        },

        complete: () => {
          this.loading = false;
        }

      });
  }

  selectConversation(id: number): void {
    this.conversationSelected.emit(id);
  }
}