import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { Message } from '../../../core/models/message.model';
import { Conversation } from '../../../core/models/conversation.model';
import { ChatService } from '../../../core/services/chat.service';
import { AiMode, AiModeService } from '../../../core/services/ai-mode.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnChanges {

  @Input()
  conversationId: number | null = null;

  @Output()
  conversationCreated = new EventEmitter<Conversation>();

  @Output()
  messagesUpdated = new EventEmitter<void>();

  @ViewChild('messagesEnd')
  messagesEnd?: ElementRef<HTMLDivElement>;

  messages: Message[] = [];
  waitingForReply = false;
  loadingMessages = false;
  errorMessage = '';
  mode: AiMode = 'online';

  constructor(
    private chatService: ChatService,
    private aiModeService: AiModeService
  ) {
    this.mode = this.aiModeService.mode;
    this.aiModeService.mode$.subscribe((mode) => {
      this.mode = mode;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['conversationId']) {
      return;
    }

    // Keep optimistic bubbles while a send is in progress.
    if (this.waitingForReply) {
      return;
    }

    if (!this.conversationId) {
      this.messages = [];
      this.errorMessage = '';
      this.loadingMessages = false;
      return;
    }

    const previousId = changes['conversationId'].previousValue;
    const isFirstBind = changes['conversationId'].firstChange;

    // Skip reload when id was null→value during first send (messages already shown).
    if (!isFirstBind && previousId == null && this.messages.length > 0) {
      return;
    }

    this.loadMessages();
  }

  setMode(mode: AiMode): void {
    this.aiModeService.setMode(mode);
  }

  loadMessages(): void {
    if (!this.conversationId || this.waitingForReply) {
      return;
    }

    this.loadingMessages = true;
    this.errorMessage = '';

    this.chatService
      .getMessages(this.conversationId)
      .subscribe({
        next: (messages) => {
          if (!this.waitingForReply) {
            this.messages = messages;
          }
          this.loadingMessages = false;
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Failed to load messages', error);
          this.loadingMessages = false;
          if (this.messages.length === 0) {
            this.errorMessage = 'Could not load messages.';
          }
        }
      });
  }

  onConversationCreated(conversation: Conversation): void {
    this.conversationCreated.emit(conversation);
  }

  onMessagePending(content: string): void {
    this.errorMessage = '';
    this.waitingForReply = true;
    this.loadingMessages = false;

    this.messages = [
      ...this.messages,
      {
        conversation_id: this.conversationId || 0,
        role: 'user',
        content
      }
    ];

    this.scrollToBottom();
  }

  onMessagesSent(newMessages: Message[]): void {
    const withoutOptimistic = this.messages.filter((message) => !!message.id);

    this.messages = [
      ...withoutOptimistic,
      ...newMessages
    ];
    this.waitingForReply = false;
    this.errorMessage = '';
    this.messagesUpdated.emit();
    this.scrollToBottom();
  }

  onSendFailed(message: string): void {
    this.waitingForReply = false;
    this.errorMessage = message;

    if (this.messages.length && !this.messages[this.messages.length - 1].id) {
      this.messages = this.messages.slice(0, -1);
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messagesEnd?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }, 50);
  }
}
