import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BandsPageRoutingModule } from './bands-routing.module';

import { BandsPage } from './bands.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BandsPageRoutingModule
  ],
  declarations: [BandsPage]
})
export class BandsPageModule {}
