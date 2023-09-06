import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MenuController } from '@ionic/angular';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: any;
  password: any;

  constructor(
    private afAuth: AngularFireAuth,
    private menuCtrl: MenuController,
    private common: CommonService
  ) {

  }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

  login() {
    this.common.showLoader();
    this.afAuth.signInWithEmailAndPassword(this.email, this.password).then(data => {
      console.log(data);
      console.log("hola");
      this.common.hideLoader();
    }).catch(err => {
      console.log(err);
      this.common.showToast("Something Went wrong");
      this.common.hideLoader();
    })
  }

}
