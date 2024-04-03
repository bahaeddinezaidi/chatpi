import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { MessagesService } from '../../services/messages.service';
import { RoomsService } from '../../services/rooms.service';
import { Room } from '../../models/room';
import { Message } from '../../models/message';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit, OnDestroy {
  typingSound: HTMLAudioElement = new Audio();

  messages: Message[] = [];
  nickname = '';
  message = '';
  room: Room = {};

  subscription: Subscription;
  typingTimeout: any;

  constructor(private route: ActivatedRoute,
              private socket: Socket,
              private toastCtrl: ToastController,
              private messagesService: MessagesService,
              private roomsService: RoomsService) { 
                this.typingSound.src = '../../../assets/sound2.mp3';
              }

  ngOnInit() {
    console.log('Connected to WebSocket server:', this.socket.ioSocket.connected);
    this.nickname = sessionStorage.getItem('nickname');

    this.subscription = this.route.params.subscribe(params => {
      const roomId = params.roomId;
      this.socket.emit('enter-chat-room', {roomId, nickname: this.nickname});
      this.roomsService.findById(roomId).subscribe(room => {
        this.room = room;
        this.messagesService.find({where: JSON.stringify({room: this.room._id})}).subscribe(messages => {
          this.messages = messages;
        });
      });
    });

    this.socket.on('message', message => this.messages.push(message));

    this.socket.on('users-changed', data => {
      const user = data.user;
      if (data.event === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });

    this.socket.on('typing', (data) => {
      console.log('Received typing event:', data);
      if (data.isTyping) {
        this.showToast(data.nickname + ' is typing...');
        console.log("insidetyping");
      }
      console.log("outsidedetyping");
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.socket.removeAllListeners('message');
    this.socket.removeAllListeners('users-changed');
    this.socket.emit('leave-chat-room', {roomId: this.room._id, nickname: this.nickname});
  }

  sendMessage() {
    this.socket.emit('add-message', {text: this.message, room: this.room._id});
    this.message = '';
    this.messagesService.playAudio();
  }

  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  startTyping() {
    clearTimeout(this.typingTimeout);
    this.socket.emit('typing', { roomId: this.room._id, nickname: this.nickname, isTyping: true });
    this.typingSound.play();
  }
  
  stopTyping() {
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.socket.emit('typing', { roomId: this.room._id, nickname: this.nickname, isTyping: false });
    }, 1000); // Ajustez la valeur de timeout au besoin
  }
}

  
  // async showToast(msg) {
  //   console.log('Showing toast:', msg); // Ajouter un log pour vérifier si le toast est affiché
  //   const toast = await this.toastCtrl.create({
  //     message: msg,
  //     duration: 2000
  //   });
  //   console.log('Toast created:', toast); // Ajouter un log pour vérifier si le toast est correctement créé
  //   toast.present();
  // }
  
  

