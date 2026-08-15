import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { Message } from '../../../core/models/message.model';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnChanges {

  @Input()
  conversationId: number | null = null;

  @Output()
  conversationCreated = new EventEmitter<number>();

  messages: Message[] = [];

  constructor(
    private chatService: ChatService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['conversationId'] &&
      this.conversationId
    ) {
      this.loadMessages();
    }

    if (
      changes['conversationId'] &&
      !this.conversationId
    ) {
      this.messages = [];
    }
  }

  loadMessages(): void {

    if (!this.conversationId) {
      return;
    }

    this.chatService
      .getMessages(this.conversationId)
      .subscribe({

        next: (messages) => {
          this.messages = messages;
        },

        error: (error) => {
          console.error('Failed to load messages', error);
        }

      });
  }

  onConversationCreated(id: number): void {
    this.conversationCreated.emit(id);
  }

  onMessagesSent(newMessages: Message[]): void {
    this.messages = [
      ...this.messages,
      ...newMessages
    ];
  }
}
