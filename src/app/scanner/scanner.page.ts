import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { NavigationExtras } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';


@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {

  output: any = '';
  isScanning: boolean = false;
  isOpen: boolean = false;
  button: any;
  positionTitle: string;
  scannedData: any = {
    Codigo: '',
    Producto: '',
    Lote: '',
    FechaEmpaque: '',
    FechaCaducidad: '',
    Unidades: 0,
  };
  showManualForm: boolean = false;
  product: any;
  products: any[] = []; // Asegúrate de inicializar esta variable con tus productos
  filteredProducts: any[] = [];
  constructor(
    private DB: DbService,
    private router: Router,
    private db: AngularFireDatabase,
    private androidPermissions: AndroidPermissions,
    private alertController: AlertController,
    private productService: ProductsService,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.positionTitle = this.route.snapshot.paramMap.get('position');
    this.solicitarPermisosCamara();

    const loading = await this.loadingController.create({
      message: 'Cargando...', // Puedes personalizar el mensaje
    });
    await loading.present();

    this.route.queryParams.subscribe(async (params) => {
      this.productService.getAllProducts()
        .subscribe(
          (data) => {
            this.product = data.data;
            this.products = this.product;  // Asigna los datos a 'products'
    this.filteredProducts = this.products;
            console.log(data);

            // Oculta el loader después de recibir la respuesta del servicio
            loading.dismiss();
          },
          (error) => {
            // En caso de error, también debes ocultar el loader
            loading.dismiss();

            // Maneja el error
          }
        );
    });
  }
  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.Descripcion.toLowerCase().includes(searchTerm) ||
        product.CodProd.toLowerCase().includes(searchTerm)
    );
  }
  
  selectProduct(product: any) {
    // Al seleccionar un producto, actualiza el código en scannedData
    this.scannedData.Codigo = product.CodProd;
    // Puedes agregar más lógica aquí según tus necesidades
  
    // También puedes ocultar la lista de resultados si lo deseas
    this.filteredProducts = [];
  }
  ionViewDidEnter() {
    this.solicitarPermisosCamara();
  }

  async solicitarPermisosCamara() {
    try {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.CAMERA
      );

      if (!result.hasPermission) {
        this.mostrarAlertaPermisos();
      }
    } catch (error) {
      console.error('Error al solicitar permisos de cámara', error);
    }
  }

  async mostrarAlertaPermisos() {
    const alert = await this.alertController.create({
      header: 'Permisos de Cámara',
      message: 'Esta aplicación necesita acceder a la cámara. ¿Conceder permisos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Permisos de cámara cancelados');
          }
        },
        {
          text: 'Conceder',
          handler: () => {
            this.solicitarPermisosCamara();
          }
        }
      ]
    });

    await alert.present();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.scannedData.FechaEmpaque > this.scannedData.FechaCaducidad) {
        this.mostrarAlerta('La fecha de empaque no puede ser posterior a la fecha de caducidad.');
        return;
      }
      if (this.scannedData.Unidades === 0) {
        this.mostrarAlerta('El peso debe ser mayor que 0.');
        return;
      }
      // Puedes agregar más lógica de validación aquí según tus necesidades

      console.log('Datos enviados manualmente:', this.scannedData);
      const navigationExtras: NavigationExtras = {
        queryParams: {
          scannedData: JSON.stringify(this.scannedData),
          position: this.positionTitle
        }
      };

      this.router.navigate(['/bands'], navigationExtras);
    } else {
      this.mostrarAlerta('Por favor, completa todos los campos del formulario.');
    }
  }

  mostrarAlerta(mensaje: string) {
    this.alertController.create({
      header: 'Error de validación',
      message: mensaje,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  toggleManualForm() {
    this.showManualForm = !this.showManualForm;
  }

  navigateToBands(x: number, y: number) {
    this.router.navigate(['/bands']);
  }

  redirectOrder(orderInfo: any) {
    if (!this.isScanning) {
      this.isScanning = true;
      this.output = orderInfo;
      let infoScanned = JSON.parse(this.output);
      if (infoScanned) {
        this.scannedData = infoScanned;
        
        const navigationExtras: NavigationExtras = {
          queryParams: {
            scannedData: JSON.stringify(this.scannedData),
            position: this.positionTitle
          }
        };
  
        this.router.navigate(['/bands'], navigationExtras);
      }
    }
  }

  activeCamara() {
    this.solicitarPermisosCamara(); 
    this.isOpen = true;
    setTimeout(() => {
      const scanner = document.getElementById("scan");
      scanner.click();
    }, 1000);
  }

}
