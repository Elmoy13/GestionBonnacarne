import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  product: any = {};
  category: any = {};
  order: any = {};
  driver: any = {};

  constructor() { }

  setProduct(obj) {
    return this.product = obj;
  }
  getProduct() {
    return this.product;
  }

  setCategory(obj) {
    return this.category = obj;
  }
  getCategory() {
    return this.category;
  }

  setOrder(obj) {
    return this.order = obj;
  }
  getOrder() {
    return this.order;
  }

  setDriver(obj) {
    return this.driver = obj;
  }
  getDriver() {
    return this.driver;
  }


}
