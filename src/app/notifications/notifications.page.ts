import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertController } from '@ionic/angular';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  isEdit = false;
  notification: any = {};
  notifications: any = [];
  banners: any = [];
  banner: any = {};
  isShow = false;

  constructor(
    private common: CommonService,
    private afDb: AngularFireDatabase,
    private afStorage: AngularFireStorage,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.fetchNotifications();
  }

  fetchNotifications() {
    this.common.showLoader();
    this.afDb.list('notifications/').snapshotChanges().subscribe((res: any) => {
      this.notifications = [];
      res.forEach(c => this.notifications.push({ key: c.key, ...c.payload.val() }));
      this.common.hideLoader();
      this.fetchBanners()
    })
  }

  fetchBanners() {
    this.common.showLoader();
    this.afDb.list('banners/').snapshotChanges().subscribe((res: any) => {
      this.banners = [];
      res.forEach(c => this.banners.push({ key: c.key, ...c.payload.val() }));
      this.common.hideLoader();
    })
  }

  chooseFile() {
    document.getElementById('avatar').click();
  }

  upload() {
    this.common.showLoader();
    // Create a root reference
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      let path = '/banners/' + Date.now() + `_${selectedFile.name}`;
      let ref = this.afStorage.ref(path)
      ref.put(selectedFile).then(() => {
        ref.getDownloadURL().subscribe(url => this.addBanner(url));
        this.common.hideLoader();
      }).catch(err => {
        console.log(err);
        this.common.hideLoader();
      });

    }
  }

  addBanner(url) {
    this.common.showLoader();
    this.afDb.list('banners/').push({ url: url }).then(res => {
      this.common.hideLoader();
      this.common.showToast("Added Successfully");
    }).catch(e => {
      this.common.hideLoader();
      this.common.showToast("something went wrong");
    })
  }

  deleteBanner(key) {
    this.common.showLoader();
    this.afDb.object('banners/' + key).remove().then(res => {
      this.common.hideLoader();
      this.common.showToast("Deleted Successfully");
    }).catch(e => {
      this.common.hideLoader();
      this.common.showToast("something went wrong");
    })
  }

  openEditor() {
    this.reset();
    this.isShow = true;
  }

  closeEditor() {
    this.reset();
    this.isShow = false;
  }

  reset() {
    this.notification = {};
    this.isShow = false;
  }

  add() {
    this.common.showLoader();
    this.afDb.list('notifications/').push(this.notification).then(res => {
      this.common.hideLoader();
      this.common.showToast("Added Successfully");
      this.reset();
    }).catch(e => {
      this.common.hideLoader();
      this.common.showToast("something went wrong");
    })
  }

  delete(key) {
    this.common.showLoader();
    this.afDb.object('notifications/' + key).remove().then(res => {
      this.common.hideLoader();
      this.common.showToast("Deleted Successfully");
      this.reset()
    }).catch(e => {
      this.common.hideLoader();
      this.common.showToast("something went wrong");
    })
  }


}
