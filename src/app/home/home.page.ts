import { Component, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CommonService } from '../services/common.service';
import { environment } from 'src/environments/environment.prod';
import { DbService } from '../services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy{

  isOpen = false;
  currency: any = '';
  orders: any = '';
  allOrders: any = [];
  totalDay:any = 0;
  rows = 9; // Número de filas
  cols = 13; // Número de columnas

  constructor(
    private db: AngularFireDatabase,
    private common: CommonService,
    private DB: DbService,
    private router: Router,
    private navCtrl: NavController,
  ) {
    this.currency = environment.currency;
   
    //console.log(this.matriz[1][1][9]);
  }
  navigateToScanner(position: string) {
    this.router.navigate(['/scanner', position]);
  }
  getCellPosition(x: number, y: number): string {
    const invertedX = this.rows - x + 1; // Invertir la coordenada x
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Abecedario
  const letter = alphabet.charAt(y - 1); // Obtener la letra correspondiente
  return `${letter}(${invertedX}-${y})`;
  }
  getRowNumbers(): number[] {
    return Array(this.rows).fill(0).map((_, index) => index + 1).reverse();
  }

  getColNumbers(): number[] {
    return Array(this.cols).fill(0).map((_, index) => index + 1);
  }
  ionViewDidEnter() {
    this.common.showLoader();
    this.db.object('settings/').snapshotChanges().subscribe((settings: any) => {
      if (settings.payload.val().isOpen != undefined && settings.payload.val().isOpen != null)
        this.isOpen = settings.payload.val().isOpen;

      this.common.hideLoader();
    })
  }

  changeStatus() {
    this.db.object('settings/').update({ isOpen: this.isOpen }).then(() => {
      this.common.showToast("Updated");
    }).catch(e => {
      this.common.showToast("Error");
    });
  }

  view(order) {
    this.DB.setOrder(order);
    this.router.navigateByUrl('/view-order');
  }



  ngOnDestroy(){
    console.log("Destruyendo componente");
  }

}
