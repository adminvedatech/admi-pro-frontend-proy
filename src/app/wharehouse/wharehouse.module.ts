import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WharehouseRoutingModule } from './wharehouse-routing.module';
import { MovementWharehouseComponent } from './movement-wharehouse/movement-wharehouse.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AddMovementWharehouseComponent } from './add-movement-wharehouse/add-movement-wharehouse.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MovementWharehouseComponent, InventoryComponent, AddMovementWharehouseComponent],
  imports: [
    CommonModule,
    WharehouseRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class WharehouseModule { }
