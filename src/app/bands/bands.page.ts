import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { CommonService } from '../services/common.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-bands',
  templateUrl: './bands.page.html',
  styleUrls: ['./bands.page.scss'],
})
export class BandsPage implements OnInit {


  arrayAllProducts: Array<any> = [];
  // arrayProducts: Array<any> = [
  //   {
  //     detail: 'Chuleta de cerdo 1 kg'
  //   },
  //   {
  //     detail: 'Tocino de cerdo 1 kg'
  //   },
  //   {
  //     detail: 'Carne molida 1 kg'
  //   }
  // ];

  arrayBands: Array<any> = [];

  form: FormGroup;
  x: any;
  y: any;
  order: any = {};
  drivers: any = [];
  currency: any;
  role: any;
  constructor(
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public toastController: ToastController,
    private productService: ProductsService,
    
    private db: DbService,
  private router: Router,
  private afdb: AngularFireDatabase,
  private route: ActivatedRoute,
  private common: CommonService) {
    this.getAllProducts();
    this.currency = environment.currency
  }


  ngOnInit() {
    this.buildForm();
    this.getDrivers();
    this.x = this.route.snapshot.paramMap.get('x');
    
    this.y = this.route.snapshot.paramMap.get('y');
    console.log(this.x);
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

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (res) => {
        res.data.forEach(element => {          
          if(element.Estado === "Activo    ") this.arrayAllProducts.push(element);
        });                
        console.log(this.arrayAllProducts);
      },
      (err) => {
        console.log(err);
      }
    );
  }


  buildForm(): void {
    this.form = this.formBuilder.group({
      x: ['', [Validators.required]],
      y: ['', [Validators.required]],
      product: ['', [Validators.required]]
    });
  }


  createBand() {
    this.arrayBands.push(this.form.value);
  }


  async presentAlertConfirm(posicion: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Borrar producto',
      message: '¿Estás seguro de que deseas <strong>borrar</strong> este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Borrar',
          handler: () => {
            if (posicion > -1) {
              this.arrayBands.splice(posicion, 1)
              this.presentToast('Producto borrado', 2000);
            };
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(msj: string, time: number) {
    const toast = await this.toastController.create({
      message: msj,
      duration: time
    });
    toast.present();
  }

}
