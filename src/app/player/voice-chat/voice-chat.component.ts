import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-voice-chat',
  templateUrl: './voice-chat.component.html',
  styleUrls: ['./voice-chat.component.scss']
})
export class VoiceChatComponent implements OnInit, AfterViewInit {

  servers = {
    iceServers: [
      {
        urls: "stun:stun.services.mozilla.com",
      },
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  pc = new RTCPeerConnection(this.servers);
  localStream!: MediaStream;
  remoteStream!: MediaStream;

  @ViewChild('webcamButton')
  webcamButton!: HTMLButtonElement;

  @ViewChild('webcamVideo')
  webcamVideo!: HTMLVideoElement;

  @ViewChild('callButton')
  callButton!: HTMLButtonElement;

  @ViewChild('answerButton')
  answerButton!: HTMLButtonElement;

  @ViewChild('remoteVideo')
  remoteVideo!: HTMLVideoElement;

  @ViewChild('hangupButton')
  hangupButton!: HTMLButtonElement;

  @Input() roomId: string = '';
  @Input() viewer: string[] = [];

  constructor(
    private chatSvc: ChatService,
  ) {
  }

  ngOnInit() {
    this.chatSvc.getPeers().subscribe((peers) => {
      peers.forEach((peer: string) => {
        this.sendOffer(peer)
      });
    })
  }

  async ngAfterViewInit() {
    this.webcamButton = document.getElementById('webcamButton') as HTMLButtonElement;
    this.webcamVideo = document.getElementById('webcamVideo') as HTMLVideoElement;
    this.callButton = document.getElementById('callButton') as HTMLButtonElement;
    this.answerButton = document.getElementById('answerButton') as HTMLButtonElement;
    // this.webCamClick();
  }

  async webCamClick() {
    // @ts-ignore
    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.remoteStream = new MediaStream();
    // Push tracks from local stream to peer connection
    this.localStream.getTracks().forEach((track) => {
      this.pc.addTrack(track, this.localStream);
    });

    // Pull tracks from remote stream, add to video stream
    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
    }

    try {
      this.webcamVideo.srcObject = this.localStream;
      console.log('remoteStream', this.remoteStream);
      this.remoteVideo.srcObject = this.remoteStream;

      this.callButton!.disabled = false;
      this.answerButton!.disabled = false;
      this.webcamButton!.disabled = true;
    } catch (e) {
      console.log('error',e);
    }
  }

  async sendOffer(peer: string) {
    const pc = new RTCPeerConnection(this.servers);

    this.chatSvc.getAnswer().then(async (message) => {
      if (message.id == peer) {
        const remoteDesc = new RTCSessionDescription(message.answer);
        await pc.setRemoteDescription(remoteDesc);
      }
    })

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.chatSvc.sendOffer(offer, peer)

    pc.onicecandidate = () => {

    }
  }
}
