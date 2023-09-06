import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  isEdit = false;
  category: any = {};
  categories: any = [];
  isShow = false;

  constructor(
    private common: CommonService,
    private afDb: AngularFireDatabase,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.fetchCategory();
  }

  fetchCategory() {
    this.common.showLoader();
    this.afDb.list('categories/').snapshotChanges().subscribe((res: any) => {
      this.categories = [];
      res.forEach(c => this.categories.push({ key: c.key, ...c.payload.val() }));
      this.common.hideLoader();
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

  chooseFile() {
    document.getElementById('avatar').click();
  }

  upload() {
    this.common.showLoader();
    // Create a root reference
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      let path = '/category/' + Date.now() + `_${selectedFile.name}`;
      let ref = this.afStorage.ref(path)
      ref.put(selectedFile).then(() => {
        ref.getDownloadURL().subscribe(url => { this.category.photoURL = url; });
        this.common.hideLoader();
      }).catch(err => {
        console.log(err)
        this.common.showToast("Something went wrong");
        this.common.hideLoader();
      });

    }
  }

  reset() {
    this.category = {};
    this.isEdit = false;
    this.isShow = false;
  }

  edit(c) {
    this.category = c;
    this.isEdit = true;
    this.isShow = true;
  }

  add() {
    this.common.showLoader();
    this.afDb.list('categories/').push(this.category).then(res => {
      this.common.hideLoader();
      this.common.showToast("Added Successfully");
      this.reset();
    }).catch(e => {
      this.common.hideLoader();
      this.common.showToast("something went wrong");
    })
  }

  update() {
    this.common.showLoader();
    this.afDb.object('categories/' + this.category.key).update(this.category).then(res => {
      this.common.hideLoader();
      this.common.showToast("Updated Successfully");
      this.reset();
    }).catch(e => {
      this.common.hideLoader();
      this.common.showToast("something went wrong");
    })
  }

  delete() {
    this.common.showLoader();
    this.afDb.object('categories/' + this.category.key).remove().then(res => {
      this.common.hideLoader();
      this.common.showToast("Deleted Successfully");
      this.reset();
    }).catch(e => {
      this.common.hideLoader();
      this.common.showToast("something went wrong");
    })
  }


}
