import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AiMode = 'online' | 'offline';

@Injectable({
  providedIn: 'root'
})
export class AiModeService {

  private readonly modeSubject = new BehaviorSubject<AiMode>('online');

  readonly mode$: Observable<AiMode> = this.modeSubject.asObservable();

  get mode(): AiMode {
    return this.modeSubject.value;
  }

  setMode(mode: AiMode): void {
    this.modeSubject.next(mode);
  }
}
