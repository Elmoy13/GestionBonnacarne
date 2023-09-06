import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  loader: any;

  constructor(
    private toast: ToastController,
    private loadCtrl: LoadingController
  ) { }

  showToast(message) {
    this.toast.create({
      message: message,
      duration: 2000
    }).then(d => d.present());
  }

  showLoader() {
    this.loadCtrl.create({ spinner: 'circular', duration: 5000 }).then(res => {
      this.loader = res;
      this.loader.present();
    });
  }

  hideLoader() {
    if (this.loader != null)
      this.loader.dismiss()
    else
      this.loader = null;
  }
}
