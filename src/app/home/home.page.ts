import {Component, OnInit} from '@angular/core';
import Quagga from 'quagga';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import {environment} from '../../environments/environment.prod';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  detectedCode = '';
  cardHolder = '';
  scanning = false;
  firebaseFunctions;
  downloading = false;
  gym = '';

  constructor() {
    firebase.initializeApp(environment.firebaseConfig);

// Initialize Cloud Functions through Firebase
    this.firebaseFunctions = firebase.functions();
  }

  ngOnInit(): void {
    // check if media Devices is accessible:
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      console.log('Device supports video streams');
    } else {
      // FIXME: manual ID entry
      alert('Device not compatible');
    }
  }


  restartScanner(): void {
    this.scanning = true;

    // FIXME: we propably need to deactivate next line because Quagga does not like restarting
    Quagga.init({
      inputStream : {
        name : 'CameraStream',
        type : 'LiveStream',
        target: '#scanner'
      },
      decoder : {
        readers : ['code_128_reader']
      }
    }, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Initialization finished. Ready to start');
      Quagga.start();
    });
    Quagga.onDetected((data) => {
      if (this.scanning) {
        console.log(data.codeResult.code);
        this.detectedCode = data.codeResult.code;
        Quagga.stop();
        this.scanning = false;
      }
    });
  }

  requestPassGeneration(): void {
    const generate = firebase.functions().httpsCallable('generate');
    generate({id: this.detectedCode, name: this.cardHolder}).then((result) => {
      const blob = new Blob([result.data], {type: 'application/vnd.apple.pkpass'});
      saveAs(blob, 'membershipcard.pkpass');
    });

  }

  startedDownload() {
    this.downloading = true;
  }
}
