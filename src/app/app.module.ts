import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChatLayoutComponent } from './features/chat/chat-layout/chat-layout.component';
import { ConversationListComponent } from './features/chat/conversation-list/conversation-list.component';
import { ChatWindowComponent } from './features/chat/chat-window/chat-window.component';
import { MessageInputComponent } from './features/chat/message-input/message-input.component';
import { MessageItemComponent } from './features/chat/message-item/message-item.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatLayoutComponent,
    ConversationListComponent,
    ChatWindowComponent,
    MessageInputComponent,
    MessageItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
