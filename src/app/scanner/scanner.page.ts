import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { NavigationExtras } from '@angular/router';
import { NgForm } from '@angular/forms';
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
  constructor(
    private DB: DbService,
    private router: Router,
    private db: AngularFireDatabase,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.positionTitle = this.route.snapshot.paramMap.get('position');
  }

  ionViewDidEnter() {
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      // Los datos del formulario son válidos, puedes hacer lo que necesites con ellos.
      console.log('Datos enviados manualmente:', this.scannedData);
      // Agregar la posición como un parámetro en la URL
      const navigationExtras: NavigationExtras = {
        queryParams: {
          scannedData: JSON.stringify(this.scannedData),
          position: this.positionTitle // Aquí agregamos la posición
        }
      };

      this.router.navigate(['/bands'], navigationExtras);
    }
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
        
        // Agregar la posición como un parámetro en la URL
        const navigationExtras: NavigationExtras = {
          queryParams: {
            scannedData: JSON.stringify(this.scannedData),
            position: this.positionTitle // Aquí agregamos la posición
          }
        };
  
        this.router.navigate(['/bands'], navigationExtras);
      }
    }
  }

  activeCamara() {
    this.isOpen = true;
    setTimeout(() => {
      const scanner = document.getElementById("scan");
      scanner.click();
    }, 1000);
    //qrcode.click();
  }

}
