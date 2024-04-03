import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private readonly URL = environment.apiUrl + 'messages';
  private audio: HTMLAudioElement;

  constructor(private http: HttpClient) {
    this.audio = new Audio();
    this.audio.src = '../../assets/sound.mp3';
  }

  find(params?) {
    return this.http.get<Message[]>(this.URL, {params});
  }
  playAudio(): void {
    this.audio.play();
  }
}
