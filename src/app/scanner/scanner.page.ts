import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

  output: any = '';
  isScanning: boolean = false;
  isOpen: boolean = false;
  button: any;
  positionTitle: string;
  constructor(
    private DB: DbService,
    private router: Router,
    private db: AngularFireDatabase,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.positionTitle = this.route.snapshot.paramMap.get('position');
  }

  ionViewDidEnter() {
  }

  view(order) {
    this.isScanning = false;
    this.isOpen = false;
    this.DB.setOrder(order);
    const positionParts = this.positionTitle.split(',');
const x = parseInt(positionParts[0].substring(1)); // Extraer el número después de 'x'
const y = parseInt(positionParts[1].substring(1)); // Extraer el número después de 'y'
this.navigateToBands(x, y);
  }
  navigateToBands(x: number, y: number) {
    this.router.navigate(['/bands', x, y]);
  }

  redirectOrder(orderInfo: any) {
    console.log('-----');
    if (this.isScanning === false) {
      const scanner = document.getElementById("scan");
      scanner.click();
      this.isScanning = true;
      this.output = orderInfo;
      let infoScanned = JSON.parse(this.output);
      if (infoScanned !== null) {
        console.log(infoScanned.key);
        this.db.object('orders/' + infoScanned.key).snapshotChanges().subscribe((data: any) => {
          let order = { key: data.key, ...data.payload.val() }
          this.view(order);
        });
      }

    }
  }

  activeCamara() {
    this.isOpen = true;
    setTimeout(() => {
      const scanner = document.getElementById("scan");
      scanner.click();
    }, 1000);
    //qrcode.click();
  }

}
