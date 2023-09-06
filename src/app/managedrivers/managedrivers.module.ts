import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagedriversPageRoutingModule } from './managedrivers-routing.module';

import { ManagedriversPage } from './managedrivers.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagedriversPageRoutingModule,
    TranslateModule
  ],
  declarations: [ManagedriversPage]
})
export class ManagedriversPageModule {}
