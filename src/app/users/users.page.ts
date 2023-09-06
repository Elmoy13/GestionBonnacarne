import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users = [];
  orders = [];

  constructor(
    private afdb: AngularFireDatabase,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.getUsers();
    this.getOrders();
  }

  getUsers() {
    this.afdb.list('/users').snapshotChanges().subscribe((data: any) => {
      console.log(data);
      let tmp = [];
      data.forEach(user => {
        tmp.push({
          key: user.key,
          ...user.payload.val(),
          paidOrdersCount: 0 // Agregar la propiedad paidOrdersCount inicializada en 0
        });
      });
      this.users = tmp;
      this.countPaidOrdersForUsers();
    });
  }

  getOrders() {
    this.afdb.list('/orders').snapshotChanges().subscribe((data: any) => {
      console.log(data);
      let tmp = [];
      data.forEach(user => {
        tmp.push({
          key: user.key,
          ...user.payload.val()
        });
      });
      this.orders = tmp;
      this.countPaidOrdersForUsers();
    });
  }

  countPaidOrdersForUsers() {
    // Iterar sobre la lista de usuarios
    this.users.forEach(user => {
      // Contador para este usuario específico
      let paidOrdersCount = 0;
  
      // Iterar sobre la lista de pedidos
      this.orders.forEach(order => {
        // Comprobar si el "userName" en "orders" coincide con el "name" en "users"
        // y si el "orderStatus" es igual a "Pagado"
        if (order.userId === user.uid && order.orderStatus === 'Pagado') {
          paidOrdersCount++;
        }
      });
      
      // Asignar el contador al usuario correspondiente
      user.paidOrdersCount = paidOrdersCount;
    });

    // Luego de contar y actualizar los paidOrdersCount, ordenar la lista de usuarios
    this.users.sort((a, b) => b.paidOrdersCount - a.paidOrdersCount);
  }

  call(mobile) {
    window.open('tel:' + mobile);
  }

}
