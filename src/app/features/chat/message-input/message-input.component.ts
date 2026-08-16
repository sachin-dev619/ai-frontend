import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { ChatService } from '../../../core/services/chat.service';
import { ConversationService } from '../../../core/services/conversation.service';
import { AiModeService } from '../../../core/services/ai-mode.service';
import { Message } from '../../../core/models/message.model';
import { Conversation } from '../../../core/models/conversation.model';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {

  @Input()
  conversationId: number | null = null;

  @Output()
  conversationCreated = new EventEmitter<Conversation>();

  @Output()
  messagePending = new EventEmitter<string>();

  @Output()
  messagesSent = new EventEmitter<Message[]>();

  @Output()
  sendFailed = new EventEmitter<string>();

  message = '';
  sending = false;

  constructor(
    private chatService: ChatService,
    private conversationService: ConversationService,
    private aiModeService: AiModeService
  ) {}

  sendMessage(): void {
    if (!this.message.trim() || this.sending) {
      return;
    }

    const content = this.message.trim();
    this.message = '';
    this.sending = true;
    this.messagePending.emit(content);

    if (!this.conversationId) {
      this.conversationService
        .createConversation(content.slice(0, 60) || 'New Chat')
        .subscribe({
          next: (conversation) => {
            this.conversationCreated.emit(conversation);
            this.postMessage(conversation.id, content);
          },
          error: (error) => {
            console.error('Failed to create conversation', error);
            this.sending = false;
            this.sendFailed.emit('Could not create chat. Please try again.');
          }
        });

      return;
    }

    this.postMessage(this.conversationId, content);
  }

  onEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.shiftKey) {
      return;
    }

    keyboardEvent.preventDefault();
    this.sendMessage();
  }

  private postMessage(conversationId: number, content: string): void {
    this.chatService
      .sendMessage(conversationId, content, this.aiModeService.mode)
      .subscribe({
        next: (response) => {
          if (!response?.user_message || !response?.assistant_message) {
            this.sending = false;
            this.sendFailed.emit('Invalid AI response. Please try again.');
            return;
          }

          this.messagesSent.emit([
            response.user_message,
            response.assistant_message
          ]);
          this.sending = false;
        },
        error: (error) => {
          console.error('Failed to send message', error);
          this.sending = false;
          this.sendFailed.emit(
            error?.error?.message || 'Failed to get AI reply. Please try again.'
          );
        }
      });
  }
}
