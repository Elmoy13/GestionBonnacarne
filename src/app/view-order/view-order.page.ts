import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { environment } from 'src/environments/environment.prod';
import { CommonService } from '../services/common.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {

  order: any = {};
  drivers: any = [];
  currency: any;
  role: any;

  constructor(
    private db: DbService,
    private afdb: AngularFireDatabase,
    private common: CommonService
  ) {
    this.currency = environment.currency
  }

  ngOnInit() {
    this.getDrivers();
  }

  ionViewDidEnter() {
    this.order = this.db.getOrder();
    console.log(this.order);
    this.order.weight = 0;
    this.order.cart.forEach((res:any) => {
      this.order.weight = this.order.weight + parseFloat(res.Kgs);
        });
    this.role = localStorage.getItem('role');
    console.log(this.role);
  }

  call(mobile) {
    window.open('tel:' + mobile);
  }

  openMap() {
    window.open('https://www.google.com/maps?saddr=Current+Location&daddr=' + this.order.address.lat + ',' + this.order.address.lng);
  }

  updateStatus(key, status) {
    this.afdb.object('orders/' + key).update({
      orderStatus: status
    }).then(() => {
      this.common.showToast("Updated");
    }).catch((err) => {
      this.common.showToast("Something went wrong");
    })
  }

  updateDriver(key, driverId) {
    this.afdb.object('orders/' + key).update({
      driverId: driverId
    }).then(() => {
      this.common.showToast("Updated");
    }).catch((err) => {
      this.common.showToast("Something went wrong");
    })
  }


  getDrivers() {

    this.afdb.list('drivers').snapshotChanges().subscribe((data: any) => {
      console.log(data);
      let tmp = [];
      data.forEach(user => {
        if (user.payload.val().isApproved == true || user.payload.val().isApproved == "true") {
          tmp.push({
            key: user.key,
            ...user.payload.val()
          })
        }
      })
      this.drivers = tmp;

    });
    console.log(this.drivers);
  }



}
