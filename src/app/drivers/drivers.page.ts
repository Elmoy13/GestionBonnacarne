import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.page.html',
  styleUrls: ['./drivers.page.scss'],
})
export class DriversPage implements OnInit {

  drivers = []
  constructor(
    private afAuth: AngularFireAuth,
    private afdb: AngularFireDatabase,
    private common: CommonService,
    private router: Router,
    private db: DbService
  ) { }

  ngOnInit() {
    this.getDrivers();
  }

  view(obj) {
    this.db.setDriver(obj);
    this.router.navigateByUrl('/managedrivers');
  }

  changeDriverStatus(key, status) {
    this.afdb.object('drivers/' + key).update({
      isApproved: !status
    }).then(() => {
      this.common.showToast("Updated");
    }).catch((err) => {
      this.common.showToast("Something went wrong");
    })
  }



  getDrivers() {
    this.afdb.list('drivers').snapshotChanges().subscribe((data: any) => {

      let tmp = [];
      data.forEach(user => {

        let driverPin: any = user.payload.val().pincodes;
        let driverPinStr;

        if (driverPin != undefined && driverPin != null) {
          driverPinStr = Object.keys(driverPin).toString();
          console.log(driverPinStr);
        }

        tmp.push({
          key: user.key,
          pinStr: driverPinStr,
          ...user.payload.val()
        })

      })
      this.drivers = tmp;
      console.log(this.drivers);
    });

  }

}
