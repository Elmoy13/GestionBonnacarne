import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  products: any = [];
  categories: any = [];
  currency: any = '';
  product: any = {};
  isEdit = false;
  isShow = false;

  constructor(
    private afdb: AngularFireDatabase,
    private common: CommonService,
    private afStorage: AngularFireStorage,
    private modalCtrl: ModalController
  ) {
    this.currency = environment.currency
  }

  ngOnInit() {
    this.afdb.list('/products').snapshotChanges().subscribe((data: any) => {
      this.products = [];
      data.forEach(p => this.products.push({ key: p.key, ...p.payload.val() }))
      this.fetchCategory();
    });
    console.log(this.products);
  }

  edit(p) {
    this.isEdit = true;
    this.product = p;
    this.isShow = true;
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
    this.isEdit = false;
    this.product = {};
    this.isShow = false;
  }

  chooseFile() {
    document.getElementById('avatar').click();
  }

  upload() {
    this.common.showLoader();
    // Create a root reference
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      let path = '/products/' + Date.now() + `_${selectedFile.name}`;
      let ref = this.afStorage.ref(path)
      ref.put(selectedFile).then(() => {
        ref.getDownloadURL().subscribe(data => { this.product.photoURL = data; });
        this.common.hideLoader();
      }).catch(err => {
        console.log(err);
        this.common.hideLoader();
      });

    }
  }

  add() {
    this.afdb.database.ref('products').push(this.product).then(data => {
      this.common.showToast("Added");
      this.reset();
    }).catch(err => {
      console.log(err);
      this.common.showToast("Something went wrong");
    });
  }

  fetchCategory() {
    this.afdb.list('categories/').snapshotChanges().subscribe((res: any) => {
      res.forEach(c => this.categories.push({ key: c.key, ...c.payload.val() }));
    })
  }

  update() {
    this.afdb.database.ref('products/' + this.product.key).update(this.product).then(data => {
      console.log("Updated");
      this.common.showToast("Updated");
      this.reset();
    }).catch(err => {
      console.log(err);
      this.common.showToast("Something went wrong");
    });
  }

  delete() {
    this.afdb.database.ref('products/' + this.product.key).remove().then(data => {
      console.log("deleted");
      this.common.showToast("Deleted");
      this.reset();
    }).catch(err => {
      console.log(err);
      this.common.showToast("Something went wrong");
    });
  }

}
