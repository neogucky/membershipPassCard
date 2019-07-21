import {Component, OnInit} from '@angular/core';
import Quagga from 'quagga';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  detectedCode = '';
  scanning = true;

  constructor() {}

  ngOnInit(): void {
    // check if media Devices is accessible:
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      console.log('Device supports video streams');
    } else {
      // FIXME: manual ID entry
      alert('Device not compatible');
    }

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
        // Quagga.stop();
        this.scanning = false;
      }
    });
  }

  restartScanner(): void {
    this.scanning = true;
    // Quagga.start();
  }
}
