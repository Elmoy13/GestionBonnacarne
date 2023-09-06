import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagedriversPage } from './managedrivers.page';

const routes: Routes = [
  {
    path: '',
    component: ManagedriversPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagedriversPageRoutingModule {}
