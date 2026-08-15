import { Component, Input } from '@angular/core';

import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {

  @Input()
  conversationId: number | null = null;

  message = '';

  sending = false;

  constructor(
    private chatService: ChatService
  ) {}

  sendMessage(): void {

    if (!this.conversationId) {
      return;
    }

    if (!this.message.trim()) {
      return;
    }

    const content = this.message.trim();

    this.message = '';

    this.sending = true;

    this.chatService
      .sendMessage(
        this.conversationId,
        content
      )
      .subscribe({

        next: (response) => {
          console.log('Message sent', response);
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