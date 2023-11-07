import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingController } from '@ionic/angular'; // Importa el LoadingController

import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-bands',
  templateUrl: './bands.page.html',
  styleUrls: ['./bands.page.scss'],
})
export class BandsPage implements OnInit {

  positionTitle: string;
  arrayAllProducts: Array<any> = [];


  arrayBands: Array<any> = [];

  form: FormGroup;
  order: any = {};
  drivers: any = [];
  currency: any;
  role: any;
  scannedData: any;
  xValue: number | undefined; // Variable para almacenar el valor de x
  yValue: number | undefined; // Variable para almacenar el valor de y
  product: any = {};
  constructor(
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public toastController: ToastController,
    private productService: ProductsService,
    
    private db: DbService,
  private router: Router,
  private afdb: AngularFireDatabase,
  private route: ActivatedRoute,
  private common: CommonService,
  private loadingController: LoadingController,) {
   
    
  }


  ngOnInit() {
    this.positionTitle = this.route.snapshot.queryParamMap.get('position');
    this.route.queryParams.subscribe(async (params) => {
      if (params.scannedData) {
        // Muestra el loader antes de hacer la llamada al servicio
        const loading = await this.loadingController.create({
          message: 'Cargando...', // Puedes personalizar el mensaje
        });
        await loading.present();

        this.scannedData = JSON.parse(params.scannedData);

        this.productService.getProductByCode(this.scannedData.Codigo)
          .subscribe(
            (data) => {
              this.product = data.data;
              console.log(data);
              this.calculateTotalPrice();

              // Oculta el loader después de recibir la respuesta del servicio
              loading.dismiss();
            },
            (error) => {
              // En caso de error, también debes ocultar el loader
              loading.dismiss();

              // Maneja el error
            }
          );
      }
      this.processPositionTitle(this.positionTitle);
    });
  }
  
  private processPositionTitle(title: string | undefined) {
    console.log("Cadena title recibida:", title); // Verifica el contenido de la cadena title
    if (title) {
      const matches = title.match(/[A-Za-z]\((\d+)-(\d+)\)/);
      console.log("Coincidencias:", matches); // Verifica si hubo coincidencias con la expresión regular
      if (matches && matches.length === 3) {
        this.xValue = parseInt(matches[1], 10);
        this.yValue = parseInt(matches[2], 10);
        console.log("la posicion de x es " + this.xValue);
        console.log("la posicion de y es " + this.yValue);
        console.log("la posicion holoas de y es " + this.yValue);

      }
    }
  }
  
  
  calculateTotalPrice(): number {
    if (this.product && this.scannedData) {
      const precioUnitario = parseFloat(this.product.Publico);
      const unidades = parseFloat(this.scannedData.Unidades);
      return precioUnitario * unidades;
    }
    return 0; // Valor predeterminado si no se puede calcular el precio total
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

  async sendBandaData() {
    const data = {
      IDBanda: this.positionTitle,
      EjeX: this.xValue,
      EjeY: this.yValue,
      CodProd: this.scannedData.Codigo,
      Kgs: this.scannedData.Unidades,
      Precio: this.product.Publico,
      Estatus: 1,
    };
  
    try {
      const location = 'Tlaquepaque'; // or 'Tlaquepaque' based on your logic
  
      this.productService.sendBandaData(data, location).subscribe(
        () => {
          // Show a success message
          this.presentAlert('Éxito', 'Datos guardados exitosamente');
        },
        (error) => {
          // Handle any errors here and show an error message
          this.presentAlert('Error', 'No se pudo guardar los datos. Inténtalo de nuevo.');
          console.error('Error sending data to the server:', error);
        }
      );
    } catch (error) {
      // Handle any errors here
      console.error('Error sending data to the server:', error);
    }
  }
  
  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }

}
