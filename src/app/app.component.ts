import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment.prod';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home-outline'
    },
    /*{
      title: 'Productos',
      url: '/products',
      icon: 'basket-outline'
    },
    {
      title: 'Categorias',
      url: '/category',
      icon: 'albums-outline'
    },*/
    // {
    //   title: 'Ordenes',
    //   url: '/orders',
    //   icon: 'cart-outline'
    // },
    // {
    //  title: 'Escáner QR',
    //  url: '/scanner',
    //   icon: 'scan-circle'
    // },
    /*{
      title: 'DRIVERS',
      url: '/drivers',
      icon: 'car-outline'
    },*/
    // {
    // title: 'Usuarios',
    //    url: '/users',
    //    icon: 'person-outline'
    //  }, 
   /* {
      title: 'Bandas',
      url: '/bands',
      icon: 'add-outline'
    },*/
    // {
    //   title: 'Configuración',
    //   url: '/settings',
    //   icon: 'settings-outline'
    // }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    private router: Router,
    private translate: TranslateService,
    private menuCtrl: MenuController,
    private common: CommonService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') == undefined)
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'))


    this.translate.onLangChange.subscribe((event) => {
      localStorage.setItem('lang', event.lang);

      let lang = event.lang;
      let dir = 'ltr';

      if (event.lang == 'ar')
        dir = 'rtl';

      else
        dir = 'ltr';

      document.getElementsByTagName("html")[0].setAttribute('lang', lang);
      document.getElementsByTagName("body")[0].setAttribute('dir', dir);
    });

    this.afAuth.authState.subscribe((data) => {
      if (data == null) {
        this.menuCtrl.enable(false);
        this.common.showToast("Not Authorized")
        this.router.navigateByUrl('/login');
      }
      else {
        if (data.email == environment.adminEmail) {
          localStorage.setItem("role","admin")
          this.menuCtrl.enable(true);
          this.router.navigateByUrl('/');
        }else if (data.email == environment.superAdminEmail) {
          localStorage.setItem("role","superAdmin")
          this.menuCtrl.enable(true);
          this.router.navigateByUrl('/');
        }
        else {
          this.common.showToast("Not Authorized")
          this.afAuth.signOut();
          this.menuCtrl.enable(false);
          this.router.navigateByUrl('/login');
        }
      }

    })

  }

  logout() {
    this.afAuth.signOut();
    localStorage.setItem("role"," ")
  }
}
