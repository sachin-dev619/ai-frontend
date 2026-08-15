import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { ChatService } from '../../../core/services/chat.service';
import { ConversationService } from '../../../core/services/conversation.service';
import { Message } from '../../../core/models/message.model';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {

  @Input()
  conversationId: number | null = null;

  @Output()
  conversationCreated = new EventEmitter<number>();

  @Output()
  messagesSent = new EventEmitter<Message[]>();

  message = '';

  sending = false;

  constructor(
    private chatService: ChatService,
    private conversationService: ConversationService
  ) {}

  sendMessage(): void {

    if (!this.message.trim() || this.sending) {
      return;
    }

    const content = this.message.trim();

    this.message = '';
    this.sending = true;

    if (!this.conversationId) {
      this.conversationService
        .createConversation(
          content.slice(0, 60) || 'New Chat'
        )
        .subscribe({
          next: (conversation) => {
            this.conversationCreated.emit(conversation.id);
            this.postMessage(conversation.id, content);
          },
          error: (error) => {
            console.error('Failed to create conversation', error);
            this.sending = false;
          }
        });

      return;
    }

    this.postMessage(this.conversationId, content);
  }

  private postMessage(
    conversationId: number,
    content: string
  ): void {

    this.chatService
      .sendMessage(
        conversationId,
        content
      )
      .subscribe({

        next: (response) => {
          this.messagesSent.emit([
            response.user_message,
            response.assistant_message
          ]);
        },

        error: (error) => {
          console.error('Failed to send message', error);
        },

        complete: () => {
          this.sending = false;
        }

      });
  }

}
