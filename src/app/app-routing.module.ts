import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then(m => m.CategoryPageModule)
  },
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/drivers.module').then(m => m.DriversPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'managedrivers',
    loadChildren: () => import('./managedrivers/managedrivers.module').then(m => m.ManagedriversPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'orders/:type/:id',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule)
  },
  {
    path: 'view-order',
    loadChildren: () => import('./view-order/view-order.module').then(m => m.ViewOrderPageModule)
  },
  {
    path: 'bands',
    loadChildren: () => import('./bands/bands.module').then( m => m.BandsPageModule)
  },
  {
    path: 'scanner/:position', // Cambia :position a :string para capturar la posición completa
    loadChildren: () => import('./scanner/scanner.module').then(m => m.ScannerPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
