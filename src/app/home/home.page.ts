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
    this.getAllOrders();
    //console.log(this.matriz[1][1][9]);
  }
  navigateToScanner(position: string) {
    this.router.navigate(['/scanner', position]);
  }
  getCellPosition(x: number, y: number): string {
    return `x${x},y${y}`;
  }

  getRowNumbers(): number[] {
    return Array(this.rows).fill(0).map((_, index) => index + 1);
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

  getAllOrders() {
    var date1 = new Date();
    this.totalDay = 0;
    //var date2 = new Date(date1.getFullYear(),date1.getMonth(),date1.getDay()+4,date1.getHours(),date1.getMinutes(),date1.getSeconds(),date1.getMilliseconds());
    //console.log(date2);

    var start = new Date(date1);
    start.setHours(0, 0, 0, 0);
    start.setDate(date1.getDate());


    let startTime = start.getTime();
    console.log(start.getTime());

    this.db.list('orders/', ref => ref.orderByChild('createdAt').startAt(startTime)).snapshotChanges().subscribe((data: any) => {

      let tmp = [];
      data.forEach(order => {
        tmp.push({ key: order.key, ...order.payload.val() })
      })
      this.allOrders = tmp;
      this.allOrders.forEach((ele:any) => {
        ele.weight = 0;
        ele.cart.forEach((res:any) => {
          ele.weight = ele.weight + parseFloat(res.Kgs);
        });
        this.totalDay = this.totalDay + ele.finalPrice;
      });
      this.orders = tmp.reverse();
      console.log(this.orders);
    });
  }

  ngOnDestroy(){
    console.log("Destruyendo componente");
  }

}
