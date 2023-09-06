import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CommonService } from '../services/common.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-managedrivers',
  templateUrl: './managedrivers.page.html',
  styleUrls: ['./managedrivers.page.scss'],
})
export class ManagedriversPage implements OnInit {

  driver: any = {};

  constructor(
    private afdb: AngularFireDatabase,
    private common: CommonService,
    private db: DbService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.driver = this.db.getDriver();
  }

  call(mobile) {
    window.open('tel:' + mobile);
  }

  updatePincode(key, pin) {
    console.log(key, pin);

    let pinObj = {};
    let pinArr = pin.split(",")

    pinArr.forEach((data, index) => {
      let p = data.trim();
      pinObj[p] = true
    });

    this.afdb.object('drivers/' + key).update({
      pincodes: pinObj
    }).then(() => {
      this.common.showToast("Updated");
    }).catch(() => {
      this.common.showToast("Something went wrong");
    });
  }

}
