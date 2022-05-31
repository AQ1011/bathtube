import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { collection, doc, docSnapshots, Firestore, onSnapshot, setDoc, collectionChanges, getDoc, updateDoc } from '@angular/fire/firestore';

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
    private firestore: Firestore
  ) {
  }

  async ngOnInit() {
  }

  async ngAfterViewInit() {
    this.webcamButton = document.getElementById('webcamButton') as HTMLButtonElement;
    this.webcamVideo = document.getElementById('webcamVideo') as HTMLVideoElement;
    this.callButton = document.getElementById('callButton') as HTMLButtonElement;
    this.answerButton = document.getElementById('answerButton') as HTMLButtonElement;
    this.remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    this.hangupButton = document.getElementById('hangupButton') as HTMLButtonElement;
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

  async callBtnClick() {
    const callDoc = collection(this.firestore, 'vcs');
    const offerCandidates = collection(callDoc, this.roomId, 'offerCandidates');
    const answerCandidates = collection(callDoc, this.roomId, 'answerCandidates');

    // Get candidates for caller, save to db
    this.pc.onicecandidate = (event) => {
      event.candidate && setDoc(doc(offerCandidates), event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await this.pc.createOffer();
    await this.pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(doc(callDoc, this.roomId), { offer });

    // Listen for remote answer
    onSnapshot(doc(callDoc,this.roomId), (snapshot) => {
      const data = snapshot.data();
      console.log(data);
      if (!this.pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        this.pc.setRemoteDescription(answerDescription);
      }
    })

    // When answered, add candidate to peer connection
    collectionChanges(answerCandidates).subscribe((changes) => {
      changes.forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          this.pc.addIceCandidate(candidate);
        }
      })
    })

    this.hangupButton.disabled = false;
  }

  async answerButtonClick() {
    const callDoc = collection(this.firestore, 'vcs');
    const offerCandidates = collection(callDoc, this.roomId, 'offerCandidates');
    const answerCandidates = collection(callDoc, this.roomId, 'answerCandidates');

    this.pc.onicecandidate = (event) => {
      event.candidate && setDoc(doc(answerCandidates),  event.candidate.toJSON());
    };

    const callData = (await getDoc(doc(callDoc, this.roomId))).data();

    const offerDescription = callData!.offer;
    await this.pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(doc(callDoc, this.roomId), { answer });
    collectionChanges(offerCandidates).subscribe((changes) => {
      changes.forEach((change) => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(data);
          this.pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    })
  }
}
