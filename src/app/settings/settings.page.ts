import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  pincodes: any = [];
  lang: any = 'en';
  settings: any = {};
  isPushEnabled = false;

  constructor(
    private afdb: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private common: CommonService,
    private translate: TranslateService,
    private firebase: FirebaseX,
  ) {
    this.isPushEnabled = (localStorage.getItem('isPushEnabled') == 'true');
  }

  changePush() {
    if (this.isPushEnabled == true) {
      localStorage.setItem('isPushEnabled', 'true');
      this.firebase.getToken().then(token => {
        this.afdb.object('settings').update({ pushToken: token, isPushEnabled: true }).then(() => this.common.showToast("updated"))
      })

      this.firebase.onMessageReceived().subscribe(data => console.log(data))

    }
    else {
      localStorage.setItem('isPushEnabled', 'false');
      this.afdb.object('settings').update({ pushToken: '', isPushEnabled: false }).then(() => this.common.showToast("updated"))
    }
  }

  ngOnInit() {

    this.lang = localStorage.getItem('lang');

    this.afdb.object('settings').valueChanges().subscribe((res: any) => {
      console.log(res);
      let tmp = [];
      console.log()
      Object.keys(res.pincodes).forEach(pin => {
        tmp.push(pin);
      })
      this.pincodes = tmp.toString();
      this.settings = res.settings;
    })
  }

  changeLang() {
    this.translate.use(this.lang);
    localStorage.setItem('lang', this.lang);
  }

  save() {
    let pin = {};
    this.pincodes = this.pincodes.split(",")
    this.pincodes.forEach((data, index) => {
      let p = data.trim();
      pin[p] = true
    });
    this.afdb.object('settings').update({
      pincodes: pin,
      settings: this.settings
    }).then(() => {
      this.common.showToast("Actualizado");
    }).catch(() => {
      this.common.showToast("Algo salio mal!");
    });
  }

}
